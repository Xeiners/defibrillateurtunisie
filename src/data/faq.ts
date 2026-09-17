export type FaqEntry = {
  id: string
  /** Clé d'icône, associée dans `FaqSection`. */
  icon: string
  question: string
  /**
   * Réponse courte, avec deux marques de mise en valeur :
   *   **texte**  — appuyé, en encre
   *   ==texte==  — surligné en rouge, ce qu'il faut retenir
   */
  answer: string
}

export const faqEntries: FaqEntry[] = [
  {
    id: 'location-vs-achat',
    icon: 'wallet',
    question: 'Pourquoi louer plutôt qu’acheter ?',
    answer:
      '==Aucun investissement de départ== : un loyer mensuel déductible, et un appareil toujours opérationnel. **Électrodes, batterie et maintenance** sont à notre charge pendant toute la durée du contrat.',
  },
  {
    id: 'obligation',
    icon: 'law',
    question: 'Est-ce obligatoire en Tunisie ?',
    answer:
      '**Pas encore.** Le ministère de la Santé a annoncé en juillet 2026 un projet de loi pour équiper les lieux publics. ==S’équiper maintenant, c’est anticiper==, et surtout protéger vos équipes dès aujourd’hui.',
  },
  {
    id: 'utilisation',
    icon: 'training',
    question: 'Faut-il être formé pour l’utiliser ?',
    answer:
      '==Non.== L’appareil analyse seul le rythme cardiaque, **guide l’utilisateur à la voix** et ne délivre un choc que s’il est nécessaire. Une formation courte de vos équipes reste incluse.',
  },
  {
    id: 'inclus',
    icon: 'box',
    question: 'Que comprend la location ?',
    answer:
      'Le défibrillateur, **l’armoire murale**, la signalétique, les consommables (électrodes et batterie), **l’installation sur site** et ==le remplacement de l’appareil sous 72 h== en cas de panne.',
  },
  {
    id: 'zone',
    icon: 'map',
    question: 'Intervenez-vous partout en Tunisie ?',
    answer:
      '==Oui, dans tout le pays.== Du Grand Tunis au Sud, pour **un site unique comme pour un réseau** d’établissements.',
  },
  {
    id: 'combien',
    icon: 'timer',
    question: 'Combien de défibrillateurs prévoir ?',
    answer:
      'Un appareil doit pouvoir être atteint et ramené en ==moins de 3 minutes==. Pour un grand site ou plusieurs bâtiments, nous établissons **gratuitement un plan d’implantation**.',
  },
]
