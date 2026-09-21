import 'dotenv/config'
import express from 'express'
import nodemailer from 'nodemailer'
import { buildConfirmationEmail, buildQuoteEmail } from './email.mjs'

/**
 * Service d'envoi des demandes de devis.
 *
 * Il existe pour UNE raison : le SMTP ne peut pas partir d'un navigateur. SMTP
 * est un protocole TCP, une page web n'ouvre pas de socket TCP — et des
 * identifiants Gmail placés dans le front seraient lisibles par quiconque
 * ouvre le code source. Ils vivent donc ici, dans `.env`, et ne quittent
 * jamais le serveur.
 *
 * Le service ne fait qu'une chose : recevoir des données de formulaire, les
 * vérifier, composer le mail et l'envoyer. Voir `README.md` à côté.
 */

/**
 * Valeurs d'exemple de `.env.example`.
 *
 * Copier le fichier sans le remplir est le premier geste de tout le monde. Sans
 * ce garde-fou, le service croirait avoir des identifiants, tenterait une
 * connexion Gmail et échouerait à chaque envoi avec une erreur d'authentification
 * — alors que ce qu'on veut, dans ce cas, c'est le mode démonstration.
 */
const PLACEHOLDERS = ['contact@votredomaine.tn', 'xxxx xxxx xxxx xxxx']

function configured(value) {
  const trimmed = String(value ?? '').trim()
  return trimmed === '' || PLACEHOLDERS.includes(trimmed) ? undefined : trimmed
}

const PORT = Number(process.env.PORT ?? 8787)
const SMTP_USER = configured(process.env.SMTP_USER)
const SMTP_PASSWORD = configured(process.env.SMTP_PASSWORD)
const MAIL_TO = configured(process.env.MAIL_TO) ?? SMTP_USER
const MAIL_FROM_NAME = configured(process.env.MAIL_FROM_NAME) ?? 'Defibrillateur.TN'
const ALLOWED_ORIGIN = configured(process.env.ALLOWED_ORIGIN) ?? ''

/** Longueurs maximales : un formulaire honnête tient largement dedans. */
const LIMITS = {
  etablissement: 160,
  secteur: 80,
  ville: 80,
  nom: 120,
  telephone: 40,
  email: 160,
  echeance: 80,
  message: 4000,
}

/**
 * Choisit par quoi le message part.
 *
 * Sans identifiants, on bascule sur une BOÎTE DE DÉMONSTRATION : rien n'est
 * réellement envoyé, et nodemailer renvoie une adresse où lire le message tel
 * qu'il arrivera. C'est ce qui permet d'essayer le formulaire — et de juger la
 * mise en page du mail — sans ouvrir de mot de passe d'application Google.
 *
 * Le jour où `.env` est renseigné, le vrai SMTP prend le relais sans rien
 * changer d'autre.
 */
async function createTransporter() {
  if (SMTP_USER && SMTP_PASSWORD) {
    return {
      transporter: nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
      }),
      isPreview: false,
      from: SMTP_USER,
    }
  }

  const account = await nodemailer.createTestAccount()
  return {
    transporter: nodemailer.createTransport({
      host: account.smtp.host,
      port: account.smtp.port,
      secure: account.smtp.secure,
      auth: { user: account.user, pass: account.pass },
    }),
    isPreview: true,
    from: account.user,
  }
}

const { transporter, isPreview, from } = await createTransporter()

const app = express()
app.set('trust proxy', 1)
app.use(express.json({ limit: '64kb' }))

// Même domaine en production (le serveur web relaie `/api/devis`) : il n'y a
// alors aucune origine croisée. `ALLOWED_ORIGIN` ne sert qu'au développement,
// où le front tourne sur un autre port.
if (ALLOWED_ORIGIN) {
  app.use((request, response, next) => {
    response.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN)
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    if (request.method === 'OPTIONS') return response.sendStatus(204)
    next()
  })
}

/**
 * Limite de débit, en mémoire.
 *
 * Une adresse qui envoie des mails, ouverte sur l'internet, finit par être
 * trouvée. Cinq demandes par quart d'heure et par IP suffisent à un
 * établissement, et coupent court à l'usage en robinet.
 */
const WINDOW_MS = 15 * 60 * 1000
const MAX_PER_WINDOW = 5
const hits = new Map()

function isOverLimit(ip) {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((time) => now - time < WINDOW_MS)
  recent.push(now)
  hits.set(ip, recent)

  // Ménage : sans cela la table grandit pour toujours.
  if (hits.size > 5000) {
    for (const [key, times] of hits) {
      if (times.every((time) => now - time >= WINDOW_MS)) hits.delete(key)
    }
  }

  return recent.length > MAX_PER_WINDOW
}

function clean(value, max) {
  return (
    String(value ?? '')
      // Caractères de contrôle retirés VOLONTAIREMENT : ils n'ont rien à faire
      // dans un formulaire, et ce sont eux qui servent à casser les en-têtes
      // d'un message pour en injecter d'autres.
      // oxlint-disable-next-line no-control-regex
      .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '')
      .trim()
      .slice(0, max)
  )
}

