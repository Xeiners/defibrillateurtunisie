import { useState } from 'react'
import { Check } from '@phosphor-icons/react'
import { AedSign } from '@/components/ui/AedSign'
import { Button } from '@/components/ui/Button'
import { SplitWords } from '@/components/ui/SplitWords'
import { TunisiaFlag } from '@/components/ui/TunisiaFlag'
import { heroSlides, type HeroSlide } from '@/data/landing'
import { CURRENCY, HEADLINE_PRICE } from '@/data/pricing'
import { actions } from '@/data/site'
import { cn } from '@/lib/cn'
import { useLocale } from '@/i18n/LocaleProvider'

const HIGHLIGHTS = ['Zéro investissement', 'Installation et maintenance', 'Partout en Tunisie']

const FADE_Y = 'linear-gradient(to bottom, transparent, black 14%, black 86%, transparent)'
const FADE_X = 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)'

/**
 * Hero.
 *
 * À gauche, le discours : l'accent rouge porte sur « location », pas sur le
 * prix. Le vert reste secondaire (coches, panneau DAE).
 * À droite, les visuels défilent en continu — deux colonnes en sens contraires
 * sur grand écran, une rangée horizontale en mobile — et s'arrêtent au survol.
 * Par-dessus, le panneau DAE vient se « coller » : c'est ce que l'établissement
 * affichera dès l'installation.
 *
 * Défilement en CSS et non en GSAP : il tourne dès le premier rendu, et la
 * règle « mouvement réduit » le fige.
 */
export function Hero() {
  const { locale, t } = useLocale()
  const [missing, setMissing] = useState<ReadonlySet<string>>(new Set())
  const slides = heroSlides.filter((slide) => !missing.has(slide.src))

  // Un visuel absent de `public/` retire sa case plutôt que d'afficher une image cassée.
  const onMissing = (src: string) => setMissing((current) => new Set(current).add(src))

  const columnA = slides.filter((_, index) => index % 2 === 0)
  const columnB = slides.filter((_, index) => index % 2 === 1)

  return (
    <section id="top" className="overflow-x-clip bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 pt-8 pb-14 sm:px-6 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-12 lg:py-10">
        {/* `min-w-0` sur les deux colonnes : la rangée d'images en `w-max`
            élargirait sinon la grille au-delà de l'écran en mobile. */}
        <div className="min-w-0">
          <p data-anim="left" className="flex items-center gap-2 text-[13px] font-semibold text-navy-700">
            <TunisiaFlag className="h-3.5 w-auto" />
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
            <Button href={actions.quote.href} withArrow>
              {t(actions.quote.label)}
            </Button>
            <Button href={actions.offers.href} variant="outline">
              {t(actions.offers.label)}
            </Button>
          </div>

          <ul data-anim="stagger" data-delay="0.5" className="mt-5 flex list-none flex-wrap gap-x-5 gap-y-2">
            {HIGHLIGHTS.map((item) => (
              <li key={item} className="flex items-center gap-1.5 text-[13px] font-medium text-navy-600">
                <Check size={14} weight="bold" className="text-brand-600" aria-hidden="true" />
                {t(item)}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative min-w-0">
          {/* Grand écran : deux colonnes en sens contraires. */}
          <div
            className="marquee-pause hidden h-[420px] grid-cols-2 gap-3 overflow-hidden lg:grid"
            style={{ maskImage: FADE_Y, WebkitMaskImage: FADE_Y }}
          >
            <SlideColumn slides={columnA} direction="up" onMissing={onMissing} />
            <SlideColumn slides={columnB} direction="down" onMissing={onMissing} />
          </div>

          {/* Mobile : une rangée qui défile vers la gauche. */}
          <div
            className="marquee-pause -mx-4 overflow-hidden sm:-mx-6 lg:hidden"
            style={{ maskImage: FADE_X, WebkitMaskImage: FADE_X }}
          >
            <ul className="scroll-left flex w-max list-none">
              {[...slides, ...slides].map((slide, index) => (
                <li key={`${slide.src}-${index}`} aria-hidden={index >= slides.length} className="pr-3">
                  <SlideTile slide={slide} onMissing={onMissing} className="size-44 sm:size-52" />
                </li>
              ))}
            </ul>
          </div>

          {/* Le panneau qui se colle, avec sa consigne. */}
          <div className="sticker-slap absolute -bottom-10 left-2 z-10 w-[250px] origin-bottom-left sm:w-[290px] lg:-bottom-5 lg:-left-10 lg:w-[310px]">
            <p className="mb-1.5 ml-2 inline-block rotate-2 rounded-sm bg-navy-950 px-2 py-1 text-[11px] font-bold tracking-wide text-white uppercase">
              {locale === 'en' ? 'Display this sign on your premises' : 'À coller dès maintenant chez vous'}
            </p>
            <AedSign />
          </div>
        </div>
      </div>
    </section>
  )
}

type SlideColumnProps = {
  slides: HeroSlide[]
  direction: 'up' | 'down'
  onMissing: (src: string) => void
}

/**
 * Contenu doublé : l'animation parcourt 50% de la colonne, la seconde moitié
 * reprend donc exactement la place de la première. L'écart est porté par
 * chaque case (`pb-3`) et non par un `gap`, sinon la boucle sauterait d'un
 * demi-écart.
 */
function SlideColumn({ slides, direction, onMissing }: SlideColumnProps) {
  return (
    <ul className={cn('flex list-none flex-col', direction === 'up' ? 'scroll-up' : 'scroll-down')}>
      {[...slides, ...slides].map((slide, index) => (
        <li key={`${slide.src}-${index}`} aria-hidden={index >= slides.length} className="pb-3">
          <SlideTile slide={slide} onMissing={onMissing} className="aspect-square w-full" />
        </li>
      ))}
    </ul>
  )
}

type SlideTileProps = {
  slide: HeroSlide
  onMissing: (src: string) => void
  className?: string
}

function SlideTile({ slide, onMissing, className }: SlideTileProps) {
  const { t } = useLocale()
  return (
    <div className={cn('overflow-hidden rounded-lg border border-navy-100 bg-white', className)}>
      <img
        src={slide.src}
        alt={t(slide.alt)}
        decoding="async"
        onError={() => onMissing(slide.src)}
        className={cn(
          'size-full transition-transform duration-700 hover:scale-105',
          slide.fit === 'contain' ? 'object-contain p-2' : 'object-cover',
        )}
      />
    </div>
  )
}
