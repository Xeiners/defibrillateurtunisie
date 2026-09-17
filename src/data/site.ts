/**
 * Source unique de vérité pour l'identité et les libellés d'action.
 *
 * Les libellés de CTA vivent ici pour garantir qu'une même intention porte
 * toujours le même mot sur tout le site (navigation, hero, packs, footer).
 */

export const site = {
  /** Nom de domaine, écrit tel quel partout. */
  name: 'Defibrillateur.TN',
  wordmark: { lead: 'Defibrillateur', trail: '.TN' },
  /** TODO client : raison sociale enregistrée (forme juridique comprise). */
  legalName: 'Defibrillateur.TN',
  baseline: 'Location de défibrillateurs partout en Tunisie',
} as const

export const actions = {
  /** À rebrancher sur un vrai formulaire quand il existera. */
  quote: { label: 'Demander un devis gratuit', short: 'Devis gratuit', href: '#contact' },
  offers: { label: 'Voir nos packs', href: '#offres' },
} as const

export type Studio = {
  name: string
  /** Vide = signature non cliquable. */
  url: string
}

export const studio: Studio = {
  name: 'KomoDev',
  url: '',
}

export type Contact = {
  email: string
  /** Vide tant que le client n'a pas fourni le numéro : le bloc ne s'affiche pas. */
  phone: string
  city: string
}

export const contact: Contact = {
  // TODO client : confirmer le domaine réel et renseigner le téléphone.
  email: 'contact@defib.tn',
  phone: '',
  city: 'Tunis, Tunisie',
}

export type SocialLink = { id: string; label: string; href: string }

export const socialLinks: SocialLink[] = [
  { id: 'linkedin', label: 'LinkedIn', href: '' },
  { id: 'facebook', label: 'Facebook', href: '' },
]

/** Armoire murale en 3D, présentée dans la section des packs. */
export const cabinetModel = {
  src: '/aed-wall-cabinet.glb',
  alt: 'Armoire murale pour défibrillateur, manipulable en trois dimensions',
} as const
