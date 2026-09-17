import { site } from './site'

export type FaqEntry = {
  id: string
  /** Court libellé de repérage, affiché en regard de la question. */
  tag: string
  question: string
  /** Un élément = un paragraphe. Le découpage est porté par la donnée. */
  answer: string[]
  /**
   * Liste à puces facultative, rendue après les paragraphes.
   *
   * Elle existe parce qu'une énumération de huit services lue en prose est
   * illisible : la liste rend chaque service dénombrable, ce qui est
   * précisément ce que le lecteur y cherche.
   */
  bullets?: string[]
}

export const faqHeading =
  'Location de défibrillateur : tout savoir avant de choisir votre solution'

export const faqIntro =
  'Les questions qui reviennent le plus souvent avant de s’équiper, et les réponses que nous apportons à chaque structure.'

export const faqEntries: FaqEntry[] = [
  {
    id: 'location-vs-achat',
    tag: 'Location ou achat',
    question:
      'Pourquoi choisir la location de défibrillateur plutôt que l’achat ?',
    answer: [
      'La location de défibrillateur est aujourd’hui une solution privilégiée par de nombreuses entreprises, collectivités, associations et établissements recevant du public. Elle permet de s’équiper rapidement d’un défibrillateur automatique externe sans supporter un investissement initial important.',
      `Contrairement à l’achat, la location offre une solution clé en main qui intègre bien souvent des services essentiels au bon fonctionnement de l’appareil. Chez ${site.name}, plusieurs niveaux d’accompagnement sont proposés afin de répondre aux besoins de chaque structure, de la formule simple et efficace jusqu’au suivi complet avec surveillance connectée.`,
      'Cette approche permet de bénéficier d’un matériel toujours opérationnel tout en simplifiant sa gestion au quotidien.',
    ],
  },
  {
    id: 'avantages',
    tag: 'Avantages',
    question: 'Quels sont les avantages d’un défibrillateur en location ?',
    answer: [
      'La location de défibrillateur présente de nombreux avantages pour les structures souhaitant renforcer la sécurité de leurs collaborateurs, visiteurs ou usagers.',
    ],
    bullets: [
      'Aucun investissement important à prévoir dès l’installation',
      'Mise à disposition immédiate d’un défibrillateur professionnel',
      'Télémaintenance incluse selon la formule choisie',
      'Assistance téléphonique',
      'Envoi automatique des consommables à échéance',
      'Surveillance connectée 24 h/24 et 7 j/7, en option',
      'Alertes en temps réel en cas d’anomalie',
      'Contrôles réguliers garantissant le bon fonctionnement du matériel',
    ],
  },
  {
    id: 'entreprise',
    tag: 'En entreprise',
    question: 'Pourquoi installer un défibrillateur dans une entreprise ?',
    answer: [
      'L’arrêt cardiaque peut survenir à tout moment, y compris sur le lieu de travail. Chaque minute gagnée avant l’arrivée des secours augmente considérablement les chances de survie de la victime.',
      'Installer un défibrillateur dans une entreprise permet à la fois de protéger les salariés, de sécuriser les visiteurs et les clients, de renforcer la politique de prévention des risques et de démontrer l’engagement de l’entreprise en matière de sécurité.',
      'La location de défibrillateur pour entreprise constitue une solution particulièrement appréciée, car elle permet de bénéficier d’un équipement performant sans mobiliser de budget d’investissement important.',
    ],
  },
  {
    id: 'collectivites',
    tag: 'Collectivités',
    question:
      'La location de défibrillateur est-elle adaptée aux collectivités ?',
    answer: [
      'Oui. Les collectivités territoriales, mairies, communautés de communes, établissements scolaires ou encore infrastructures sportives ont tout intérêt à s’équiper d’un défibrillateur.',
      'La location permet de déployer rapidement plusieurs équipements sur différents sites tout en bénéficiant d’un suivi homogène. Elle simplifie également la gestion administrative et technique des appareils grâce à des services de maintenance et de surveillance adaptés.',
    ],
  },
]
