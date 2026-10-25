import { useEffect, useRef, useState } from 'react'
import { AedSign } from '@/components/ui/AedSign'
import { usePrefersReducedMotion } from '@/animations/usePrefersReducedMotion'
import { useLocale } from '@/i18n/LocaleProvider'
import { gsap } from '@/animations/gsap'
import { cn } from '@/lib/cn'

type HeroCardSlide = {
  id: string
  src: string
  alt: string
  title: string
  badge: string
  fit: 'cover' | 'contain'
}

/**
 * Visuels affichés dans le hero : proviennent exclusivement du dossier public/header/
 */
const HERO_CARDS: readonly HeroCardSlide[] = [
  {
    id: 'image2',
    src: '/header/image2.jpg',
    alt: 'Armoire murale et défibrillateur ZOLL installés sur site',
    title: 'Installation Réelle',
    badge: 'Armoire & DAE ZOLL',
    fit: 'cover',
  },
  {
    id: 'pack-zoll',
    src: '/header/pack-zoll.webp',
    alt: 'Pack complet ZOLL AED Plus avec armoire murale et signalétique',
    title: 'Pack ZOLL AED Plus',
    badge: 'Pack ZOLL AED Plus',
    fit: 'contain',
  },
  {
    id: 'pack-cardiac-science',
    src: '/header/pack-cardiac-science.webp',
    alt: 'Pack complet Cardiac Science Powerheart G5 avec armoire et accessoires',
    title: 'Pack Powerheart G5',
    badge: 'Pack Cardiac Science',
    fit: 'contain',
  },
] as const

const getSlotConfig = (slot: number, isMobile: boolean) => {
  switch (slot) {
    case 0: // FRONT (Carte active au centre)
      return {
        x: 0,
        y: 0,
        rotation: -1.8,
        scale: 1,
        opacity: 1,
        zIndex: 25,
        boxShadow: '0 20px 45px -10px rgba(7, 18, 36, 0.28)',
      }
    case 1: // RIGHT (Carte suivante qui dépasse à droite)
      return {
        x: isMobile ? 38 : 52,
        y: isMobile ? -8 : -12,
        rotation: 5.2,
        scale: 0.92,
        opacity: 0.88,
        zIndex: 15,
        boxShadow: '0 12px 26px -6px rgba(7, 18, 36, 0.18)',
      }
    case 2: // LEFT (Carte précédente qui dépasse à gauche)
    default:
      return {
        x: isMobile ? -34 : -46,
        y: isMobile ? -14 : -18,
        rotation: -6.5,
        scale: 0.87,
        opacity: 0.75,
        zIndex: 8,
        boxShadow: '0 8px 18px -4px rgba(7, 18, 36, 0.14)',
      }
  }
}

