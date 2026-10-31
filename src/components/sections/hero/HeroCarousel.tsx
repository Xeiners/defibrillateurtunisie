import { useEffect, useState } from 'react'
import { ArrowRight, CaretRight } from '@phosphor-icons/react'
import { AedSign } from '@/components/ui/AedSign'
import { usePrefersReducedMotion } from '@/animations/usePrefersReducedMotion'
import { heroSlides } from '@/data/landing'
import { cn } from '@/lib/cn'
import { useLocale } from '@/i18n/LocaleProvider'

/** Temps d'affichage d'une photo. */
const SLIDE_DURATION = 5500

/**
 * Fondu vers le blanc de la page : par le haut en mobile, où la photo passe
 * sous le texte, par la gauche en grand écran, où elle est à côté.
 */
const FADE_CLASS =
  '[mask-image:linear-gradient(to_bottom,transparent,black_22%)] lg:[mask-image:linear-gradient(to_right,transparent_0,rgb(0_0_0/0.6)_14%,black_32%)]'

/**
 * Le grand visuel du hero : les photos défilent en fondu, plein cadre, sur
 * toute la moitié droite. Le cadre touche la barre de navigation et la section
 * suivante, déborde jusqu'au bord droit de la fenêtre, et se fond dans le blanc
 * de la page côté texte au lieu de s'arrêter sur un bord net.
 *
 * Défilement automatique, suspendu au survol ; la flèche passe à la suivante
 * et relance le décompte. Sous « mouvement réduit », les photos changent sans
 * zoom.
 *
 * Le panneau « Ce site est équipé d'un défibrillateur » reste posé au premier
 * plan, dans la zone de fondu.
 */
