/**
 * Adresse du service d'envoi.
 *
 * Par défaut `/api/devis`, sur le même domaine : le serveur web relaie vers le
 * petit service Node de `server/` (voir `server/README.md`). Aucune origine
 * croisée, donc aucun CORS à régler.
 *
 * `VITE_QUOTE_ENDPOINT` permet de viser ailleurs — un autre port en
 * développement, un sous-domaine en production.
 */
const ENDPOINT = import.meta.env.VITE_QUOTE_ENDPOINT ?? '/api/devis'

/** Une ligne de la sélection, telle qu'elle apparaîtra dans le mail. */
export type QuotePackLine = {
  name: string
  device: string
  months: number
  quantity: number
  monthly: number
}

export type QuoteSubmission = {
  etablissement: string
  secteur: string
  ville: string
  nom: string
  telephone: string
  email: string
  echeance: string
  message: string
  /**
   * Champ piège, invisible et jamais rempli par un humain. S'il contient
   * quelque chose, c'est un robot : le serveur répond « reçu » et jette.
   */
  piege: string
  packs: QuotePackLine[]
  monthlyTotal: number
}

/**
 * Envoie la demande de devis.
 *
 * Le mail lui-même est composé PAR LE SERVEUR, à partir de ces données. Si le
 * navigateur envoyait du HTML tout fait, n'importe qui pourrait poster le sien
 * à cette adresse et faire partir un message quelconque depuis le domaine.
 *
 * Lève en cas d'échec : c'est au formulaire de le dire au visiteur, et de lui
 * laisser l'adresse e-mail de repli.
 */
export async function sendQuote(submission: QuoteSubmission) {
  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(submission),
  })

  if (!response.ok) {
    throw new Error(`Envoi refusé par le serveur (${response.status}).`)
  }
}
