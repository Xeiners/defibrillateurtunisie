export type Brand = {
  id: string
  /** Nom de la marque : il sert aussi de texte alternatif au logo. */
  name: string
  /** Chemin du logo, servi depuis `public/`. */
  logo: string
  /**
   * Dimensions d'origine du fichier. Passées en attributs à l'image, elles
   * réservent la bonne place avant le chargement : les logos n'ont pas tous
   * la même proportion.
   */
  width: number
  height: number
}

/**
 * Marques de la bande qui défile sous le hero.
 *
 * LISTE DE DÉPART, À VALIDER AVEC LE CLIENT. Afficher le logo d'un fabricant
 * laisse entendre qu'on distribue ou loue son matériel : ne garder que les
 * marques réellement proposées, et ajouter celles qui manquent — ZOLL et
 * Cardiac Science, visibles sur les photos du site, n'ont pas pu être
 * récupérées.
 *
 * Provenance des fichiers :
 *   - Philips : Wikimedia Commons, « Philips logo new.svg », domaine public.
 *     Un `viewBox` a été ajouté au fichier : sans lui, un SVG affiché en
 *     image est rogné au lieu d'être réduit.
 *   - Stryker, Nihon Kohden, Mindray : logos publiés sur les sites officiels
 *     des marques. Celui de Stryker est sur fond BLANC OPAQUE — invisible sur
 *     le fond blanc de la bande, mais à remplacer si ce fond change.
 *
 * Pour ajouter ou remplacer une marque : déposer le fichier dans
 * `public/marques/` et renseigner ici le nom, le chemin et les dimensions.
 * Format à demander : SVG sur fond transparent.
 */
export const brands: Brand[] = [
  {
    id: 'philips',
    name: 'Philips',
    logo: '/marques/philips.svg',
    width: 500,
    height: 92,
  },
  {
    id: 'stryker',
    name: 'Stryker',
    logo: '/marques/stryker.png',
    width: 192,
    height: 48,
  },
  {
    id: 'nihon-kohden',
    name: 'Nihon Kohden',
    logo: '/marques/nihon-kohden.png',
    width: 433,
    height: 56,
  },
  {
    id: 'mindray',
    name: 'Mindray',
    logo: '/marques/mindray.png',
    width: 404,
    height: 104,
  },
]
