/**
 * Contenu éditorial de la landing page.
 *
 * ATTENTION CLIENT : les chiffres médicaux ci-dessous sont des références
 * couramment citées en réanimation. Leur source est indiquée à côté de chacun ;
 * faites-les valider par votre référent médical avant mise en ligne.
 */

export type HeroSlide = {
  src: string
  alt: string
  /** `contain` pour les visuels produit sur fond blanc, `cover` pour les photos. */
  fit: 'contain' | 'cover'
}

/**
 * Visuels qui défilent dans le hero : uniquement ceux de `public/header/`.
 * Un fichier absent retire sa case d'elle-même.
 */
export const heroSlides: HeroSlide[] = [
  { src: '/header/pack-schiller.webp', alt: 'Pack défibrillateur Schiller : armoire, signalétique, électrodes et trousse de secours', fit: 'contain' },
  { src: '/header/pack-zoll.webp', alt: 'Pack ZOLL : défibrillateur, armoire murale, électrodes, trousse et signalétique', fit: 'contain' },
  { src: '/header/pack-formation-pose.webp', alt: 'Armoire, défibrillateur, signalétique et technicien qui installe l’appareil', fit: 'contain' },
  { src: '/header/pack-cardiac-science.webp', alt: 'Pack Cardiac Science : défibrillateur, armoire, sacoche et signalétique', fit: 'contain' },
  { src: '/header/trousse-secours.webp', alt: 'Trousse de secours : ciseaux, gants, rasoir et compresses', fit: 'contain' },
]

export type Sector = {
  id: string
  label: string
  hint: string
}

/**
 * Secteurs de « Êtes-vous concerné ? ».
 *
 * Photo de chaque carte : `public/secteurs/<id>.webp` (ou `.jpg`, `.png`).
 * Tant qu'elle manque, la carte affiche l'icône du secteur à la place.
 */
export const sectors: Sector[] = [
  { id: 'ecoles', label: 'Écoles', hint: 'Élèves et profs' },
  { id: 'sport', label: 'Salles de sport', hint: 'Effort intense' },
  { id: 'restaurants', label: 'Restaurants', hint: 'Clients et équipe' },
  { id: 'hotels', label: 'Hôtels', hint: 'Voyageurs' },
  { id: 'entreprises', label: 'Entreprises', hint: 'Salariés' },
  { id: 'commerces', label: 'Commerces', hint: 'Forte affluence' },
  { id: 'sante', label: 'Cliniques', hint: 'Patients fragiles' },
  { id: 'public', label: 'Mairies', hint: 'Accueil du public' },
]

export type RiskFactor = {
  id: string
  label: string
  /** Pourquoi ce facteur compte : affiché quand la case est cochée. */
  why: string
}

/**
 * Diagnostic « Êtes-vous concerné ? » : chaque facteur coché fait monter le
 * niveau de risque affiché.
 */
export const riskFactors: RiskFactor[] = [
  {
    id: 'passage',
    label: 'Vous recevez du public chaque jour',
    why: 'Plus il y a de passage, plus un arrêt cardiaque sur place devient probable.',
  },
  {
    id: 'fragile',
    label: 'Votre public est âgé ou fragile',
    why: 'Le risque cardiaque augmente fortement avec l’âge et les maladies chroniques.',
  },
  {
    id: 'effort',
    label: 'Une activité physique a lieu sur place',
    why: 'Un effort intense peut déclencher un arrêt, même chez une personne jeune.',
  },
  {
    id: 'secours',
    label: 'Les secours mettent du temps à arriver',
    why: 'Sans choc dans les premières minutes, les chances de survie s’effondrent.',
  },
  {
    id: 'aucun',
    label: 'Vous n’avez pas encore de défibrillateur',
    why: 'Aujourd’hui, personne sur place ne pourrait délivrer le choc.',
  },
]

