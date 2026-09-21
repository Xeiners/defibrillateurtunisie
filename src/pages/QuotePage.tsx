import { CaretRight, Check } from '@phosphor-icons/react'
import { QuoteForm } from '@/components/quote/QuoteForm'
import { QuoteSelection } from '@/components/quote/QuoteSelection'
import { SplitWords } from '@/components/ui/SplitWords'
import { CURRENCY, HEADLINE_PRICE } from '@/data/pricing'
import { useQuote } from '@/store/quote-context'
import { useLocale } from '@/i18n/LocaleProvider'

/** Ce qui se passe après l'envoi, dit une fois, sous le formulaire. */
const STEPS = [
  ['1. Vous envoyez', 'Votre demande arrive chez un conseiller, avec le pack retenu.'],
  ['2. Nous chiffrons', 'Devis détaillé sous 24 h ouvrées, adapté à la surface de votre site.'],
  ['3. Nous installons', 'Pose de l’armoire, mise en service et formation de vos équipes.'],
]

/**
 * La page de devis.
 *
 * Elle a remplacé la fenêtre modale : une demande de devis se prépare, se
 * relit et se partage — trois choses qu'une fenêtre qui se ferme au moindre
 * clic à côté empêche. Elle a donc sa propre adresse, `/devis`.
 *
 * PAS de bandeau d'accroche en tête : le visiteur qui arrive ici a déjà été
 * convaincu par la page d'accueil, il vient remplir. Un titre, une ligne, et le
 * formulaire commence. Tout le reste — prix d'appel, ce qui est compris — vit
 * dans la colonne de droite, là où il sert à décider.
 *
 * Deux colonnes sur grand écran : le formulaire à gauche, la sélection de
 * packs à droite, collée en vue. Sous `lg`, la sélection passe EN PREMIER —
 * on vérifie ce qu'on demande avant de donner ses coordonnées.
 */
export function QuotePage() {
  const { count } = useQuote()
  const { locale } = useLocale()
  const steps = locale === 'en' ? [
    ['1. You submit', 'Your request reaches an adviser with your selected package.'],
    ['2. We prepare your quote', 'A detailed quote within one business day, tailored to your site.'],
    ['3. We install', 'Cabinet installation, commissioning and team training.'],
  ] : STEPS

  return (
    <>
      <section className="bg-navy-50 pt-7 pb-8 sm:pt-9 sm:pb-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <nav aria-label={locale === 'en' ? 'Breadcrumb' : 'Fil d’Ariane'}>
            <ol className="flex list-none items-center gap-1.5 text-[12.5px] text-navy-400">
              <li>
                <a href="/" className="transition-colors duration-200 hover:text-navy-900">
                  {locale === 'en' ? 'Home' : 'Accueil'}
                </a>
              </li>
              <li aria-hidden="true" className="flex items-center">
                <CaretRight size={11} weight="bold" />
              </li>
              <li aria-current="page" className="font-semibold text-navy-900">
                {locale === 'en' ? 'Quote' : 'Devis'}
              </li>
            </ol>
          </nav>

          <h1
            data-anim="words"
            className="mt-4 text-[clamp(1.625rem,3vw,2.25rem)] leading-[1.1] font-bold tracking-[-0.03em] text-navy-950"
          >
            <SplitWords text={locale === 'en' ? 'Request' : 'Demander'} />{' '}
            <SplitWords text={locale === 'en' ? 'a quote.' : 'un devis.'} className="text-urgent-600" />
          </h1>

          <p data-anim="up" data-delay="0.15" className="mt-2.5 max-w-xl text-[15px] leading-relaxed text-navy-500">
            {count > 0
              ? (locale === 'en' ? 'Your selection appears on the right. Adjust the term and number of devices, then enter your contact details.' : 'Votre sélection est reprise à droite. Ajustez la durée et le nombre d’appareils, puis laissez-nous vos coordonnées.')
              : (locale === 'en' ? `It only takes two minutes. All-inclusive rental from ${HEADLINE_PRICE} ${CURRENCY} per month, per device.` : `Deux minutes suffisent. Location tout compris, dès ${HEADLINE_PRICE} ${CURRENCY} par mois et par appareil.`)}
          </p>
        </div>

        {/*
          Les deux blocs sont les éléments de grille EUX-MÊMES, sans enveloppe.
          C'est ce qui permet à la colonne de droite de rester collée : une
          enveloppe alignée en haut (`items-start`) aurait exactement la hauteur
          de son contenu, et le `sticky` n'aurait aucune course.
        */}
        <div className="mx-auto mt-6 grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-[1.45fr_1fr] lg:items-start lg:gap-8">
          <QuoteForm className="order-2 lg:order-1" />
          <QuoteSelection className="order-1 lg:order-2" />
        </div>
      </section>

      <section className="border-t border-navy-100 bg-white py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <ul className="grid list-none gap-4 sm:grid-cols-3">
            {steps.map(([title, body]) => (
              <li key={title} className="flex items-start gap-3">
                <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-700">
                  <Check size={14} weight="bold" aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-[14px] font-bold text-navy-950">{title}</span>
                  <span className="mt-0.5 block text-[13.5px] leading-relaxed text-navy-500">{body}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
