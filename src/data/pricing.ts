export type PricingSegment = {
  id: string
  label: string
  /** Reprend la durée couverte, affiché sous l'échelle. */
  range: string
  body: string
  includes: string[]
}

export type PricingPlan = {
  id: string
  months: number
  segmentId: string
  tagline: string
  pricePerMonth: number
  warranty: string
  isPopular?: boolean
  /** Photo propre à la formule. Absente : `DEFAULT_PLAN_IMAGE` la remplace. */
  image?: PlanImage
}

export type PlanImage = {
  src: string
  alt: string
  /** Dimensions d'origine : elles réservent la place avant le chargement. */
  width: number
  height: number
}

export const CURRENCY = 'DT'

/**
 * Photo par défaut des cartes de formule — PROVISOIRE.
 *
 * Toutes les formules l'affichent tant qu'aucune n'a sa propre `image`. Pour
 * donner une photo à une formule, ajouter le champ `image` à cette formule
 * dans `pricingPlans` : les autres gardent celle-ci.
 *
 * Les photos sont affichées sans fond : il faut des images DÉTOURÉES, PNG ou
 * WebP transparents.
 */
export const DEFAULT_PLAN_IMAGE: PlanImage = {
  src: '/products/product3.webp',
  alt: 'Défibrillateur Philips HeartStart avec sa sacoche de transport rouge et sa housse noire',
  width: 1500,
  height: 1500,
}

/** Photo à afficher pour une formule. */
export function imageOf(plan: PricingPlan) {
  return plan.image ?? DEFAULT_PLAN_IMAGE
}

// Le delai de livraison chiffre est retire du site : il n'est plus tenu comme
// un engagement. Les delais se discutent au devis.
const BASE_INCLUDES = [
  'Consommables neufs fournis',
  'Installation sur site',
  'Remplacement sous 72h',
  'Boîtier mural et signalétique',
]

/**
 * Les trois régimes de location.
 *
 * Ils ne sont plus des onglets : ils qualifient des portions de l'échelle de
 * durée. Le visiteur choisit un engagement, pas une catégorie, et le régime se
 * déduit de son choix. C'est l'ordre naturel de la décision.
 */
export const pricingSegments: PricingSegment[] = [
  {
    id: 'courte-duree',
    label: 'Courte durée',
    range: '1 à 3 mois',
    body: 'Pour les événements ponctuels : compétitions, festivals, salons, séminaires. Livré prêt à l’emploi, formation incluse.',
    includes: [...BASE_INCLUDES, 'Formation incluse'],
  },
  {
    id: 'moyenne-duree',
    label: 'Moyenne durée',
    range: '6 à 12 mois',
    body: 'Pour un besoin temporaire prolongé : chantier, saison touristique, remplacement d’un appareil défaillant. Pack complet, sans engagement.',
    includes: BASE_INCLUDES,
  },
  {
    id: 'longue-duree',
    label: 'Longue durée',
    range: '24 à 60 mois',
    body: 'Le choix des entreprises, mairies et ERP soumis à l’obligation d’équipement. Appareil, consommables, boîtier et signalétique inclus.',
    includes: BASE_INCLUDES,
  },
]

/**
 * Formules, triées par durée croissante.
 *
 * L'ordre est structurant : l'échelle se lit de gauche à droite, et le prix
 * mensuel y descend. « Plus vous vous engagez, moins vous payez » devient
 * lisible d'un seul regard, sans l'écrire.
 */