export function HeroCarousel() {
  const { locale, t } = useLocale()
  const prefersReducedMotion = usePrefersReducedMotion()
  const [active, setActive] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const total = heroSlides.length
  const next = () => setActive((current) => (current + 1) % total)

  // `active` en dépendance : un clic sur la flèche relance le décompte.
  useEffect(() => {
    if (isPaused) return
    const timer = window.setTimeout(
      () => setActive((current) => (current + 1) % total),
      SLIDE_DURATION,
    )
    return () => window.clearTimeout(timer)
  }, [isPaused, active, total])

  return (
    <div
      onPointerEnter={() => setIsPaused(true)}
      onPointerLeave={() => setIsPaused(false)}
      className="relative -mx-4 h-[420px] sm:-mx-6 sm:h-[500px] md:h-[540px] lg:mx-0 lg:h-full lg:min-h-[580px]"
    >
      <div
        role="region"
        aria-roledescription={locale === 'en' ? 'carousel' : 'carrousel'}
        aria-label={locale === 'en' ? 'Our installations' : 'Nos installations'}
        className={cn('absolute inset-0 overflow-hidden', FADE_CLASS)}
      >
        {heroSlides.map((slide, index) => {
          const isActive = index === active
          return (
            <figure
              key={slide.id}
              aria-hidden={!isActive}
              className={cn(
                'absolute inset-0 m-0 transition-opacity duration-1000 ease-smooth',
                isActive ? 'opacity-100' : 'opacity-0',
              )}
            >
              {/* Zoom lent sur la photo active : il dure plus longtemps que la
                  photo, si bien qu'elle bouge encore quand la suivante arrive. */}
              <img
                src={slide.src}
                alt={t(slide.alt)}
                loading={index === 0 ? 'eager' : 'lazy'}
                fetchPriority={index === 0 ? 'high' : 'auto'}
                decoding="async"
                style={{ objectPosition: slide.focus }}
                className={cn(
                  'size-full object-cover',
                  !prefersReducedMotion && 'transition-transform duration-[7000ms] ease-out',
                  isActive || prefersReducedMotion ? 'scale-100' : 'scale-[1.08]',
                )}
              />
            </figure>
          )
        })}

        {/* Voiles : un dégradé bas sur toute la largeur, renforcé derrière le
            titre (en bas à gauche en mobile, en bas à droite en grand écran),
            pour que le texte reste lisible quelle que soit la photo. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-3/4 bg-linear-to-t from-navy-950/85 via-navy-950/40 to-transparent"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_0%_100%,rgb(7_18_36/0.55),transparent_70%)] lg:bg-[radial-gradient(ellipse_55%_55%_at_100%_100%,rgb(7_18_36/0.6),transparent_75%)]"
        />
      </div>

      {/* Toute la photo est un lien vers la partie du site qui en parle. Le
          titre est dans le lien : c'est lui qui le nomme. Seul le lien de la
          photo active est atteignable. */}
      {heroSlides.map((slide, index) => {
        const isActive = index === active
        return (
          <a
            key={slide.id}
            href={slide.link.href}
            inert={!isActive}
            className={cn(
              'group absolute inset-0 transition-opacity duration-700 ease-smooth focus-visible:outline-none',
              isActive ? 'opacity-100' : 'pointer-events-none opacity-0',
            )}
          >
            <span className="absolute inset-x-4 bottom-28 pr-14 sm:inset-x-6 sm:bottom-40 sm:max-w-md sm:pr-0 lg:inset-x-auto lg:right-8 lg:bottom-10 lg:max-w-sm lg:text-right [text-shadow:0_1px_12px_rgb(7_18_36/0.55)]">
              <span className="block text-[11px] font-bold tracking-[0.14em] text-white/90 uppercase">
                {t('Inclus dans la location')}
              </span>
              <span className="mt-1 block text-[clamp(1.75rem,3vw,2.5rem)] leading-none font-bold tracking-tight text-white">
                {t(slide.title)}
              </span>
              <span className="mt-2 block text-[14px] leading-snug font-medium text-white sm:text-[15px]">
                {t(slide.caption)}
              </span>
              <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 [text-shadow:none] text-[13px] font-semibold text-navy-950 transition-colors group-hover:bg-urgent-600 group-hover:text-white group-focus-visible:ring-2 group-focus-visible:ring-white">
                {t(slide.link.label)}
                <ArrowRight size={13} weight="bold" aria-hidden="true" className="transition-transform group-hover:translate-x-0.5" />
              </span>
            </span>
          </a>
        )
      })}

      {/* Seule commande : la flèche « suivante », au milieu du bord droit. */}
      <button
        type="button"
        onClick={next}
        aria-label={locale === 'en' ? 'Next photo' : 'Photo suivante'}
        className="absolute top-1/2 right-3 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-navy-950/35 text-white ring-1 ring-white/25 backdrop-blur-md transition-[background-color,color,scale] duration-300 ease-smooth hover:bg-white hover:text-navy-950 active:scale-95 sm:right-5 sm:size-12 lg:right-6"
      >
        <CaretRight size={18} weight="bold" aria-hidden="true" />
      </button>

      {/* Le panneau DAE, toujours au premier plan : un autocollant posé sur la
          photo, pas un élément de celle-ci. En mobile, il est assez large pour
          que son texte tienne sur deux lignes, et l'étiquette « À coller » est
          retirée : sans cela, il montait jusque sur le bouton du titre. */}
      <div
        data-anim="pop"
        className="sticker-slap absolute bottom-4 left-2 z-10 w-[220px] origin-bottom-left sm:bottom-6 sm:left-3 sm:w-[235px] lg:bottom-8 lg:-left-16"
      >
        <p className="mb-1 ml-1 hidden rotate-2 rounded-sm bg-navy-950 px-2 py-0.5 text-[10px] font-bold tracking-wide whitespace-nowrap text-white uppercase sm:inline-block">
          {locale === 'en' ? 'Display this sign on your premises' : 'À coller dès maintenant chez vous'}
        </p>
        <AedSign size="sm" />
      </div>
    </div>
  )
}