/** Assez strict pour écarter les fautes de frappe, assez large pour ne rien refuser d'valide. */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function readPacks(value) {
  if (!Array.isArray(value)) return []

  return value.slice(0, 10).flatMap((pack) => {
    if (typeof pack !== 'object' || pack === null) return []

    const months = Number(pack.months)
    const quantity = Number(pack.quantity)
    const monthly = Number(pack.monthly)
    if (![months, quantity, monthly].every(Number.isFinite)) return []

    return [
      {
        name: clean(pack.name, 60),
        device: clean(pack.device, 100),
        months: Math.max(0, Math.round(months)),
        quantity: Math.min(999, Math.max(1, Math.round(quantity))),
        monthly: Math.max(0, Math.round(monthly)),
      },
    ]
  })
}

app.post('/api/devis', async (request, response) => {
  if (isOverLimit(request.ip)) {
    return response.status(429).json({ error: 'Trop de demandes. Réessayez dans quelques minutes.' })
  }

  const body = request.body ?? {}

  // Champ piège rempli : c'est un robot. On répond « reçu » sans rien envoyer,
  // pour ne pas lui apprendre ce qui l'a trahi.
  if (clean(body.piege, 200) !== '') {
    return response.status(200).json({ ok: true })
  }

  const data = {
    etablissement: clean(body.etablissement, LIMITS.etablissement),
    secteur: clean(body.secteur, LIMITS.secteur),
    ville: clean(body.ville, LIMITS.ville),
    nom: clean(body.nom, LIMITS.nom),
    telephone: clean(body.telephone, LIMITS.telephone),
    email: clean(body.email, LIMITS.email),
    echeance: clean(body.echeance, LIMITS.echeance),
    message: clean(body.message, LIMITS.message),
    packs: readPacks(body.packs),
    monthlyTotal: Math.max(0, Math.round(Number(body.monthlyTotal) || 0)),
  }

  const missing = ['etablissement', 'nom', 'telephone', 'email'].filter((key) => data[key] === '')
  if (missing.length > 0 || !EMAIL.test(data.email)) {
    return response.status(400).json({ error: 'Champs manquants ou adresse invalide.' })
  }

  const { subject, html, text } = buildQuoteEmail(data)

  try {
    const info = await transporter.sendMail({
      from: `"${MAIL_FROM_NAME}" <${from}>`,
      to: MAIL_TO ?? from,
      // Répondre au mail répond AU VISITEUR : c'est ce qu'on veut faire dans
      // 100 % des cas, et cela évite de recopier son adresse à la main.
      replyTo: { name: data.nom, address: data.email },
      subject,
      html,
      text,
    })

    logPreview('Demande (équipe)', info)
    response.json({ ok: true })
  } catch (error) {
    console.error('Envoi impossible :', error)
    return response.status(502).json({ error: 'Le mail n’a pas pu être envoyé.' })
  }

  // Le récapitulatif au visiteur part APRÈS la réponse, et son échec ne remonte
  // pas : la demande est arrivée chez l'équipe, c'est ce qui compte. Le faire
  // attendre ajouterait un second aller-retour SMTP — une bonne seconde — au
  // temps que le visiteur passe devant « Envoi en cours… ».
  sendConfirmation(data).catch((error) => {
    console.error(`Récapitulatif non envoyé à ${data.email} :`, error)
  })
})

/** Le récapitulatif de sa demande, envoyé au visiteur. */
async function sendConfirmation(data) {
  const { subject, html, text } = buildConfirmationEmail(data, {
    contactEmail: MAIL_TO ?? from,
  })

  const info = await transporter.sendMail({
    from: `"${MAIL_FROM_NAME}" <${from}>`,
    // Forme objet : nodemailer échappe le nom lui-même, guillemets compris.
    to: { name: data.nom, address: data.email },
    // S'il répond, sa réponse arrive chez l'équipe — pas dans la boîte
    // d'envoi, que personne ne lit peut-être.
    replyTo: MAIL_TO ?? from,
    subject,
    html,
    text,
  })

  logPreview('Récapitulatif (visiteur)', info)
}

/** En démonstration, donne l'adresse où lire le message qui vient de « partir ». */
function logPreview(label, info) {
  if (!isPreview) return
  console.log('')
  console.log(`  ${label} — à lire ici :`)
  console.log(`  ${nodemailer.getTestMessageUrl(info)}`)
  console.log('')
}

app.get('/api/devis/sante', (_request, response) => response.json({ ok: true }))

app.listen(PORT, () => {
  console.log(`Service de devis à l'écoute sur le port ${PORT}`)

  if (isPreview) {
    console.log('')
    console.log('  MODE DÉMONSTRATION — aucun mail ne part réellement.')
    console.log('  Chaque envoi affichera ici une adresse pour lire le message.')
    console.log('  Pour envoyer pour de vrai : cp .env.example .env, puis SMTP_USER / SMTP_PASSWORD.')
    console.log('')
  } else {
    console.log(`Envoi réel vers ${MAIL_TO}`)
  }
})
