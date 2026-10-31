/* oxlint-disable react/only-export-components -- the hook and provider form one small i18n module */
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type Locale = 'fr' | 'en'

type LocaleContextValue = {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (text: string) => string
}

const STORAGE_KEY = 'defibrillateur-tn.locale'

const en: Record<string, string> = {
  'Location de défibrillateurs partout en Tunisie': 'Defibrillator rental throughout Tunisia',
  'Demander un devis gratuit': 'Request a free quote',
  'Devis gratuit': 'Free quote',
  'Voir nos packs': 'View our packages',
  'Pourquoi s’équiper': 'Why get equipped',
  'Sauver une vie': 'Save a life',
  'Nos packs': 'Our packages',
  'Mentions légales': 'Legal notice',
  'Confidentialité': 'Privacy',
  'Tunis, Tunisie': 'Tunis, Tunisia',
  'Armoire murale pour défibrillateur, manipulable en trois dimensions': '3D interactive wall cabinet for a defibrillator',
  'Entreprises & ERP': 'Businesses & Public Places',
  'Pack Tout Inclus': 'All-Inclusive Package',
  'Intervention Rapide': 'Emergency Response',
  'Pose & Formation': 'Installation & Training',
  'Pack ZOLL AED Plus': 'ZOLL AED Plus Package',
  'Pack défibrillateur Schiller : armoire, signalétique, électrodes et trousse de secours': 'Schiller defibrillator package: cabinet, signage, pads and first-aid kit',
  'Pack ZOLL : défibrillateur, armoire murale, électrodes, trousse et signalétique': 'ZOLL package: defibrillator, wall cabinet, pads, kit and signage',
  'Armoire, défibrillateur, signalétique et technicien qui installe l’appareil': 'Cabinet, defibrillator, signage and technician installing the device',
  'Pack Cardiac Science : défibrillateur, armoire, sacoche et signalétique': 'Cardiac Science package: defibrillator, cabinet, carrying case and signage',
  'Trousse de secours : ciseaux, gants, rasoir et compresses': 'First-aid kit: scissors, gloves, razor and dressings',
  'Écoles': 'Schools', 'Élèves et profs': 'Students and staff',
  'Salles de sport': 'Gyms', 'Effort intense': 'Intense exercise',
  'Clients et équipe': 'Guests and staff', 'Hôtels': 'Hotels', 'Voyageurs': 'Travellers',
  'Entreprises': 'Businesses', 'Salariés': 'Employees', 'Commerces': 'Retail stores',
  'Forte affluence': 'High footfall', 'Cliniques': 'Clinics', 'Patients fragiles': 'Vulnerable patients',
  'Usines': 'Factories', 'Travail physique': 'Physical work',
  'Armoire murale': 'Wall cabinet', 'Installation': 'Installation', 'Maintenance': 'Maintenance',
  'Le défibrillateur protégé, visible et signalé.': 'The defibrillator protected, visible and signposted.',
  'Posé chez vous par nos techniciens, au bon endroit.': 'Installed on your premises by our technicians, in the right spot.',
  'Électrodes, batterie, contrôles : toujours prêt.': 'Pads, battery, checks: always ready.',
  'Vos équipes formées aux gestes qui sauvent.': 'Your teams trained in life-saving skills.',
  'Voir les packs': 'See the packages', 'Demander une pose': 'Book an installation',
  'Comment on l’entretient': 'How we maintain it', 'Les gestes qui sauvent': 'Life-saving skills',
  'Inclus dans la location': 'Included in the rental',
  'Armoire murale avec défibrillateur fixée sur la façade en bois d’un refuge': 'Wall cabinet with a defibrillator mounted on the wooden front of a mountain hut',
  'Armoire murale ZOLL avec son défibrillateur et sa signalétique, posée sur un mur': 'ZOLL wall cabinet with its defibrillator and signage, mounted on a wall',
  'Un collègue pratique un massage cardiaque dans un entrepôt, un défibrillateur posé à côté': 'A colleague performs CPR in a warehouse, a defibrillator close at hand',
  'Deux défibrillateurs ZOLL au bord d’un terrain de football': 'Two ZOLL defibrillators at the edge of a football pitch',
  'Vous recevez du public chaque jour': 'You welcome visitors every day',
  'Plus il y a de passage, plus un arrêt cardiaque sur place devient probable.': 'The more people visit, the greater the chance of a cardiac arrest occurring on site.',
  'Beaucoup de personnes présentes sur place': 'A large number of people present on the premises',
  'Plus il y a de monde réuni sur place, plus le risque d’un arrêt cardiaque augmente.': 'The more people gathered in one place, the higher the risk of a cardiac arrest.',
  'Votre public est âgé ou fragile': 'Your visitors are elderly or vulnerable',
  'Le risque cardiaque augmente fortement avec l’âge et les maladies chroniques.': 'Cardiac risk increases sharply with age and chronic illness.',
  'Une activité physique a lieu sur place': 'Physical activity takes place on site',
  'Un effort intense peut déclencher un arrêt, même chez une personne jeune.': 'Intense exercise can trigger cardiac arrest, even in a young person.',
  'Les secours mettent du temps à arriver': 'Emergency services take time to arrive',
  'Sans choc dans les premières minutes, les chances de survie s’effondrent.': 'Without a shock in the first few minutes, the chances of survival collapse.',
  'Vous n’avez pas encore de défibrillateur': 'You do not yet have a defibrillator',
  'Aujourd’hui, personne sur place ne pourrait délivrer le choc.': 'Today, nobody on site would be able to deliver the shock.',
  '4 juillet 2026': '4 July 2026',
  'avant des lésions cérébrales': 'before brain damage can occur',
  'âge moyen des victimes': 'average age of victims',
  ' ans': ' yrs',
  'Reconnaître l’arrêt': 'Recognise cardiac arrest',
  'La personne **s’effondre**, ==ne répond pas== quand on lui parle et ==ne respire plus normalement==.': 'The person **collapses**, ==does not respond== when spoken to and ==is no longer breathing normally==.',
  'Appeler le 190': 'Call 190',
  'Alertez le **SAMU** au ==190==, mettez le haut-parleur et envoyez quelqu’un ==chercher le défibrillateur==.': 'Call **SAMU** on ==190==, use speakerphone and send someone to ==fetch the defibrillator==.',
  'Masser sans s’arrêter': 'Perform continuous CPR',
  'Mains au centre de la poitrine, bras tendus : ==appuyez fort et vite==, **sans jamais vous arrêter** jusqu’à l’arrivée du défibrillateur.': 'Place your hands in the centre of the chest, arms straight: ==push hard and fast==, **without stopping** until the defibrillator arrives.',
  'Défibriller': 'Use the defibrillator',
  'Allumez l’appareil et collez les électrodes : il **analyse le cœur**, ==délivre le choc== si nécessaire et vous ==guide à la voix==.': 'Switch on the device and attach the pads: it **analyses the heart**, ==delivers a shock== if needed and ==guides you by voice==.',
  'Armoire murale et signalétique': 'Wall cabinet and signage',
  'Électrodes et batterie neuves': 'New pads and battery',
  'Installation et mise en service': 'Installation and commissioning',
  'Maintenance et contrôles réguliers': 'Maintenance and regular checks',
  'Remplacement sous 72 h': 'Replacement within 72 hours',
  'Assistance téléphonique': 'Telephone support',
  'Essentiel': 'Essential', 'Confort': 'Comfort',
  'Semi-automatique': 'Semi-automatic', 'Entièrement automatique': 'Fully automatic',
  'Un appareil simple, prêt à l’emploi.': 'A simple device, ready to use.',
  'Il corrige le massage cardiaque.': 'It provides real-time CPR feedback.',
  "L'appareil fait tout.": 'The device does everything.',
  'Guidage vocal en français': 'Voice guidance in French',
  'Formation jusqu’à 10 personnes': 'Training for up to 10 people',
  'Formation jusqu’à 15 personnes': 'Training for up to 15 people',
  'Formation jusqu’à 25 personnes': 'Training for up to 25 people',
  'Guidage multilingue (arabe, anglais)': 'Multilingual guidance (Arabic, English)',
  'Capteur RCP intégré': 'Integrated CPR sensor',
  'Assistance au massage cardiaque': 'CPR assistance',
  'Suivi connecté de l’appareil': 'Connected device monitoring',
  'Zéro investissement': 'No upfront investment',
  'Installation et maintenance': 'Installation and maintenance',
  'Partout en Tunisie': 'Throughout Tunisia',
  'Dès que possible': 'As soon as possible',
  'Dans le mois': 'Within one month',
  'Dans les trois mois': 'Within three months',
  'Je me renseigne': 'I am gathering information',
  'Pourquoi louer plutôt qu’acheter ?': 'Why rent instead of buying?',
  '==Aucun investissement de départ== : un loyer mensuel déductible, et un appareil toujours opérationnel. **Électrodes, batterie et maintenance** sont à notre charge pendant toute la durée du contrat.': '==No upfront investment==: a deductible monthly rental fee and a device that is always operational. **Pads, battery and maintenance** are covered by us throughout the contract.',
  'Est-ce obligatoire en Tunisie ?': 'Is it mandatory in Tunisia?',
  '**Pas encore.** Le ministère de la Santé a annoncé en juillet 2026 un projet de loi pour équiper les lieux publics. ==S’équiper maintenant, c’est anticiper==, et surtout protéger vos équipes dès aujourd’hui.': '**Not yet.** In July 2026, the Ministry of Health announced draft legislation to equip public places. ==Getting equipped now means staying ahead== and, above all, protecting your teams today.',
  'Faut-il être formé pour l’utiliser ?': 'Do you need training to use it?',
  '==Non.== L’appareil analyse seul le rythme cardiaque, **guide l’utilisateur à la voix** et ne délivre un choc que s’il est nécessaire. Une formation courte de vos équipes reste incluse.': '==No.== The device analyses the heart rhythm, **guides the user by voice** and only delivers a shock when needed. Short team training is included.',
  'Que comprend la location ?': 'What does the rental include?',
  'Le défibrillateur, **l’armoire murale**, la signalétique, les consommables (électrodes et batterie), **l’installation sur site** et ==le remplacement de l’appareil sous 72 h== en cas de panne.': 'The defibrillator, **wall cabinet**, signage, consumables (pads and battery), **on-site installation** and ==replacement within 72 hours== in the event of a fault.',
  'Intervenez-vous partout en Tunisie ?': 'Do you operate throughout Tunisia?',
  '==Oui, dans tout le pays.== Du Grand Tunis au Sud, pour **un site unique comme pour un réseau** d’établissements.': '==Yes, nationwide.== From Greater Tunis to the south, for **a single site or a network** of locations.',
  'Combien de défibrillateurs prévoir ?': 'How many defibrillators do you need?',
  'Un appareil doit pouvoir être atteint et ramené en ==moins de 3 minutes==. Pour un grand site ou plusieurs bâtiments, nous établissons **gratuitement un plan d’implantation**.': 'A device must be reachable and brought back in ==under 3 minutes==. For a large site or several buildings, we provide **a free placement plan**.',
  // Page FAQ : thèmes.
  'La location': 'Rental',
  'Ce que vous payez, ce que vous recevez, et pour combien de temps.': 'What you pay, what you get, and for how long.',
  'L’appareil et son utilisation': 'The device and how to use it',
  'Un défibrillateur est conçu pour être utilisé par n’importe quel témoin.': 'A defibrillator is designed to be used by any bystander.',
  'Installation et entretien': 'Installation and maintenance',
  'Nous posons l’appareil, nous l’entretenons, vous n’avez rien à suivre.': 'We install the device and maintain it; you have nothing to keep track of.',
  'Formation': 'Training',
  'Savoir quoi faire dans les premières minutes change tout.': 'Knowing what to do in the first few minutes changes everything.',
  'Réglementation': 'Regulations',
  'Où en est la loi, et pourquoi ne pas l’attendre.': 'Where the law stands, and why not to wait for it.',
  'Devis et tarifs': 'Quotes and pricing',
  'Un devis gratuit, adapté à votre site, sous 24 h ouvrées.': 'A free quote, tailored to your site, within one business day.',
  // Page FAQ : questions.
  'Quelle est la durée d’engagement ?': 'How long is the commitment?',
  'Trois durées au choix : ==24, 36 ou 48 mois==. **Plus l’engagement est long, plus le loyer mensuel baisse**, à prestations identiques.': 'Three terms to choose from: ==24, 36 or 48 months==. **The longer the commitment, the lower the monthly fee**, for exactly the same service.',
  'Que se passe-t-il en fin de contrat ?': 'What happens at the end of the contract?',
  'Vous choisissez : **renouveler la location**, avec un appareil récent si vous le souhaitez, ou ==nous le restituer, sans frais==. Nous venons le récupérer sur place.': 'You choose: **renew the rental**, with a newer device if you wish, or ==return it to us at no cost==. We collect it on site.',
  'Et si je préfère acheter l’appareil ?': 'What if I would rather buy the device?',
  'C’est possible : l’achat se fait sur **la boutique de notre groupe**, ==Cardiolife.tn==. La location reste la formule la plus simple, puisque l’entretien y est compris.': 'You can: purchases are made through **our group’s store**, ==Cardiolife.tn==. Renting remains the simplest option, since maintenance is included.',
  'Semi-automatique ou entièrement automatique : quelle différence ?': 'Semi-automatic or fully automatic: what is the difference?',
  'Les deux **analysent le cœur et guident à la voix**. Le semi-automatique ==demande d’appuyer sur un bouton== pour délivrer le choc ; l’entièrement automatique ==le délivre seul==, après un compte à rebours. Les packs Essentiel et Confort sont semi-automatiques, le pack Premium est entièrement automatique.': 'Both **analyse the heart and give voice guidance**. A semi-automatic device ==asks you to press a button== to deliver the shock; a fully automatic one ==delivers it on its own==, after a countdown. The Essential and Comfort packages are semi-automatic; the Premium package is fully automatic.',
  'Peut-on blesser quelqu’un par erreur ?': 'Can you hurt someone by mistake?',
  '==Non.== L’appareil **ne délivre aucun choc** si le rythme cardiaque ne le justifie pas. Face à un arrêt cardiaque, le seul vrai risque est de ne rien faire.': '==No.== The device **will not deliver a shock** unless the heart rhythm requires one. In a cardiac arrest, the only real risk is doing nothing.',
  'Fonctionne-t-il sur un enfant ?': 'Does it work on a child?',
  'Oui, avec des **électrodes pédiatriques** qui adaptent l’énergie du choc. ==Signalez-le dans votre demande de devis== si votre site accueille des enfants : école, crèche, centre de loisirs.': 'Yes, with **paediatric pads** that adjust the shock energy. ==Mention it in your quote request== if your site welcomes children: schools, nurseries, leisure centres.',
  'En quelle langue l’appareil guide-t-il ?': 'Which language does the device use?',
  'Tous nos appareils guident **en français**. Les packs Confort et Premium proposent aussi ==l’arabe et l’anglais==, utiles pour un public international.': 'All our devices give guidance **in French**. The Comfort and Premium packages also offer ==Arabic and English==, useful for international visitors.',
  'Où installer le défibrillateur ?': 'Where should the defibrillator be installed?',
  'À un endroit **visible, accessible à tous et sans clé** : hall d’accueil, couloir principal, près des ascenseurs. Nous choisissons l’emplacement ==avec vous, lors de l’installation==.': 'Somewhere **visible, accessible to everyone and never locked**: reception area, main corridor, near the lifts. We choose the location ==with you, during installation==.',
  'Qui s’occupe de l’entretien ?': 'Who takes care of maintenance?',
  '==Nous, entièrement.== **Contrôles réguliers**, remplacement des électrodes et de la batterie avant leur date d’expiration : l’appareil est toujours prêt, sans que vous ayez à y penser.': '==We do, entirely.== **Regular checks**, and pads and battery replaced before they expire: the device is always ready, without you having to think about it.',
  'Et si l’appareil tombe en panne ?': 'What if the device breaks down?',
  'Il est ==remplacé sous 72 h==, sans frais. L’appareil réalise aussi **des autotests réguliers** et signale lui-même toute anomalie.': 'It is ==replaced within 72 hours==, at no cost. The device also runs **regular self-tests** and reports any fault itself.',
  'Que faire après avoir utilisé le défibrillateur ?': 'What should I do after the defibrillator has been used?',
  '**Prévenez-nous.** Nous remplaçons ==les électrodes et, si besoin, la batterie== pour que l’appareil soit de nouveau opérationnel. Ce remplacement est compris dans la location.': '**Let us know.** We replace ==the pads and, if needed, the battery== so the device is ready again. This replacement is included in the rental.',
  'La formation est-elle incluse ?': 'Is training included?',
  '==Oui, dans chaque pack.== Une session sur site pour **reconnaître un arrêt cardiaque, masser et utiliser le défibrillateur**, pour 10, 15 ou 25 personnes selon le pack.': '==Yes, in every package.== An on-site session to **recognise a cardiac arrest, perform CPR and use the defibrillator**, for 10, 15 or 25 people depending on the package.',
  'Qui faut-il former ?': 'Who should be trained?',
  'Idéalement **plusieurs personnes par équipe et par horaire**, pour qu’il y ait toujours quelqu’un de formé sur place. Mais ==n’importe quel témoin peut utiliser l’appareil==, même sans formation.': 'Ideally **several people per team and per shift**, so that someone trained is always on site. But ==any bystander can use the device==, even without training.',
  'Pourquoi s’équiper sans attendre la loi ?': 'Why get equipped without waiting for the law?',
  'Parce qu’un arrêt cardiaque n’attend pas : ==chaque minute sans choc fait perdre environ 10 % de chances de survie==. **Les secours mettent souvent plus de temps à arriver** ; un défibrillateur sur place comble ce délai.': 'Because cardiac arrest does not wait: ==every minute without a shock costs about 10% of the chance of survival==. **Emergency services often take longer to arrive**; a defibrillator on site bridges that gap.',
  'Le devis est-il gratuit et sans engagement ?': 'Is the quote free and without obligation?',
  '==Oui, gratuit et sans engagement.== Vous recevez **un devis détaillé sous 24 h ouvrées**, adapté à la surface et à la configuration de votre site.': '==Yes, free and without obligation.== You receive **a detailed quote within one business day**, tailored to the size and layout of your site.',
  'Les prix affichés sont-ils HT ?': 'Are the prices shown excluding tax?',
  'Oui : les loyers sont indiqués ==hors taxes, par mois et par appareil==. Le devis détaille **le montant TTC** et le total pour l’ensemble de vos appareils.': 'Yes: rental fees are shown ==excluding tax, per month and per device==. The quote details **the amount including tax** and the total for all your devices.',
  'Puis-je équiper plusieurs sites ?': 'Can I equip several sites?',
  'Oui. ==Un seul devis et un seul contrat== pour l’ensemble de vos établissements, avec **un plan d’implantation pour chacun**.': 'Yes. ==One quote and one contract== for all your sites, with **a placement plan for each**.',
  'Industrie & services': 'Industry & services',
  'Banques & commerce': 'Banking & retail',
  'Hôtellerie & loisirs': 'Hospitality & leisure',
}

