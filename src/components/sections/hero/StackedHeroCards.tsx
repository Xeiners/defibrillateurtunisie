import { useEffect, useState } from 'react'
import { AedSign } from '@/components/ui/AedSign'
import { usePrefersReducedMotion } from '@/animations/usePrefersReducedMotion'
import { useLocale } from '@/i18n/LocaleProvider'
import { cn } from '@/lib/cn'

type HeroCardSlide = {
  id: string
  src: string
  alt: string
  title: string
  fit?: 'cover' | 'contain'
}

const HERO_CARDS: HeroCardSlide[] = [
  {
    id: 'lobby',
    src: '/caroussel/image2.png',
    alt: 'Défibrillateur ZOLL en entreprise et ERP',
    title: 'Entreprises & ERP',
    fit: 'cover',
  },
  {
    id: 'pack-schiller',
    src: '/header/pack-schiller.webp',
    alt: 'Pack Schiller tout inclus avec armoire et signalétique',
    title: 'Pack Tout Inclus',
    fit: 'contain',
  },
  {
    id: 'rescue',
    src: '/caroussel/image1.png',
    alt: 'Intervention d’urgence avec défibrillateur sur site',
    title: 'Intervention Rapide',
    fit: 'cover',
  },
  {
    id: 'formation',
    src: '/header/pack-formation-pose.webp',
    alt: 'Pose murale et formation certifiée des équipes',
    title: 'Pose & Formation',
    fit: 'cover',
  },
  {
    id: 'pack-zoll',
    src: '/header/pack-zoll.webp',
    alt: 'Pack complet ZOLL AED Plus avec électrodes et armoire',
    title: 'Pack ZOLL AED Plus',
    fit: 'contain',
  },
]

