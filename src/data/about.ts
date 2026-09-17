/**
 * Contenu de la section pédagogique.
 *
 * ATTENTION CLIENT : le chiffre de survie ci-dessous est la figure de
 * référence communément citée en réanimation cardio-pulmonaire, mais elle est
 * publiée ici SANS source. Avant mise en ligne, faites-la valider par votre
 * référent médical et ajoutez la référence, ou retirez le chiffre. Une donnée
 * médicale non sourcée sur un site commercial est un risque, pas un argument.
 */
export const about = {
  heading: 'Un défibrillateur, concrètement',

  intro:
    'Un défibrillateur automatisé externe analyse le rythme du cœur et délivre un choc électrique quand celui-ci cesse de battre normalement. L’appareil guide l’utilisateur à la voix, étape par étape, et refuse de choquer si ce n’est pas nécessaire. Aucune formation médicale n’est requise pour s’en servir.',

  stat: {
    value: '10%',
    label:
      'de chances de survie perdues à chaque minute qui passe sans défibrillation.',
  },

  mission: {
    title: 'Pourquoi en équiper vos sites',
    body: 'Un arrêt cardiaque ne prévient pas, et survient le plus souvent loin d’un hôpital. Sur place, le défibrillateur est le seul geste qui compte avant l’arrivée des secours.',
  },

  /** TODO client : photos définitives. Cadrages indiqués en commentaire. */
  media: {
    /** Appareil en situation, mural, dans un lieu de passage. 1200x900. */
    device: {
      src: '/bentoMain/image1.png',
      alt: 'Défibrillateur mural signalé dans un couloir de passage',
    },
    /** Personne manipulant l’appareil pendant une formation. 1000x1200. */
    training: {
      src: '/bentoMain/image2.png',
      alt: 'Personne manipulant un défibrillateur pendant une formation',
    },
  },
} as const