export const pricingPlans: PricingPlan[] = [
  {
    id: 'courte-1',
    months: 1,
    segmentId: 'courte-duree',
    tagline: 'Événements ponctuels',
    pricePerMonth: 179,
    warranty: 'Garantie durée période',
  },
  {
    id: 'courte-2',
    months: 2,
    segmentId: 'courte-duree',
    tagline: 'Missions temporaires',
    pricePerMonth: 149,
    warranty: 'Garantie durée période',
  },
  {
    id: 'courte-3',
    months: 3,
    segmentId: 'courte-duree',
    tagline: 'Chantiers et événements',
    pricePerMonth: 119,
    warranty: 'Garantie durée période',
  },
  {
    id: 'moyenne-6',
    months: 6,
    segmentId: 'moyenne-duree',
    tagline: 'Événements saisonniers',
    pricePerMonth: 89,
    warranty: 'Garantie 6 mois · IP56',
  },
  {
    id: 'moyenne-12',
    months: 12,
    segmentId: 'moyenne-duree',
    tagline: 'Idéal projets annuels',
    pricePerMonth: 69,
    warranty: 'Garantie 1 an · IP56',
  },
  {
    id: 'longue-24',
    months: 24,
    segmentId: 'longue-duree',
    tagline: 'Sans engagement long',
    pricePerMonth: 49,
    warranty: 'Garantie 2 ans · IP56',
  },
  {
    id: 'longue-48',
    months: 48,
    segmentId: 'longue-duree',
    tagline: 'Équilibre durée et coût',
    pricePerMonth: 39,
    warranty: 'Garantie 4 ans · IP56',
  },
  {
    id: 'longue-60',
    months: 60,
    segmentId: 'longue-duree',
    tagline: 'Engagement long, meilleur tarif',
    pricePerMonth: 29,
    warranty: 'Garantie 5 ans · IP56',
    isPopular: true,
  },
]

/**
 * Séparateur de milliers à la française, ramené à une espace ordinaire.
 *
 * `toLocaleString('fr-FR')` produit une espace fine insécable (U+202F), à peu
 * près invisible en dessous de 13px. `\s` couvre toutes les variantes
 * d'espace, ce qu'une classe de caractères écrite à la main ne garantit pas.
 */
export function formatAmount(value: number) {
  return value.toLocaleString('fr-FR').replace(/\s/g, ' ')
}

export function totalOf(plan: PricingPlan) {
  return plan.months * plan.pricePerMonth
}

/**
 * Le montant total est CALCULÉ, jamais recopié : prix mensuel et total ne
 * peuvent donc pas diverger si un tarif change.
 */
export function totalLabel(plan: PricingPlan) {
  const period = plan.months === 1 ? 'pour 1 mois' : `sur ${plan.months} mois`
  return `Soit ${formatAmount(totalOf(plan))} ${CURRENCY} HT ${period}`
}

export function segmentOf(plan: PricingPlan) {
  return (
    pricingSegments.find((segment) => segment.id === plan.segmentId) ??
    pricingSegments[0]
  )
}

/* =============================================================================
   Pont entre le hero et la section tarifs.

   La bande sous le hero propose les formules ; en choisir une doit AMENER à la
   section et y OUVRIR le bon onglet. Ces deux gestes n'ont pas le même
   ressort, d'où deux mécanismes qui se complètent :

     - l'ancre (`segmentHref`) fait défiler. C'est le navigateur qui s'en
       charge, donc ça marche au clic répété et ça survit à un rechargement ou
       à un lien partagé ;
     - l'événement (`requestSegment`) sélectionne. Il est immédiat et ne
       dépend pas d'un changement de hash, qui ne se produit justement pas
       quand on reclique le même lien.

   Un contexte React aurait imposé un fournisseur au-dessus de toute la page
   pour un seul échange ponctuel entre deux sections.
   ============================================================================= */

const SEGMENT_HASH_PREFIX = '#formule-'

/** Ancre d'un régime. `PricingSection` pose les cibles correspondantes. */
export function segmentHref(segmentId: string) {
  return `${SEGMENT_HASH_PREFIX}${segmentId}`
}

/** Renvoie le régime visé par un hash, ou `null` si ce n'en est pas un. */
export function segmentIdFromHash(hash: string) {
  if (!hash.startsWith(SEGMENT_HASH_PREFIX)) return null

  const id = hash.slice(SEGMENT_HASH_PREFIX.length)
  return pricingSegments.some((segment) => segment.id === id) ? id : null
}

export const SELECT_SEGMENT_EVENT = 'pricing:select-segment'

/** Demande à la section tarifs d'ouvrir ce régime, où qu'elle soit montée. */
export function requestSegment(segmentId: string) {
  window.dispatchEvent(
    new CustomEvent(SELECT_SEGMENT_EVENT, { detail: segmentId }),
  )
}