export function StackedHeroCards() {
  const { locale, t } = useLocale()
  const prefersReducedMotion = usePrefersReducedMotion()
  const [activeIdx, setActiveIdx] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [missing, setMissing] = useState<ReadonlySet<string>>(new Set())

  // Filtrer si un fichier venait à manquer
  const slides = HERO_CARDS.filter((s) => !missing.has(s.src))
  const total = slides.length

  const onMissing = (src: string) => {
    setMissing((current) => new Set(current).add(src))
  }

  // Auto-changement toutes les 4 secondes
  useEffect(() => {
    if (prefersReducedMotion || isPaused || total <= 1) return

    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % total)
    }, 4200)

    return () => clearInterval(timer)
  }, [prefersReducedMotion, isPaused, total])

  if (total === 0) return null

  // Index des 3 cartes superposées
  const centerSlide = slides[activeIdx]
  const topLeftSlide = slides[(activeIdx + 1) % total]
  const bottomRightSlide = slides[(activeIdx + 2) % total]

  return (
    <div
      className="relative mx-auto flex w-full max-w-[420px] lg:max-w-[480px] items-center justify-center py-1 sm:py-2 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Halo lumineux d'ambiance en arrière-plan */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-2 -z-10 rounded-full bg-radial from-urgent-500/10 via-brand-500/5 to-transparent blur-2xl"
      />

      {/* Cadre principal de la scène de cartes (hauteur optimisée pour ne pas écraser la page) */}
      <div className="relative h-[285px] w-full sm:h-[320px] lg:h-[340px]">
        {/* =========================================================================
            1. CARTE ARRIÈRE HAUT-GAUCHE (Satellite A - z-10)
            Superposée au coin supérieur gauche
            ========================================================================= */}
        <button
          type="button"
          onClick={() => setActiveIdx((activeIdx + 1) % total)}
          aria-label={locale === 'en' ? `Display ${t(topLeftSlide.title)}` : `Afficher ${t(topLeftSlide.title)}`}
          className={cn(
            'group absolute top-0 left-1 sm:top-1 sm:left-2 lg:left-0 z-10',
            'h-20 w-28 sm:h-24 sm:w-36 lg:h-26 lg:w-40',
            'overflow-hidden rounded-xl border border-white/90 bg-white p-1 shadow-[0_8px_20px_-6px_rgba(7,18,36,0.18)]',
            '-rotate-6 sm:-rotate-4 transition-all duration-500 ease-out hover:-rotate-1 hover:scale-105 active:scale-95 focus-visible:outline-2 focus-visible:outline-urgent-600',
          )}
        >
          <div className="relative size-full overflow-hidden rounded-lg bg-navy-50">
            <img
              src={topLeftSlide.src}
              alt={t(topLeftSlide.alt)}
              decoding="async"
              onError={() => onMissing(topLeftSlide.src)}
              className={cn(
                'size-full transition-transform duration-700 group-hover:scale-105',
                topLeftSlide.fit === 'contain' ? 'object-contain p-1.5' : 'object-cover',
              )}
            />
            <div className="absolute inset-0 bg-linear-to-t from-navy-950/60 via-transparent to-transparent opacity-80 transition-opacity group-hover:opacity-40" />
            <span className="absolute bottom-1 left-1.5 rounded-full bg-navy-950/70 px-1.5 py-0.5 text-[8.5px] font-semibold text-white backdrop-blur-xs sm:text-[9.5px]">
              {t(topLeftSlide.title)}
            </span>
          </div>
        </button>

        {/* =========================================================================
            2. CARTE CENTRALE PRINCIPALE (Hero Card - z-20)
            Format vertical compact & élégant
            ========================================================================= */}
        <div
          className={cn(
            'absolute inset-x-0 mx-auto top-1 sm:top-2 z-20',
            'h-[260px] w-[185px] sm:h-[295px] sm:w-[225px] lg:h-[315px] lg:w-[245px]',
            'overflow-hidden rounded-2xl border border-navy-100/80 bg-white p-1.5 shadow-[0_18px_40px_-10px_rgba(7,18,36,0.25)]',
            '-rotate-1 sm:-rotate-1.5 transition-transform duration-700 ease-smooth hover:rotate-0',
          )}
        >
          <div className="relative size-full overflow-hidden rounded-xl bg-navy-50">
            {slides.map((slide, idx) => {
              const isActive = idx === activeIdx
              return (
                <div
                  key={slide.id}
                  aria-hidden={!isActive}
                  className={cn(
                    'absolute inset-0 size-full transition-all duration-700 ease-in-out',
                    isActive
                      ? 'opacity-100 scale-100 pointer-events-auto'
                      : 'opacity-0 scale-105 pointer-events-none',
                  )}
                >
                  <img
                    src={slide.src}
                    alt={t(slide.alt)}
                    decoding="async"
                    onError={() => onMissing(slide.src)}
                    className={cn(
                      'size-full transition-transform duration-700',
                      slide.fit === 'contain' ? 'object-contain p-3' : 'object-cover',
                    )}
                  />
                  {/* Dégradé bas pour lisibilité */}
                  <div className="absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-navy-950/80 via-navy-950/20 to-transparent" />
                </div>
              )
            })}

            {/* Badge de catégorie de la carte centrale */}
            <div className="absolute top-2 right-2 z-10 flex items-center gap-1.5 rounded-full bg-navy-950/75 px-2.5 py-0.5 text-[10px] font-semibold text-white backdrop-blur-md shadow-xs">
              <span className="size-1.5 rounded-full bg-brand-400 animate-pulse" />
              <span>{t(centerSlide.title)}</span>
            </div>

            {/* Micro-puces de navigation pour changer manuellement */}
            <div
              role="tablist"
              aria-label={locale === 'en' ? 'Slides' : 'Diapositives'}
              className="absolute bottom-2.5 inset-x-0 z-10 flex items-center justify-center gap-1"
            >
              {slides.map((slide, idx) => {
                const isActive = idx === activeIdx
                return (
                  <button
                    key={slide.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-label={`${locale === 'en' ? 'Slide' : 'Visuel'} ${idx + 1}`}
                    onClick={() => setActiveIdx(idx)}
                    className={cn(
                      'h-1.5 rounded-full transition-all duration-300',
                      isActive ? 'w-5 bg-urgent-500' : 'w-1.5 bg-white/60 hover:bg-white',
                    )}
                  />
                )
              })}
            </div>
          </div>
        </div>

        {/* =========================================================================
            3. CARTE AVANT BAS-DROITE (Satellite B - z-30)
            Superposée au coin inférieur droit de la carte centrale
            ========================================================================= */}
        <button
          type="button"
          onClick={() => setActiveIdx((activeIdx + 2) % total)}
          aria-label={locale === 'en' ? `Display ${t(bottomRightSlide.title)}` : `Afficher ${t(bottomRightSlide.title)}`}
          className={cn(
            'group absolute bottom-3 right-1 sm:bottom-4 sm:right-2 lg:right-0 z-30',
            'h-20 w-30 sm:h-24 sm:w-38 lg:h-26 lg:w-42',
            'overflow-hidden rounded-xl border border-white bg-white p-1 shadow-[0_12px_28px_-6px_rgba(7,18,36,0.22)]',
            'rotate-5 sm:rotate-4 transition-all duration-500 ease-out hover:rotate-1 hover:scale-105 active:scale-95 focus-visible:outline-2 focus-visible:outline-urgent-600',
          )}
        >
          <div className="relative size-full overflow-hidden rounded-lg bg-navy-50">
            <img
              src={bottomRightSlide.src}
              alt={t(bottomRightSlide.alt)}
              decoding="async"
              onError={() => onMissing(bottomRightSlide.src)}
              className={cn(
                'size-full transition-transform duration-700 group-hover:scale-105',
                bottomRightSlide.fit === 'contain' ? 'object-contain p-1.5' : 'object-cover',
              )}
            />
            <div className="absolute inset-0 bg-linear-to-t from-navy-950/60 via-transparent to-transparent opacity-80 transition-opacity group-hover:opacity-40" />
            <span className="absolute bottom-1 left-1.5 rounded-full bg-navy-950/70 px-1.5 py-0.5 text-[8.5px] font-semibold text-white backdrop-blur-xs sm:text-[9.5px]">
              {t(bottomRightSlide.title)}
            </span>
          </div>
        </button>

        {/* =========================================================================
            4. PANNEAU FIXE « CE SITE EST ÉQUIPÉ D’UN DÉFIBRILLATEUR » (z-40)
            Toujours présent au premier plan, ancré en bas à gauche
            ========================================================================= */}
        <div
          data-anim="pop"
          className="sticker-slap absolute -bottom-2 left-1 sm:-bottom-2 sm:-left-2 lg:-bottom-1 lg:-left-4 z-40 w-[185px] max-w-[calc(100%-16px)] origin-bottom-left sm:w-[215px] lg:w-[230px]"
        >
          <p className="mb-1 ml-2 inline-block rotate-2 rounded-sm bg-navy-950 px-2 py-0.5 text-[9px] font-bold tracking-wide text-white uppercase sm:text-[10px]">
            {locale === 'en' ? 'Display this sign on your premises' : 'À coller dès maintenant chez vous'}
          </p>
          <AedSign size="sm" />
        </div>
      </div>
    </div>
  )
}
