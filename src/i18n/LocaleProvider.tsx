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
  'Mairies': 'Public offices', 'Accueil du public': 'Public access',
  'Vous recevez du public chaque jour': 'You welcome visitors every day',
  'Plus il y a de passage, plus un arrêt cardiaque sur place devient probable.': 'The more people visit, the greater the chance of a cardiac arrest occurring on site.',
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
      ? 'Defibrillateur.TN · Defibrillator rental in Tunisia from 100 DT/month'
      : 'Defibrillateur.TN · Location de défibrillateurs en Tunisie dès 100 DT/mois'

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
