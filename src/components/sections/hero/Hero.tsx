import { Check } from '@phosphor-icons/react'
import { Button } from '@/components/ui/Button'
import { SplitWords } from '@/components/ui/SplitWords'
import { TunisiaFlag } from '@/components/ui/TunisiaFlag'
import { StackedHeroCards } from './StackedHeroCards'
import { CURRENCY, HEADLINE_PRICE } from '@/data/pricing'
import { actions } from '@/data/site'
import { useLocale } from '@/i18n/LocaleProvider'

const HIGHLIGHTS = ['Installation et maintenance', 'Partout en Tunisie']

/**
 * Hero.
 *
 * À gauche, le discours et les actions de conversion.
 * À droite, composition 3D de cartes superposées avec changement automatique
 * et panneau DAE « Ce site est équipé d'un défibrillateur » toujours présent au premier plan.
 */
export function Hero() {
  const { locale, t } = useLocale()

  return (
    <section id="top" className="overflow-x-clip bg-white">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 pt-4 pb-4 sm:px-6 sm:pt-6 sm:pb-6 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-10 lg:pt-4 lg:pb-4">
        <div className="min-w-0">
          <p data-anim="left" className="flex items-center gap-2.5 text-[15px] font-semibold text-navy-800 sm:text-[17px]">
            <TunisiaFlag className="h-4.5 w-auto sm:h-5" />
            <span>
              <span className="text-urgent-600">{locale === 'en' ? 'No. 1 in Tunisia' : 'N°1 en Tunisie'}</span> · {locale === 'en' ? 'The first AED rental service' : 'Premier service de location de DAE'}
            </span>
          </p>

          <h1
            data-anim="words"
            className="mt-3 text-[clamp(1.875rem,3.4vw,2.75rem)] leading-[1.1] font-bold tracking-tight text-navy-950"
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

          <p data-anim="up" data-delay="0.25" className="mt-4 max-w-md text-[15px] leading-relaxed text-navy-500">
            {locale === 'en'
              ? 'Device, wall cabinet, signage, installation, maintenance and training: everything is included. No purchase required.'
              : 'Appareil, armoire murale, signalétique, installation, maintenance et formation : tout est inclus. Sans rien acheter.'}
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
          <StackedHeroCards />
        </div>
      </div>
    </section>
  )
}
