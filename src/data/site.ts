/**
 * Source unique de vérité pour l'identité et les libellés d'action.
 *
 * Les libellés de CTA vivent ici pour garantir qu'une même intention porte
 * toujours le même mot sur tout le site (navigation, hero, panier, footer).
 */

/**
 * Première année d'activité. Tout ce qui parle d'ancienneté se calcule à
 * partir d'ici : une durée écrite en dur vieillit au 1er janvier, pas ce
 * compte. Une seule valeur à corriger si le client précise sa date.
 */
export const FOUNDED_YEAR = 2016

/** Années de présence, arrêtées à l'année civile en cours. */
export const yearsInPractice = new Date().getFullYear() - FOUNDED_YEAR

export const site = {
  /**
   * Écrit sans accent et en un seul mot : c'est un nom de domaine, pas une
   * raison sociale. Le reproduire tel quel partout, y compris ici.
   */
  name: 'Defibrillateur.TN',
  /**
   * Le wordmark se compose en deux temps : le mot, puis l'extension. Les deux
   * moitiés se touchent — un nom de domaine ne se coupe pas — et seule la
   * couleur les distingue.
   */
  wordmark: { lead: 'Defibrillateur', trail: '.TN' },
  /** TODO client : raison sociale enregistrée (forme juridique comprise). */
  legalName: 'Defibrillateur.TN',
  baseline: `Spécialiste DAE, présent depuis ${yearsInPractice} ans`,
} as const

export const actions = {
  /**
   * Intention « devis » : ce libellé, et aucun autre, partout sur le site.
   *
   * Elle visait `#devis`, une section qui n'a jamais existé : le bouton
   * principal du site ne faisait donc rien, où qu'on clique dessus. Elle mène
   * désormais au pied de page, seul endroit qui porte de quoi nous joindre.
   * À rebrancher sur un vrai formulaire quand il existera.
   */
  quote: { label: 'Demander un devis', href: '#contact' },
  /** Intention « catalogue ». */
  catalog: { label: 'Voir le catalogue', href: '#appareils' },
} as const

export type HeroSpec = {
  id: string
  label: string
  value: string
}

/**
 * Bandeau de mesures du hero.
 *
 * Présenté en libellé/valeur plutôt qu'en pastilles : c'est la lecture d'un
 * appareil, pas une rangée d'étiquettes marketing.
 *
 * La liste est tenue courte à dessein et `SpecStrip` s'adapte à sa longueur :
 * en ajouter ou en retirer ne demande aucune retouche de mise en page.
 */
export const heroSpecs: HeroSpec[] = [
  { id: 'fiscalite', label: 'Fiscalité', value: 'Charge déductible' },
  {
    id: 'experience',
    label: 'Spécialiste DAE',
    value: `Présent depuis ${yearsInPractice} ans`,
  },
]

export type Studio = {
  name: string
  /** Vide = signature non cliquable. Renseigner pour lier vers l'atelier. */
  url: string
}

/** Signature de l'atelier qui a réalisé le site, en pied de page. */
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

// Typé explicitement plutôt qu'en `as const` : sinon TypeScript fige `phone`
// sur la chaîne vide et considère le test « renseigné ? » comme impossible.
export const contact: Contact = {
  // TODO client : confirmer le domaine réel.
  email: 'contact@defib.tn',
  phone: '',
  city: 'Tunis, Tunisie',
}

export type SocialLink = { id: string; label: string; href: string }

export const socialLinks: SocialLink[] = [
  { id: 'linkedin', label: 'LinkedIn', href: '' },
  { id: 'facebook', label: 'Facebook', href: '' },
]

/**
 * Pièce maîtresse du hero : l'armoire murale, en trois dimensions.
 *
 * Servi depuis `public/`, donc remplaçable sans reconstruire le site.
 *
 * Pas d'image d'attente : l'ancienne (`CabinetAED.webp`) a été retirée du
 * projet. Le hero réserve la hauteur du modèle, donc rien ne bouge pendant le
 * chargement — la place reste simplement vide jusqu'à l'affichage. Pour en
 * remettre une, ajouter ici un champ `poster` et le passer au lecteur.
 */
export const heroModel = {
  src: '/aed-wall-cabinet.glb',
  alt: 'Armoire murale pour défibrillateur, façade verte avec fenêtre de contrôle et pictogrammes d’utilisation, manipulable en trois dimensions',
} as const

