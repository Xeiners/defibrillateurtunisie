export type FeaturedProduct = {
  id: string
  /** Titre sur deux lignes : la coupe est décidée ici, pas par le navigateur. */
  titleLines: [string, string]
  /** Ligne courte affichée dans le panier. */
  summary: string
  image: {
    /** TODO client : photo produit définitive, cadrage 4:3, fond neutre. */
    src: string
    alt: string
  }
}

/**
 * Catalogue fictif tenant lieu de base de données.
 *
 * Rien ne l'importe directement à part `@/services/productsApi`, qui le sert
 * derrière une fonction asynchrone. Le jour du branchement, ce fichier
 * disparaît sans qu'aucun composant ne bouge.
 */
export const featuredProducts: FeaturedProduct[] = [
  {
    id: 'dae-automatique',
    titleLines: ['Défibrillateur', 'automatique'],
    summary: 'Choc délivré sans intervention, guidage vocal',
    image: {
      // Powerheart G5 : véritable DAE grand public, c'est bien ce que décrit
      // cette fiche.
      src: '/products/product4.png',
      alt: 'Défibrillateur automatisé externe orange, témoin de disponibilité vert',
    },
  },
  {
    id: 'dae-semi-automatique',
    titleLines: ['Défibrillateur', 'semi-automatique'],
    summary: 'Le sauveteur déclenche le choc sur instruction',
    image: {
      // ZOLL M2 : appareil PROFESSIONNEL (écran ECG, sélection manuelle de
      // l'énergie, PNI). Il dispose bien d'un mode semi-automatique, mais ce
      // n'est pas un DAE de hall d'accueil. Voir la note de livraison.
      src: '/products/product1.png',
      alt: 'Moniteur défibrillateur professionnel avec tracé ECG à l’écran',
    },
  },
  {
    id: 'kit-secours',
    titleLines: ['Kit de', 'premiers secours'],
    summary: 'Rasoir, ciseaux, masque et compresses',
    image: {
      src: 'https://picsum.photos/seed/defibtn-kit-secours/800/600',
      alt: 'Kit de premiers secours ouvert sur une table',
    },
  },
  {
    id: 'formation',
    titleLines: ['Formation', 'gestes qui sauvent'],
    summary: 'Session sur site, 2h, jusqu’à 12 personnes',
    image: {
      // ZOLL AED 3 TRAINER : appareil d'ENTRAÎNEMENT, il ne délivre aucun
      // choc. Sa place est ici, sur la fiche formation, et nulle part ailleurs.
      src: '/products/product2.png',
      alt: 'Défibrillateur d’entraînement vert utilisé en formation',
    },
  },
]
