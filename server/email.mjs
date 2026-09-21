/**
 * Composition du mail de demande de devis.
 *
 * Le HTML est écrit ICI, sur le serveur, et jamais reçu du navigateur : sinon
 * n'importe qui pourrait poster son propre message à l'adresse d'envoi et le
 * faire partir depuis le domaine.
 *
 * Écrit aux règles des clients de messagerie, qui ne sont pas celles du web :
 * des TABLES et non des `flex`/`grid`, des styles EN LIGNE et non des classes,
 * une largeur fixe de 600 px, des polices système. Outlook ignore la moitié du
 * CSS moderne ; tout ce qui suit fonctionne partout depuis quinze ans.
 */

const NAVY = '#071224'
const NAVY_SOFT = '#52667f'
const NAVY_FAINT = '#a3b4ca'
const LINE = '#e6ecf4'
const RED = '#d81e27'
const GREEN = '#057a43'
const FONT =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"

/** Tout ce qui vient du visiteur passe par là. Sans exception. */
function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/** Titre de section : petite capitale grise au-dessus d'un filet. */
function sectionTitle(label) {
  return `
    <tr>
      <td style="padding:26px 28px 0;">
        <p style="margin:0 0 10px;font:700 11px/1.4 ${FONT};letter-spacing:1.4px;text-transform:uppercase;color:${NAVY_FAINT};">${escapeHtml(label)}</p>
      </td>
    </tr>`
}

/** Une ligne « libellé → valeur », alignée sur deux colonnes. */
function infoRow(label, value, href) {
  const shown = escapeHtml(value)
  const cell = href
    ? `<a href="${escapeHtml(href)}" style="color:${NAVY};text-decoration:none;border-bottom:1px solid ${LINE};">${shown}</a>`
    : shown

  return `
    <tr>
      <td style="padding:7px 0;font:400 13px/1.5 ${FONT};color:${NAVY_SOFT};width:130px;vertical-align:top;">${escapeHtml(label)}</td>
      <td style="padding:7px 0;font:600 14px/1.5 ${FONT};color:${NAVY};vertical-align:top;">${cell}</td>
    </tr>`
}

/** Textes du tableau des packs, selon qui le lit. */
const TEAM_COPY = {
  empty: `Aucun pack sélectionné&nbsp;— le visiteur attend un <strong style="color:${NAVY};">conseil sur l’appareil</strong> adapté à son site.`,
  note: 'Montant indicatif hors taxes, tel qu’affiché sur le site au moment de la demande.',
}

const VISITOR_COPY = {
  empty: `Vous n’avez pas choisi de pack&nbsp;: notre conseiller vous orientera vers <strong style="color:${NAVY};">l’appareil adapté</strong> à votre site.`,
  note: 'Montant indicatif hors taxes, confirmé dans le devis que nous vous adresserons.',
}

/** Le tableau des packs retenus, avec son total. */
function packsTable(packs, monthlyTotal, currency, copy = TEAM_COPY) {
  if (packs.length === 0) {
    return `
      <tr>
        <td style="padding:4px 28px 0;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f4f7fb;border-radius:10px;">
            <tr>
              <td style="padding:14px 16px;font:400 13.5px/1.6 ${FONT};color:${NAVY_SOFT};">
                ${copy.empty}
              </td>
            </tr>
          </table>
        </td>
      </tr>`
  }

  const rows = packs
    .map(
      (pack, index) => `
      <tr>
        <td style="padding:12px 10px 12px 14px;border-top:1px solid ${LINE};font:400 13px/1.45 ${FONT};color:${NAVY};${index === 0 ? 'border-top:none;' : ''}">
          <strong style="font-weight:700;">Pack ${escapeHtml(pack.name)}</strong><br>
          <span style="color:${NAVY_FAINT};font-size:12px;">${escapeHtml(pack.device)}</span>
        </td>
        <td align="center" style="padding:12px 8px;border-top:1px solid ${LINE};font:600 13px/1.45 ${FONT};color:${NAVY_SOFT};white-space:nowrap;${index === 0 ? 'border-top:none;' : ''}">${escapeHtml(pack.months)} mois</td>
        <td align="center" style="padding:12px 8px;border-top:1px solid ${LINE};font:700 13px/1.45 ${FONT};color:${NAVY};${index === 0 ? 'border-top:none;' : ''}">×&nbsp;${escapeHtml(pack.quantity)}</td>
        <td align="right" style="padding:12px 14px 12px 8px;border-top:1px solid ${LINE};font:700 13px/1.45 ${FONT};color:${NAVY};white-space:nowrap;${index === 0 ? 'border-top:none;' : ''}">${escapeHtml(pack.monthly * pack.quantity)}&nbsp;${escapeHtml(currency)}</td>
      </tr>`,
    )
    .join('')

  return `
    <tr>
      <td style="padding:4px 28px 0;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid ${LINE};border-radius:10px;border-collapse:separate;overflow:hidden;">
          ${rows}
          <tr>
            <td colspan="3" style="padding:13px 8px 13px 14px;background:${NAVY};font:600 13px/1.4 ${FONT};color:${NAVY_FAINT};">Estimation mensuelle</td>
            <td align="right" style="padding:13px 14px 13px 8px;background:${NAVY};font:700 17px/1.4 ${FONT};color:#ffffff;white-space:nowrap;">${escapeHtml(monthlyTotal)}&nbsp;${escapeHtml(currency)}</td>
          </tr>
        </table>
        <p style="margin:8px 2px 0;font:400 11.5px/1.5 ${FONT};color:${NAVY_FAINT};">
          ${copy.note}
        </p>
      </td>
    </tr>`
}