/** Annonce officielle du projet de loi. */
export const lawNews = {
  date: '4 juillet 2026',
  title: 'Un projet de loi pour des défibrillateurs dans les lieux publics',
  body: 'Le ministre de la Santé a annoncé à Sousse la préparation d’un texte visant à installer des défibrillateurs automatisés externes dans les lieux publics tunisiens.',
  source: {
    label: 'La Presse de Tunisie',
    href: 'https://www.lapresse.tn/2026/07/04/arrets-cardiaques-vers-linstallation-de-defibrillateurs-automatises-dans-les-lieux-publics-en-tunisie/',
  },
} as const

export type Stat = {
  id: string
  prefix?: string
  /** Valeur animée par le compteur. */
  count: number
  suffix: string
  label: string
  /** Référence à fournir au client, non affichée. */
  source: string
}

export const stats: Stat[] = [
  {
    id: 'minute',
    prefix: '−',
    count: 10,
    suffix: ' %',
    label: 'de survie perdus par minute',
    source: 'European Resuscitation Council, recommandations 2021',
  },
  {
    id: 'survie',
    count: 70,
    suffix: ' %',
    label: 'de survie si le choc est immédiat',
    source: 'American Heart Association ; sante-tunisie.com',
  },
  {
    id: 'cerveau',
    count: 4,
    suffix: ' min',
    label: 'avant des lésions cérébrales',
    source: 'Consensus ILCOR sur l’arrêt cardio-respiratoire',
  },
  {
    id: 'age',
    count: 52,
    suffix: ' ans',
    label: 'âge moyen des victimes',
    source: 'Registre autopsique du nord de la Tunisie, 2010-2012 (Annales de Cardiologie)',
  },
]

/**
 * Chances de survie selon la minute où le choc est délivré.
 *
 * ESTIMATION, pas un relevé : la courbe applique la règle communément citée
 * d'environ −10 points de survie par minute sans défibrillation, à partir de
 * ~70 % la première minute. À faire valider par votre référent médical, ou à
 * remplacer par des données publiées.
 */
export const survivalByMinute = [
  { minute: 1, survival: 70 },
  { minute: 2, survival: 60 },
  { minute: 3, survival: 50 },
  { minute: 4, survival: 40 },
  { minute: 5, survival: 30 },
  { minute: 6, survival: 20 },
  { minute: 7, survival: 10 },
  { minute: 8, survival: 5 },
]

export type RescueStep = {
  id: string
  title: string
  /** Mots importants marqués : `**appuyé**`, `==surligné==` (voir `RichText`). */
  body: string
  /**
   * Fond de l'illustration, relevé sur son pourtour. La case image de la carte
   * le reprend : le dessin s'y fond au lieu d'être posé sur un gris étranger.
   */
  background: string
  /** Photo de repli tant que `public/etapes/<id>` n'existe pas. */
  fallbackImage?: string
}

export const rescueSteps: RescueStep[] = [
  {
    id: 'reconnaitre',
    title: 'Reconnaître l’arrêt',
    body: 'La personne **s’effondre**, ==ne répond pas== quand on lui parle et ==ne respire plus normalement==.',
    background: '#fff6db',
  },
  {
    id: 'alerter',
    title: 'Appeler le 190',
    body: 'Alertez le **SAMU** au ==190==, mettez le haut-parleur et envoyez quelqu’un ==chercher le défibrillateur==.',
    background: '#fff6db',
  },
  {
    id: 'masser',
    title: 'Masser sans s’arrêter',
    body: 'Mains au centre de la poitrine, bras tendus : ==appuyez fort et vite==, **sans jamais vous arrêter** jusqu’à l’arrivée du défibrillateur.',
    background: '#fff6db',
  },
  {
    id: 'defibriller',
    title: 'Défibriller',
    body: 'Allumez l’appareil et collez les électrodes : il **analyse le cœur**, ==délivre le choc== si nécessaire et vous ==guide à la voix==.',
    background: '#eb463c',
  },
]