function initialLocale(): Locale {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored === 'fr' || stored === 'en') return stored
  } catch {
    // The browser language remains a safe fallback when storage is unavailable.
  }
  return window.navigator.language.toLowerCase().startsWith('fr') ? 'fr' : 'en'
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(initialLocale)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, locale)
    } catch {
      // The language still works for the current visit without persistence.
    }
    document.documentElement.lang = locale
    document.title = locale === 'en'
      ? 'Defibrillateur.TN · Defibrillator rental in Tunisia from 140 DT/month'
      : 'Defibrillateur.TN · Location de défibrillateurs en Tunisie dès 140 DT/mois'

    const description = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    if (description) {
      description.content = locale === 'en'
        ? 'Tunisia’s leading defibrillator rental service. AED, installation, maintenance and training included for businesses, schools, restaurants and shops.'
        : 'N°1 de la location de défibrillateurs en Tunisie. DAE installé, entretenu et formation incluse pour entreprises, écoles, restaurants et commerces.'
    }
  }, [locale])

  const value = useMemo<LocaleContextValue>(() => ({
    locale,
    setLocale,
    t: (text) => locale === 'en' ? (en[text] ?? text) : text,
  }), [locale])

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale() {
  const context = useContext(LocaleContext)
  if (!context) throw new Error('useLocale must be used inside <LocaleProvider>.')
  return context
}