/**
 * Construit le mail complet.
 *
 * Renvoie l'objet, la version HTML et la version texte. Les deux partent
 * ensemble : un client de messagerie qui refuse le HTML affiche la seconde, et
 * les filtres anti-spam se méfient des messages qui n'ont que du HTML.
 */
export function buildQuoteEmail(data, currency = 'DT') {
  const {
    etablissement,
    secteur,
    ville,
    nom,
    telephone,
    email,
    echeance,
    message,
    packs = [],
    monthlyTotal = 0,
  } = data

  const subject = `Devis — ${etablissement}${ville ? ` (${ville})` : ''}`

  const preheader = `${nom} · ${telephone}${packs.length > 0 ? ` · ${packs.length} pack${packs.length > 1 ? 's' : ''}` : ' · conseil demandé'}`

  const html = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background:#f4f7fb;-webkit-font-smoothing:antialiased;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(preheader)}</div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f4f7fb;">
    <tr>
      <td align="center" style="padding:26px 12px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:100%;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 1px 3px rgba(7,18,36,.08);">

          <tr>
            <td style="background:${NAVY};padding:22px 28px 20px;">
              <p style="margin:0;font:700 16px/1.2 ${FONT};color:#ffffff;letter-spacing:-.3px;">Defibrillateur<span style="color:#ff5f5f;">.TN</span></p>
              <p style="margin:7px 0 0;font:600 12px/1.4 ${FONT};letter-spacing:1.2px;text-transform:uppercase;color:#ff5f5f;">Nouvelle demande de devis</p>
            </td>
          </tr>
          <tr><td style="height:3px;line-height:3px;font-size:0;background:${RED};">&nbsp;</td></tr>

          <tr>
            <td style="padding:26px 28px 0;">
              <h1 style="margin:0;font:700 22px/1.25 ${FONT};color:${NAVY};letter-spacing:-.4px;">${escapeHtml(etablissement)}</h1>
              <p style="margin:6px 0 0;font:400 13.5px/1.5 ${FONT};color:${NAVY_SOFT};">${escapeHtml(secteur)}${ville ? ` · ${escapeHtml(ville)}` : ''}</p>
              ${echeance ? `<p style="margin:12px 0 0;"><span style="display:inline-block;padding:5px 11px;border-radius:99px;background:#e8f8ef;font:700 11.5px/1.3 ${FONT};color:${GREEN};">Échéance&nbsp;: ${escapeHtml(echeance)}</span></p>` : ''}
            </td>
          </tr>

          ${sectionTitle('Contact')}
          <tr>
            <td style="padding:0 28px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                ${infoRow('Nom', nom)}
                ${infoRow('Téléphone', telephone, `tel:${String(telephone).replace(/\s/g, '')}`)}
                ${infoRow('E-mail', email, `mailto:${email}`)}
              </table>
            </td>
          </tr>

          ${sectionTitle('Packs demandés')}
          ${packsTable(packs, monthlyTotal, currency)}

          ${
            message
              ? `${sectionTitle('Précisions du visiteur')}
          <tr>
            <td style="padding:0 28px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f4f7fb;border-radius:10px;">
                <tr>
                  <td style="padding:14px 16px;font:400 13.5px/1.65 ${FONT};color:${NAVY};white-space:pre-wrap;">${escapeHtml(message)}</td>
                </tr>
              </table>
            </td>
          </tr>`
              : ''
          }

          <tr>
            <td style="padding:26px 28px 24px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="background:${RED};border-radius:8px;">
                    <a href="mailto:${escapeHtml(email)}?subject=${encodeURIComponent(`Votre devis — ${etablissement}`)}"
                       style="display:inline-block;padding:12px 22px;font:700 14px/1 ${FONT};color:#ffffff;text-decoration:none;">Répondre à ${escapeHtml(nom)}</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:16px 28px 22px;border-top:1px solid ${LINE};">
              <p style="margin:0;font:400 11.5px/1.6 ${FONT};color:${NAVY_FAINT};">
                Envoyé depuis le formulaire de devis de defibrillateur.tn — ${escapeHtml(new Date().toLocaleString('fr-FR', { dateStyle: 'long', timeStyle: 'short' }))}.<br>
                Répondez à ce message&nbsp;: il part directement vers l’adresse du visiteur.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

  // `null` = ligne à retirer, `''` = ligne vide à garder. Les deux ne peuvent
  // pas être le même signe, sinon les séparations entre blocs disparaissent.
  const text = [
    `NOUVELLE DEMANDE DE DEVIS`,
    ``,
    `${etablissement}`,
    `${secteur}${ville ? ` · ${ville}` : ''}`,
    echeance ? `Échéance : ${echeance}` : null,
    ``,
    `CONTACT`,
    `Nom       : ${nom}`,
    `Téléphone : ${telephone}`,
    `E-mail    : ${email}`,
    ``,
    `PACKS DEMANDÉS`,
    packs.length === 0
      ? `Aucun pack sélectionné — conseil demandé sur l'appareil.`
      : packs
          .map(
            (pack) =>
              `- Pack ${pack.name} (${pack.device}) · ${pack.months} mois · x${pack.quantity} · ${pack.monthly * pack.quantity} ${currency}/mois`,
          )
          .join('\n'),
    packs.length > 0 ? `` : null,
    packs.length > 0 ? `Estimation mensuelle : ${monthlyTotal} ${currency} HT` : null,
    message ? `` : null,
    message ? `PRÉCISIONS` : null,
    message ? message : null,
    ``,
    `— Formulaire de devis de defibrillateur.tn`,
  ]
    .filter((line) => line !== null)
    .join('\n')

  return { subject, html, text }
}

