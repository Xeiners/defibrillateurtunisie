import { writeFileSync } from 'node:fs'
import { buildConfirmationEmail, buildQuoteEmail } from './email.mjs'

/**
 * Écrit les deux mails d'une demande d'exemple : `apercu.html` (ce que reçoit
 * l'équipe) et `apercu-client.html` (le récapitulatif du visiteur).
 *
 * Sert à juger la mise en page du mail sans rien lancer ni configurer :
 * `npm run apercu`, puis on ouvre le fichier dans un navigateur. Le rendu final
 * reste celui du client de messagerie, mais la structure et les couleurs y sont.
 */
const EXEMPLE = {
  etablissement: 'Clinique El Manar',
  secteur: 'Cliniques',
  ville: 'Tunis',
  nom: 'Sami Ben Ali',
  telephone: '+216 20 000 000',
  email: 'sami.benali@clinique-elmanar.tn',
  echeance: 'Dans le mois',
  message:
    'Deux bâtiments, trois étages chacun.\nNous aimerions un appareil par étage à terme, en commençant par les accueils.',
  packs: [
    { name: 'Confort', device: 'ZOLL AED Plus', months: 36, quantity: 2, monthly: 135 },
    { name: 'Premium', device: 'Powerheart G5', months: 24, quantity: 1, monthly: 195 },
  ],
  monthlyTotal: 465,
}

const team = buildQuoteEmail(EXEMPLE)
const visitor = buildConfirmationEmail(EXEMPLE, { contactEmail: 'contact@defib.tn' })

writeFileSync(new URL('./apercu.html', import.meta.url), team.html)
writeFileSync(new URL('./apercu-client.html', import.meta.url), visitor.html)

console.log(`Équipe   : ${team.subject}`)
console.log('           server/apercu.html')
console.log(`Visiteur : ${visitor.subject}`)
console.log('           server/apercu-client.html')
console.log('Ouvrez-les dans un navigateur.')
