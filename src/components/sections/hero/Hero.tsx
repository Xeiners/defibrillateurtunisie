import { Check } from '@phosphor-icons/react'
import { Button } from '@/components/ui/Button'
import { SplitWords } from '@/components/ui/SplitWords'
import { TunisiaFlag } from '@/components/ui/TunisiaFlag'
import { HeroCarousel } from './HeroCarousel'
import { CURRENCY, HEADLINE_PRICE } from '@/data/pricing'
import { actions } from '@/data/site'
import { useLocale } from '@/i18n/LocaleProvider'

const HIGHLIGHTS = ['Installation et maintenance', 'Partout en Tunisie']

/** La formation est l'inclus qui surprend le plus : elle ressort du chapeau. */
const TRAINING_CLASS =
  'font-bold text-navy-800 underline decoration-urgent-500 decoration-2 underline-offset-3'

/**
 * Hero.
 *
 * À gauche, le discours et les actions de conversion.
 * À droite, un carrousel de photos qui occupe toute la moitié de l'écran, avec
 * le panneau DAE « Ce site est équipé d'un défibrillateur » au premier plan.
 */
export function Hero() {
  const { locale, t } = useLocale()

  return (
    <section id="top" className="overflow-x-clip bg-white">
      {/* Pas de marge haute ni basse : la photo touche la barre de navigation
          et la section suivante. Seul le texte a son propre souffle.
          Pleine largeur en grand écran : le texte part près du bord gauche au
          lieu de rester dans les 1280 px du site, et la photo va jusqu’au bord
          droit. Au-delà de 1600 px, le texte se recentre doucement. */}
      <div className="grid gap-2 px-4 sm:px-6 lg:grid-cols-[45fr_55fr] lg:gap-10 lg:pr-0 lg:pl-[max(3rem,calc((100vw_-_100rem)/2))]">
        <div className="relative z-10 min-w-0 pt-6 sm:pt-8 lg:self-center lg:py-12">
          <p data-anim="left" className="flex items-center gap-2.5 text-[15px] font-semibold text-navy-800 sm:text-[17px]">
            <TunisiaFlag className="h-4.5 w-auto sm:h-5" />
            <span>
              <span className="text-urgent-600">{locale === 'en' ? 'No. 1 in Tunisia' : 'N°1 en Tunisie'}</span> · {locale === 'en' ? 'The first AED rental service' : 'Premier service de location de DAE'}
            </span>
          </p>

          <h1
            data-anim="words"
            className="mt-3 text-[clamp(1.875rem,3.2vw,3.25rem)] leading-[1.1] font-bold tracking-tight text-navy-950"
          >
            {locale === 'en' ? (
              <>
                <SplitWords text="Rent" className="text-urgent-600" />{' '}
                <SplitWords text={`your defibrillator from ${HEADLINE_PRICE} ${CURRENCY} per month.`} />
              </>
            ) : (
              <>
                <SplitWords text="Votre défibrillateur en" />{' '}
                <SplitWords text="location," className="text-urgent-600" />{' '}
                <SplitWords text={`dès ${HEADLINE_PRICE} ${CURRENCY} par mois.`} />
              </>
            )}
          </h1>

          <p data-anim="up" data-delay="0.25" className="mt-4 max-w-lg text-[15px] leading-relaxed text-navy-500 lg:text-[16px]">
            {locale === 'en' ? (
              <>Defibrillator, wall cabinet, signage, installation, maintenance and <strong className={TRAINING_CLASS}>training</strong>: everything is included. No purchase required.</>
            ) : (
              <>Défibrillateur, armoire murale, signalétique, installation, maintenance et <strong className={TRAINING_CLASS}>formation</strong> : tout est inclus. Sans rien acheter.</>
            )}
          </p>

          <div data-anim="up" data-delay="0.35" className="mt-6 flex flex-wrap gap-2.5">
            <Button href={actions.quote.href} size="sm" withArrow>
              {t(actions.quote.label)}
            </Button>
            <Button href={actions.offers.href} size="sm" variant="outline">
              {t(actions.offers.label)}
            </Button>
          </div>

          <ul data-anim="stagger" data-delay="0.5" className="mt-6 flex list-none flex-wrap gap-x-6 gap-y-2.5">
            {HIGHLIGHTS.map((item) => (
              <li key={item} className="flex items-center gap-2 text-[15px] font-medium text-navy-700 sm:text-[16px]">
                <Check size={18} weight="bold" className="text-brand-600 shrink-0" aria-hidden="true" />
                {t(item)}
              </li>
            ))}
          </ul>
        </div>

        <div className="min-w-0">
          <HeroCarousel />
        </div>
      </div>
    </section>
  )
}