/** Une étape numérotée de « la suite ». */
function stepRow(number, title, body) {
  return `
    <tr>
      <td style="padding:0 0 14px;width:38px;vertical-align:top;">
        <span style="display:inline-block;width:26px;height:26px;border-radius:99px;background:#e8f8ef;font:700 12px/26px ${FONT};color:${GREEN};text-align:center;">${number}</span>
      </td>
      <td style="padding:2px 0 14px;vertical-align:top;">
        <p style="margin:0;font:700 14px/1.4 ${FONT};color:${NAVY};">${escapeHtml(title)}</p>
        <p style="margin:2px 0 0;font:400 13px/1.55 ${FONT};color:${NAVY_SOFT};">${escapeHtml(body)}</p>
      </td>
    </tr>`
}

/**
 * Le récapitulatif envoyé AU VISITEUR.
 *
 * Même charpente que le mail de l'équipe, autre ton : on le remercie, on lui
 * redit ce qu'il a demandé, et surtout ce qui va se passer — c'est la question
 * qu'il se pose en le lisant.
 *
 * Le champ « précisions » n'y est PAS repris, volontairement. Ce mail part vers
 * une adresse saisie par le visiteur : si le texte libre y était recopié,
 * n'importe qui pourrait taper l'adresse d'un tiers et lui faire envoyer, depuis
 * notre domaine, le message de son choix. Les champs repris ici sont courts et
 * structurés ; le message long n'arrive que chez l'équipe.
 *
 * Et la dernière ligne dit quoi faire si l'on n'est pas l'auteur de la demande.
 */