export function StackedHeroCards() {
  const { locale, t } = useLocale()
  const prefersReducedMotion = usePrefersReducedMotion()
  const [activeIdx, setActiveIdx] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const card0Ref = useRef<HTMLDivElement>(null)
  const card1Ref = useRef<HTMLDivElement>(null)
  const card2Ref = useRef<HTMLDivElement>(null)
  const isInitialMount = useRef(true)
  const tlRef = useRef<gsap.core.Timeline | null>(null)

  const total = HERO_CARDS.length

  // Animation fluide de rotation 3D des cartes via GSAP
  useEffect(() => {
    const cards = [card0Ref.current, card1Ref.current, card2Ref.current]
    if (cards.some((c) => !c)) return

    const isMobile = window.innerWidth < 640

    if (isInitialMount.current) {
      isInitialMount.current = false
      cards.forEach((card, idx) => {
        const slot = (idx - activeIdx + total) % total
        const cfg = getSlotConfig(slot, isMobile)
        gsap.set(card, cfg)
      })
      return
    }

    if (tlRef.current) {
      tlRef.current.kill()
    }

    if (prefersReducedMotion) {
      const tl = gsap.timeline()
      tlRef.current = tl
      cards.forEach((card, idx) => {
        const slot = (idx - activeIdx + total) % total
        const cfg = getSlotConfig(slot, isMobile)
        tl.set(card, { zIndex: cfg.zIndex })
          .to(card, { opacity: cfg.opacity, duration: 0.35 }, 0)
      })
      return
    }

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    tlRef.current = tl

    cards.forEach((card, idx) => {
      const slot = (idx - activeIdx + total) % total
      const cfg = getSlotConfig(slot, isMobile)

      if (slot === 0) {
        // La nouvelle carte de tête s'élève au premier plan avec fluidité
        tl.set(card, { zIndex: 25 }, 0.2)
        tl.to(
          card,
          {
            x: cfg.x,
            y: cfg.y,
            rotation: cfg.rotation,
            scale: cfg.scale,
            opacity: cfg.opacity,
            boxShadow: cfg.boxShadow,
            duration: 0.65,
            ease: 'power3.out',
          },
          0.1,
        )
      } else {
        // Les cartes satellites s'écartent et viennent se ranger en retrait
        tl.set(card, { zIndex: cfg.zIndex }, 0.15)
        tl.to(
          card,
          {
            x: cfg.x,
            y: cfg.y,
            rotation: cfg.rotation,
            scale: cfg.scale,
            opacity: cfg.opacity,
            boxShadow: cfg.boxShadow,
            duration: 0.6,
            ease: 'power3.out',
          },
          0,
        )
      }
    })

    return () => {
      tl.kill()
    }
  }, [activeIdx, prefersReducedMotion, total])

  // Rotation automatique toutes les 4.5 secondes (avec pause au survol)
  useEffect(() => {
    if (prefersReducedMotion || isPaused || total <= 1) return

    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % total)
    }, 4500)

    return () => clearInterval(timer)
  }, [prefersReducedMotion, isPaused, total])

  const refs = [card0Ref, card1Ref, card2Ref]

  return (
    <div
      className="relative mx-auto flex w-full max-w-[420px] lg:max-w-[460px] flex-col items-center justify-center py-1 sm:py-2 select-none overflow-visible"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Halo d'ambiance lumineux d'arrière-plan */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-2 -z-10 rounded-full bg-radial from-urgent-500/10 via-brand-500/5 to-transparent blur-2xl"
      />

      {/* Scène de superposition des cartes physiques du header */}
      <div className="relative h-[290px] w-full sm:h-[320px] lg:h-[335px]">
        {HERO_CARDS.map((card, idx) => {
          const isActive = idx === activeIdx
          return (
            <div
              key={card.id}
              ref={refs[idx]}
              role="button"
              tabIndex={0}
              onClick={() => {
                if (!isActive) setActiveIdx(idx)
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  setActiveIdx(idx)
                }
              }}
              aria-label={
                isActive
                  ? t(card.title)
                  : `${t(card.title)} - ${locale === 'en' ? 'Click to view' : 'Cliquer pour afficher'}`
              }
              className={cn(
                'group absolute top-2 left-3 sm:top-3 sm:left-6 lg:left-8',
                'h-[255px] w-[195px] sm:h-[285px] sm:w-[225px] lg:h-[300px] lg:w-[235px]',
                'overflow-hidden rounded-2xl border-2 border-white bg-white p-1.5',
                'will-change-transform focus-visible:outline-2 focus-visible:outline-urgent-600',
                isActive ? 'cursor-default' : 'cursor-pointer',
              )}
            >
              <div
                className={cn(
                  'relative size-full overflow-hidden rounded-xl',
                  card.fit === 'cover' ? 'bg-navy-950' : 'bg-linear-to-b from-slate-50 via-white to-slate-100/70',
                )}
              >
                <img
                  src={card.src}
                  alt={t(card.alt)}
                  decoding="async"
                  className={cn(
                    'size-full transition-transform duration-700',
                    card.fit === 'cover' ? 'object-cover' : 'object-contain p-3 sm:p-4 drop-shadow-sm',
                    !isActive && 'group-hover:scale-105',
                  )}
                />

                {/* Voile sombre d'arrière-plan quand inactive */}
                <div
                  className={cn(
                    'absolute inset-0 transition-opacity duration-500',
                    card.fit === 'cover' ? 'bg-navy-950/20' : 'bg-navy-950/5',
                    isActive ? 'opacity-0' : 'opacity-100 group-hover:opacity-0',
                  )}
                />

                {/* Gradient bas pour lisibilité de la légende */}
                <div
                  className={cn(
                    'absolute inset-x-0 bottom-0 h-20 bg-linear-to-t',
                    card.fit === 'cover'
                      ? 'from-navy-950/90 via-navy-950/40 to-transparent'
                      : 'from-white/95 via-white/70 to-transparent',
                  )}
                />

                {/* Badge catégorie en haut */}
                <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5 rounded-full bg-navy-950/85 px-2.5 py-1 text-[9.5px] font-semibold text-white backdrop-blur-md shadow-xs">
                  <span
                    className={cn(
                      'size-1.5 rounded-full transition-colors',
                      isActive ? 'bg-brand-400 animate-pulse' : 'bg-navy-400',
                    )}
                  />
                  <span>{t(card.badge)}</span>
                </div>

                {/* Titre en bas de la carte */}
                <div className="absolute inset-x-0 bottom-2.5 z-10 px-3">
                  <p
                    className={cn(
                      'text-[12px] sm:text-[13px] font-bold leading-tight',
                      card.fit === 'cover' ? 'text-white drop-shadow-sm' : 'text-navy-950',
                    )}
                  >
                    {t(card.title)}
                  </p>
                </div>
              </div>
            </div>
          )
        })}

        {/* =========================================================================
            PANNEAU FIXE « CE SITE EST ÉQUIPÉ D’UN DÉFIBRILLATEUR » (z-35)
            Toujours présent au premier plan, ancré en bas à gauche
            ========================================================================= */}
        <div
          data-anim="pop"
          className="sticker-slap absolute -bottom-1 left-0 sm:left-2 lg:-left-2 z-35 w-[185px] max-w-[calc(100%-16px)] origin-bottom-left sm:w-[210px] lg:w-[225px]"
        >
          <p className="mb-1 ml-1 inline-block rotate-2 rounded-sm bg-navy-950 px-2 py-0.5 text-[9px] font-bold tracking-wide text-white uppercase sm:text-[10px]">
            {locale === 'en'
              ? 'Display this sign on your premises'
              : 'À coller dès maintenant chez vous'}
          </p>
          <AedSign size="sm" />
        </div>
      </div>

      {/* Boutons de contrôle / sélecteur pour alterner entre les 3 visuels */}
      <div
        role="tablist"
        aria-label={locale === 'en' ? 'Slide selector' : 'Sélecteur de visuel'}
        className="mt-3 flex items-center gap-1.5 sm:gap-2 flex-wrap justify-center"
      >
        {HERO_CARDS.map((card, idx) => {
          const isActive = idx === activeIdx
          return (
            <button
              key={card.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveIdx(idx)}
              className={cn(
                'group flex items-center gap-1.5 rounded-full px-2.5 sm:px-3 py-1 text-[10.5px] sm:text-[11px] font-medium transition-all duration-300 cursor-pointer',
                isActive
                  ? 'bg-navy-950 text-white shadow-xs'
                  : 'bg-navy-100/70 text-navy-600 hover:bg-navy-100 hover:text-navy-950',
              )}
            >
              <span
                className={cn(
                  'size-1.5 rounded-full transition-all duration-300',
                  isActive ? 'bg-urgent-500 scale-125' : 'bg-navy-400 group-hover:bg-navy-600',
                )}
              />
              <span>{card.badge}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
