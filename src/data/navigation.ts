export type NavItem = {
  id: string
  label: string
  href: string
}

/**
 * Tenu court volontairement : la barre doit rester sur UNE ligne au-delà de
 * 1024px. Toute entrée supplémentaire passe dans le menu mobile.
 */
export const primaryNav: NavItem[] = [
  { id: 'solutions', label: 'Solutions', href: '#solutions' },
  { id: 'appareils', label: 'Appareils', href: '#appareils' },
  { id: 'maintenance', label: 'Maintenance', href: '#maintenance' },
  { id: 'formation', label: 'Formation', href: '#formation' },
]

export type NavColumn = {
  id: string
  title: string
  items: NavItem[]
}

/**
 * Ancres RÉELLEMENT rendues sur la page, une par `id` posé dans `App.tsx`.
 *
 * Un lien qui ne fait rien quand on clique dessus est pire que pas de lien du
 * tout : la barre de navigation comme le pied de page ne rendent que ce qui
 * figure ici. Les listes ci-dessous peuvent donc rester complètes et servir de
 * plan de ce que le site DEVRA proposer, sans jamais mentir au visiteur.
 *
 * Absents à ce jour, faute de section qui les porte : `#maintenance` et
 * `#formation`. Le jour où ces sections existent, il suffit d'ajouter leur
 * ancre ici pour que les liens réapparaissent d'eux-mêmes aux deux endroits.
 */
export const liveAnchors: readonly string[] = [
  '#top',
  '#packs',
  '#questions',
  '#appareils',
  '#solutions',
  '#video',
  '#formules',
  '#contact',
]

/**
 * Ce lien mène-t-il quelque part ?
 *
 * Les ancres sont confrontées à `liveAnchors` ; tout le reste (pages légales,
 * réseaux sociaux) est considéré vivant dès qu'une destination est renseignée.
 */
export function isLiveHref(href: string) {
  return href.startsWith('#') ? liveAnchors.includes(href) : href !== ''
}

export const footerColumns: NavColumn[] = [
  {
    id: 'offre',
    title: 'Offre',
    items: [
      { id: 'f-solutions', label: 'Solutions', href: '#solutions' },
      { id: 'f-appareils', label: 'Appareils', href: '#appareils' },
      { id: 'f-formules', label: 'Formules et tarifs', href: '#formules' },
      { id: 'f-maintenance', label: 'Maintenance', href: '#maintenance' },
      { id: 'f-formation', label: 'Formation', href: '#formation' },
    ],
  },
  {
    id: 'comprendre',
    title: 'Comprendre',
    items: [
      { id: 'f-questions', label: 'Questions fréquentes', href: '#questions' },
      { id: 'f-apropos', label: 'À propos', href: '#apropos' },
      { id: 'f-video', label: 'La vidéo', href: '#video' },
    ],
  },
]

/**
 * TODO client : brancher les vraies pages légales avant mise en ligne.
 * Les liens sont volontairement laissés vides ; le footer n'affiche que ceux
 * qui ont une destination, plutôt que de proposer des liens morts.
 */
export const legalLinks: NavItem[] = [
  { id: 'mentions', label: 'Mentions légales', href: '' },
  { id: 'cgv', label: 'CGV', href: '' },
  { id: 'confidentialite', label: 'Confidentialité', href: '' },
]