export function buildConfirmationEmail(data, { contactEmail, currency = 'DT' } = {}) {
  const {
    etablissement,
    secteur,
    ville,
    nom,
    telephone,
    email,
    echeance,
    packs = [],
    monthlyTotal = 0,
  } = data

  const subject = 'Votre demande de devis — Defibrillateur.TN'
  const firstName = String(nom).split(/\s+/)[0] || nom
  const preheader = 'Demande bien reçue : un conseiller vous rappelle sous 24 h ouvrées.'

  const html = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background:#f4f7fb;-webkit-font-smoothing:antialiased;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(preheader)}</div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f4f7fb;">
    <tr>
      <td align="center" style="padding:26px 12px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:100%;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 1px 3px rgba(7,18,36,.08);">

          <tr>
            <td style="background:${NAVY};padding:22px 28px 20px;">
              <p style="margin:0;font:700 16px/1.2 ${FONT};color:#ffffff;letter-spacing:-.3px;">Defibrillateur<span style="color:#ff5f5f;">.TN</span></p>
              <p style="margin:7px 0 0;font:600 12px/1.4 ${FONT};letter-spacing:1.2px;text-transform:uppercase;color:#2cc47d;">Demande bien reçue</p>
            </td>
          </tr>
          <tr><td style="height:3px;line-height:3px;font-size:0;background:${RED};">&nbsp;</td></tr>

          <tr>
            <td style="padding:28px 28px 0;">
              <h1 style="margin:0;font:700 22px/1.3 ${FONT};color:${NAVY};letter-spacing:-.4px;">Merci ${escapeHtml(firstName)}, c’est entre de bonnes mains.</h1>
              <p style="margin:12px 0 0;font:400 14.5px/1.65 ${FONT};color:${NAVY_SOFT};">
                Nous avons bien reçu votre demande de devis pour <strong style="color:${NAVY};">${escapeHtml(etablissement)}</strong>.
                Un conseiller vous rappelle <strong style="color:${NAVY};">sous 24&nbsp;h ouvrées</strong> au ${escapeHtml(telephone)}
                avec une proposition chiffrée pour votre site.
              </p>
            </td>
          </tr>

          ${sectionTitle('Votre sélection')}
          ${packsTable(packs, monthlyTotal, currency, VISITOR_COPY)}

          ${sectionTitle('Vos coordonnées')}
          <tr>
            <td style="padding:0 28px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                ${infoRow('Établissement', etablissement)}
                ${infoRow('Type de lieu', `${secteur}${ville ? ` · ${ville}` : ''}`)}
                ${infoRow('Nom', nom)}
                ${infoRow('Téléphone', telephone)}
                ${infoRow('E-mail', email)}
                ${echeance ? infoRow('Échéance', echeance) : ''}
              </table>
            </td>
          </tr>

          ${sectionTitle('La suite')}
          <tr>
            <td style="padding:2px 28px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                ${stepRow(1, 'Nous vous appelons', 'Un conseiller fait le point avec vous : surface, nombre de bâtiments, affluence.')}
                ${stepRow(2, 'Vous recevez le devis', 'Une proposition détaillée, sans engagement, adaptée à votre site.')}
                ${stepRow(3, 'Nous installons', 'Pose de l’armoire, mise en service de l’appareil et formation de vos équipes.')}
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:12px 28px 26px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f4f7fb;border-radius:10px;">
                <tr>
                  <td style="padding:14px 16px;font:400 13.5px/1.6 ${FONT};color:${NAVY_SOFT};">
                    Une question d’ici là, un détail à ajouter&nbsp;? <strong style="color:${NAVY};">Répondez simplement à ce message</strong>${contactEmail ? `, ou écrivez à <a href="mailto:${escapeHtml(contactEmail)}" style="color:${RED};text-decoration:none;font-weight:700;">${escapeHtml(contactEmail)}</a>` : ''}.
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:16px 28px 22px;border-top:1px solid ${LINE};">
              <p style="margin:0;font:400 11.5px/1.6 ${FONT};color:${NAVY_FAINT};">
                Vous recevez ce message parce qu’une demande de devis a été faite avec cette adresse sur defibrillateur.tn.
                Si ce n’est pas vous, ignorez-le simplement&nbsp;: aucune suite ne sera donnée.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

  const text = [
    `Bonjour ${firstName},`,
    ``,
    `Nous avons bien reçu votre demande de devis pour ${etablissement}.`,
    `Un conseiller vous rappelle sous 24 h ouvrées au ${telephone} avec une proposition chiffrée.`,
    ``,
    `VOTRE SÉLECTION`,
    packs.length === 0
      ? `Aucun pack choisi : notre conseiller vous orientera vers l'appareil adapté.`
      : packs
          .map(
            (pack) =>
              `- Pack ${pack.name} (${pack.device}) · ${pack.months} mois · x${pack.quantity} · ${pack.monthly * pack.quantity} ${currency}/mois`,
          )
          .join('\n'),
    packs.length > 0 ? `` : null,
    packs.length > 0 ? `Estimation mensuelle : ${monthlyTotal} ${currency} HT (confirmée dans le devis)` : null,
    ``,
    `LA SUITE`,
    `1. Nous vous appelons pour faire le point sur votre site.`,
    `2. Vous recevez un devis détaillé, sans engagement.`,
    `3. Nous installons l'appareil et formons vos équipes.`,
    ``,
    `Une question ? Répondez simplement à ce message.`,
    ``,
    `— Defibrillateur.TN`,
    ``,
    `Vous recevez ce message parce qu'une demande de devis a été faite avec cette adresse sur defibrillateur.tn. Si ce n'est pas vous, ignorez-le.`,
  ]
    .filter((line) => line !== null)
    .join('\n')

  return { subject, html, text }
}
