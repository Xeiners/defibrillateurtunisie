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

const locationVsAchat: FaqEntry = {
  id: 'location-vs-achat',
  icon: 'wallet',
  question: 'Pourquoi louer plutôt qu’acheter ?',
  answer:
    '==Aucun investissement de départ== : un loyer mensuel déductible, et un appareil toujours opérationnel. **Électrodes, batterie et maintenance** sont à notre charge pendant toute la durée du contrat.',
}

const obligation: FaqEntry = {
  id: 'obligation',
  icon: 'law',
  question: 'Est-ce obligatoire en Tunisie ?',
  answer:
    '**Pas encore.** Le ministère de la Santé a annoncé en juillet 2026 un projet de loi pour équiper les lieux publics. ==S’équiper maintenant, c’est anticiper==, et surtout protéger vos équipes dès aujourd’hui.',
}

const utilisation: FaqEntry = {
  id: 'utilisation',
  icon: 'training',
  question: 'Faut-il être formé pour l’utiliser ?',
  answer:
    '==Non.== L’appareil analyse seul le rythme cardiaque, **guide l’utilisateur à la voix** et ne délivre un choc que s’il est nécessaire. Une formation courte de vos équipes reste incluse.',
}

const inclus: FaqEntry = {
  id: 'inclus',
  icon: 'box',
  question: 'Que comprend la location ?',
  answer:
    'Le défibrillateur, **l’armoire murale**, la signalétique, les consommables (électrodes et batterie), **l’installation sur site** et ==le remplacement de l’appareil sous 72 h== en cas de panne.',
}

const zone: FaqEntry = {
  id: 'zone',
  icon: 'map',
  question: 'Intervenez-vous partout en Tunisie ?',
  answer:
    '==Oui, dans tout le pays.== Du Grand Tunis au Sud, pour **un site unique comme pour un réseau** d’établissements.',
}

const combien: FaqEntry = {
  id: 'combien',
  icon: 'timer',
  question: 'Combien de défibrillateurs prévoir ?',
  answer:
    'Un appareil doit pouvoir être atteint et ramené en ==moins de 3 minutes==. Pour un grand site ou plusieurs bâtiments, nous établissons **gratuitement un plan d’implantation**.',
}

/** Les six questions de l'accueil : les objections qui reviennent le plus. */
export const faqEntries: FaqEntry[] = [locationVsAchat, obligation, utilisation, inclus, zone, combien]

export type FaqCategory = {
  /** Sert aussi d'ancre : `/faq#location`. */
  id: string
  title: string
  intro: string
  entries: FaqEntry[]
}

/**
 * La page `/faq` : les questions de l'accueil, complétées et rangées par thème.
 *
 * TODO CLIENT — À VALIDER AVANT MISE EN LIGNE :
 *   - la fin de contrat (renouvellement ou restitution sans frais) ;
 *   - le remplacement des électrodes après utilisation, compris dans le loyer ;
 *   - les électrodes pédiatriques, disponibles pour les trois modèles loués.
 */
