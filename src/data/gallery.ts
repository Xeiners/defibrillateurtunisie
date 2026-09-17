export type GalleryImage = {
  id: string
  src: string
  alt: string
  /** Dimensions d'origine : elles réservent la place avant le chargement. */
  width: number
  height: number
  /**
   * Point d'intérêt conservé au recadrage (`object-position`).
   *
   * Le cadre du carrousel est en paysage (environ 4:3) alors que les photos ne
   * le sont pas toutes — l'une est en portrait, une autre carrée. C'est cette
   * valeur qui décide de ce que le recadrage sacrifie : à revoir photo par
   * photo si le jeu d'images change.
   */
  focus: string
}

/**
 * Photos du carrousel voisin des formules. Servies depuis `public/caroussel/`,
 * donc remplaçables sans reconstruire le site.
 *
 * La première est la seule chargée d'emblée : c'est elle qui doit être la plus
 * lisible. Les suivantes arrivent au fil du défilement.
 *
 * POIDS. Ces PNG pèsent près de 2 Mo chacun. Le carrousel ne les charge qu'au
 * moment de les montrer, mais une conversion en WebP d'environ 1600px de large
 * les ramènerait à quelques centaines de kilo-octets sans perte visible.
 */
export const galleryImages: GalleryImage[] = [
  {
    id: 'parc',
    src: '/caroussel/hero.png',
    alt: 'Plusieurs modèles de défibrillateurs automatisés externes présentés côte à côte avec leurs sacoches et électrodes',
    width: 1454,
    height: 1082,
    focus: 'center',
  },
  {
    id: 'entreprise',
    src: '/caroussel/image1.png',
    alt: 'Défibrillateur posé au sol dans un entrepôt pendant qu’un secouriste porte assistance à une personne inconsciente',
    width: 1448,
    height: 1086,
    focus: '40% center',
  },
  {
    id: 'bureaux',
    src: '/caroussel/image2.png',
    alt: 'Défibrillateur ZOLL porté à la main dans le hall lumineux d’un immeuble de bureaux',
    width: 1122,
    height: 1402,
    // Photo en portrait dans un cadre en paysage : on perd le haut et le bas,
    // on garde la bande centrale où se trouve l'appareil.
    focus: 'center 52%',
  },
  {
    id: 'accueil',
    src: '/caroussel/image4.png',
    alt: 'Deux défibrillateurs orange posés sur le comptoir d’accueil d’un hall d’entreprise',
    width: 1254,
    height: 1254,
    // Les appareils occupent le bas de l'image carrée.
    focus: 'center 65%',
  },
]
