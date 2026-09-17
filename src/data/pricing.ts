export const CURRENCY = 'DT'

/**
 * Boutique d'achat du groupe, proposée à qui préfère posséder l'appareil.
 *
 * Les couleurs sont celles de son logo. Le orange de marque (#e17825) ne tient
 * que 3:1 sous du blanc : il décore, et c'est le cran foncé qui porte le
 * bouton (4,95:1).
 */
export const purchaseSite = {
  label: 'Cardiolife.tn',
  href: 'https://cardiolife.tn',
  logo: '/logo-cardiolife.jpg',
  brand: '#e17825',
  brandDeep: '#b4550c',
  brandDeeper: '#a54c08',
}

export type PackFeature = {
  /** Clé d'icône, associée dans `OffersSection`. */
  icon: string
  label: string
  /** `false` : la ligne s'affiche barrée, pour que la différence se voie. */
  included: boolean
}

export type PackTerm = {
  /** Durée d'engagement, en mois. */
  months: number
  /** Loyer mensuel pour cette durée : plus on s'engage, moins on paie. */
  monthly: number
}

export type Pack = {
  id: string
  /** Nom commercial de la formule. */
  name: string
  /** Modèle loué : c'est LUI qui distingue les trois packs. */
  device: string
  /** « Semi-automatique » ou « Entièrement automatique ». */
  deviceType: string
  /** Une ligne : pour qui, et ce qui le caractérise. */
  summary: string
  /** Durées proposées, de la plus courte à la plus longue. */
  terms: PackTerm[]
  /** Mise en avant visuelle ; un seul pack la porte. */
  isPopular?: boolean
  /** Visuels essayés dans l'ordre : le premier trouvé s'affiche. */
  images: string[]
  features: PackFeature[]
}

/**
 * Ce que TOUS les packs comprennent — dit une seule fois, sous les cartes,
 * plutôt que répété trois fois dans les listes.
 */
export const packIncludes = [
  { icon: 'cabinet', label: 'Armoire murale et signalétique' },
  { icon: 'battery', label: 'Électrodes et batterie neuves' },
  { icon: 'install', label: 'Installation et mise en service' },
  { icon: 'maintenance', label: 'Maintenance et contrôles réguliers' },
  { icon: 'replace', label: 'Remplacement sous 72 h' },
  { icon: 'support', label: 'Assistance téléphonique' },
]

/**
 * Les trois formules de location.
 *
 * TODO CLIENT — À VALIDER AVANT MISE EN LIGNE :
 *   - les tarifs et les durées d'engagement ci-dessous sont des ordres de
 *     grandeur, pas votre grille ; chaque pack propose trois durées, et le
 *     loyer baisse à mesure qu'on s'engage ;
 *   - vérifiez que les trois modèles cités sont bien ceux que vous louez, et
 *     que chaque caractéristique cochée correspond à la fiche technique du
 *     fabricant (langues, assistance au massage, suivi connecté) ;
 *   - les visuels vivent dans `public/packs/`, nommés d'après l'identifiant du
 *     pack (`essentiel`, `confort`, `premium`), en `.webp`, `.jpg` ou `.png`.
 *     Le nom doit être EN MINUSCULES : la casse est ignorée sous Windows, mais
 *     pas par le serveur qui les servira.
 */
export const packs: Pack[] = [
  {
    id: 'essentiel',
    name: 'Essentiel',
    device: 'Philips HeartStart HS1',
    deviceType: 'Semi-automatique',
    summary: 'Un appareil simple, prêt à l’emploi.',
    terms: [
      { months: 12, monthly: 130 },
      { months: 24, monthly: 115 },
      { months: 36, monthly: 100 },
    ],
    images: ['/packs/essentiel.webp', '/packs/essentiel.jpg', '/packs/essentiel.png'],
    features: [
      { icon: 'voice', label: 'Guidage vocal en français', included: true },
      { icon: 'training', label: 'Formation jusqu’à 10 personnes', included: true },
      { icon: 'languages', label: 'Guidage multilingue (arabe, anglais)', included: false },
      { icon: 'cpr', label: 'Assistance au massage cardiaque', included: false },
      { icon: 'connected', label: 'Suivi connecté de l’appareil', included: false },
    ],
  },
  {
    id: 'confort',
    name: 'Confort',
    device: 'ZOLL AED Plus',
    deviceType: 'Semi-automatique',
    summary: 'Il corrige le massage cardiaque.',
    terms: [
      { months: 12, monthly: 175 },
      { months: 24, monthly: 150 },
      { months: 36, monthly: 135 },
    ],
    isPopular: true,
    images: ['/packs/confort.webp', '/packs/confort.jpg', '/packs/confort.png'],
    features: [
      { icon: 'voice', label: 'Guidage vocal en français', included: true },
      { icon: 'training', label: 'Formation jusqu’à 15 personnes', included: true },
      { icon: 'languages', label: 'Guidage multilingue (arabe, anglais)', included: true },
      { icon: 'cpr', label: 'Assistance au massage cardiaque', included: true },
      { icon: 'connected', label: 'Suivi connecté de l’appareil', included: false },
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    device: 'Powerheart G5',
    deviceType: 'Entièrement automatique',
    summary: 'L\'appareil fait tout.',
    terms: [
      { months: 12, monthly: 215 },
      { months: 24, monthly: 195 },
      { months: 36, monthly: 175 },
    ],
    images: ['/packs/premium.webp', '/packs/premium.jpg', '/packs/premium.png'],
    features: [
      { icon: 'voice', label: 'Guidage vocal en français', included: true },
      { icon: 'training', label: 'Formation jusqu’à 25 personnes', included: true },
      { icon: 'languages', label: 'Guidage multilingue (arabe, anglais)', included: true },
      { icon: 'cpr', label: 'Assistance au massage cardiaque', included: true },
      { icon: 'connected', label: 'Suivi connecté de l’appareil', included: true },
    ],
  },
]

/**
 * Prix d'appel affiché en tête de page et dans l'appel final : le loyer
 * mensuel le plus bas de toute la grille, CALCULÉ pour ne jamais diverger.
 */
export const HEADLINE_PRICE = Math.min(
  ...packs.flatMap((pack) => pack.terms.map((term) => term.monthly)),
)

/** Durée mise en avant à l'ouverture : la plus longue, donc la moins chère. */
export function defaultTermIndex(pack: Pack) {
  return pack.terms.length - 1
}

/**
 * Tarif de référence d'un pack : celui de l'engagement le plus court.
 *
 * C'est lui qu'on barre quand le visiteur allonge son engagement — la remise
 * se voit alors, au lieu d'un prix qui change sans qu'on sache par rapport à
 * quoi.
 */
export function basePrice(pack: Pack) {
  return Math.max(...pack.terms.map((term) => term.monthly))
}