export const faqCategories: FaqCategory[] = [
  {
    id: 'location',
    title: 'La location',
    intro: 'Ce que vous payez, ce que vous recevez, et pour combien de temps.',
    entries: [
      locationVsAchat,
      inclus,
      {
        id: 'duree',
        icon: 'calendar',
        question: 'Quelle est la durée d’engagement ?',
        answer:
          'Trois durées au choix : ==24, 36 ou 48 mois==. **Plus l’engagement est long, plus le loyer mensuel baisse**, à prestations identiques.',
      },
      {
        id: 'fin-contrat',
        icon: 'renew',
        question: 'Que se passe-t-il en fin de contrat ?',
        answer:
          'Vous choisissez : **renouveler la location**, avec un appareil récent si vous le souhaitez, ou ==nous le restituer, sans frais==. Nous venons le récupérer sur place.',
      },
      {
        id: 'achat',
        icon: 'cart',
        question: 'Et si je préfère acheter l’appareil ?',
        answer:
          'C’est possible : l’achat se fait sur **la boutique de notre groupe**, ==Cardiolife.tn==. La location reste la formule la plus simple, puisque l’entretien y est compris.',
      },
    ],
  },
  {
    id: 'appareil',
    title: 'L’appareil et son utilisation',
    intro: 'Un défibrillateur est conçu pour être utilisé par n’importe quel témoin.',
    entries: [
      utilisation,
      {
        id: 'semi-ou-automatique',
        icon: 'lightning',
        question: 'Semi-automatique ou entièrement automatique : quelle différence ?',
        answer:
          'Les deux **analysent le cœur et guident à la voix**. Le semi-automatique ==demande d’appuyer sur un bouton== pour délivrer le choc ; l’entièrement automatique ==le délivre seul==, après un compte à rebours. Les packs Essentiel et Confort sont semi-automatiques, le pack Premium est entièrement automatique.',
      },
      {
        id: 'erreur',
        icon: 'shield',
        question: 'Peut-on blesser quelqu’un par erreur ?',
        answer:
          '==Non.== L’appareil **ne délivre aucun choc** si le rythme cardiaque ne le justifie pas. Face à un arrêt cardiaque, le seul vrai risque est de ne rien faire.',
      },
      {
        id: 'enfant',
        icon: 'baby',
        question: 'Fonctionne-t-il sur un enfant ?',
        answer:
          'Oui, avec des **électrodes pédiatriques** qui adaptent l’énergie du choc. ==Signalez-le dans votre demande de devis== si votre site accueille des enfants : école, crèche, centre de loisirs.',
      },
      {
        id: 'langues',
        icon: 'languages',
        question: 'En quelle langue l’appareil guide-t-il ?',
        answer:
          'Tous nos appareils guident **en français**. Les packs Confort et Premium proposent aussi ==l’arabe et l’anglais==, utiles pour un public international.',
      },
    ],
  },
  {
    id: 'installation',
    title: 'Installation et entretien',
    intro: 'Nous posons l’appareil, nous l’entretenons, vous n’avez rien à suivre.',
    entries: [
      combien,
      {
        id: 'emplacement',
        icon: 'pin',
        question: 'Où installer le défibrillateur ?',
        answer:
          'À un endroit **visible, accessible à tous et sans clé** : hall d’accueil, couloir principal, près des ascenseurs. Nous choisissons l’emplacement ==avec vous, lors de l’installation==.',
      },
      {
        id: 'maintenance',
        icon: 'wrench',
        question: 'Qui s’occupe de l’entretien ?',
        answer:
          '==Nous, entièrement.== **Contrôles réguliers**, remplacement des électrodes et de la batterie avant leur date d’expiration : l’appareil est toujours prêt, sans que vous ayez à y penser.',
      },
      {
        id: 'panne',
        icon: 'lifebuoy',
        question: 'Et si l’appareil tombe en panne ?',
        answer:
          'Il est ==remplacé sous 72 h==, sans frais. L’appareil réalise aussi **des autotests réguliers** et signale lui-même toute anomalie.',
      },
      {
        id: 'apres-utilisation',
        icon: 'heartbeat',
        question: 'Que faire après avoir utilisé le défibrillateur ?',
        answer:
          '**Prévenez-nous.** Nous remplaçons ==les électrodes et, si besoin, la batterie== pour que l’appareil soit de nouveau opérationnel. Ce remplacement est compris dans la location.',
      },
    ],
  },
  {
    id: 'formation',
    title: 'Formation',
    intro: 'Savoir quoi faire dans les premières minutes change tout.',
    entries: [
      {
        id: 'formation-incluse',
        icon: 'training',
        question: 'La formation est-elle incluse ?',
        answer:
          '==Oui, dans chaque pack.== Une session sur site pour **reconnaître un arrêt cardiaque, masser et utiliser le défibrillateur**, pour 10, 15 ou 25 personnes selon le pack.',
      },
      {
        id: 'qui-former',
        icon: 'team',
        question: 'Qui faut-il former ?',
        answer:
          'Idéalement **plusieurs personnes par équipe et par horaire**, pour qu’il y ait toujours quelqu’un de formé sur place. Mais ==n’importe quel témoin peut utiliser l’appareil==, même sans formation.',
      },
    ],
  },
  {
    id: 'reglementation',
    title: 'Réglementation',
    intro: 'Où en est la loi, et pourquoi ne pas l’attendre.',
    entries: [
      obligation,
      {
        id: 'pourquoi-maintenant',
        icon: 'heartbeat',
        question: 'Pourquoi s’équiper sans attendre la loi ?',
        answer:
          'Parce qu’un arrêt cardiaque n’attend pas : ==chaque minute sans choc fait perdre environ 10 % de chances de survie==. **Les secours mettent souvent plus de temps à arriver** ; un défibrillateur sur place comble ce délai.',
      },
    ],
  },
  {
    id: 'devis',
    title: 'Devis et tarifs',
    intro: 'Un devis gratuit, adapté à votre site, sous 24 h ouvrées.',
    entries: [
      {
        id: 'devis-gratuit',
        icon: 'file',
        question: 'Le devis est-il gratuit et sans engagement ?',
        answer:
          '==Oui, gratuit et sans engagement.== Vous recevez **un devis détaillé sous 24 h ouvrées**, adapté à la surface et à la configuration de votre site.',
      },
      {
        id: 'prix-ht',
        icon: 'receipt',
        question: 'Les prix affichés sont-ils HT ?',
        answer:
          'Oui : les loyers sont indiqués ==hors taxes, par mois et par appareil==. Le devis détaille **le montant TTC** et le total pour l’ensemble de vos appareils.',
      },
      zone,
      {
        id: 'multi-sites',
        icon: 'buildings',
        question: 'Puis-je équiper plusieurs sites ?',
        answer:
          'Oui. ==Un seul devis et un seul contrat== pour l’ensemble de vos établissements, avec **un plan d’implantation pour chacun**.',
      },
    ],
  },
]
