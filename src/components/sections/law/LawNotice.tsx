import { useEffect, useRef, useState, type ReactNode } from 'react'
import { ArrowUpRight, CaretRight, Megaphone, Scales, X } from '@phosphor-icons/react'
import { TunisiaFlag } from '@/components/ui/TunisiaFlag'
import { healthPost, lawNews } from '@/data/landing'
import { actions } from '@/data/site'
import { cn } from '@/lib/cn'
import { useLocale } from '@/i18n/LocaleProvider'

/** Court temps mort avant l'entrée : la bande se pose, elle ne surgit pas. */
const REVEAL_DELAY = 400

/** Temps de lecture d'une actualité avant de passer à la suivante. */
const ROTATE_EVERY = 8000

const SLIDE_COUNT = 2

/**
 * Les actualités, en notification collée au bas de l'écran.
 *
 * Bande rouge pleine largeur, présente dès l'arrivée : c'est l'argument qui
 * fait passer de « utile » à « à faire maintenant ». Elle suit le visiteur où
 * qu'il en soit dans la page et se referme d'un clic.
 *
 * Deux actualités se relaient : le projet de loi, affiché d'abord, puis la
 * publication de sensibilisation du ministère, ouverte sur Facebook.
 * Le relais est automatique et ne s'arrête que sous le pointeur, le temps de
 * lire ; la flèche passe à la suivante, les pastilles mènent à l'une ou
 * l'autre. Sous « mouvement réduit », le relais reste, mais sans glissement.
 *
 * La fermeture n'est PAS mémorisée : la bande revient à chaque rechargement.
 * C'est voulu — l'information vaut d'être revue, et la refermer ne coûte qu'un
 * clic.
 */
export function LawNotice() {
  const { locale } = useLocale()
  const [isDismissed, setIsDismissed] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [active, setActive] = useState(0)
  const [isHeld, setIsHeld] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setIsVisible(true), REVEAL_DELAY)
    return () => window.clearTimeout(timer)
  }, [])

  // `active` en dépendance : un clic sur la flèche ou une pastille relance le
  // décompte, au lieu de laisser la bande repartir une seconde plus tard.
  useEffect(() => {
    if (!isVisible || isHeld) return
    const timer = window.setTimeout(
      () => setActive((current) => (current + 1) % SLIDE_COUNT),
      ROTATE_EVERY,
    )
    return () => window.clearTimeout(timer)
  }, [isVisible, isHeld, active])

  // La bande est fixe : elle recouvrirait le bas du pied de page. Sa hauteur
  // est publiée dans `--notice-height`, que le pied de page réserve sous lui.
  // Elle change avec la largeur (le texte passe sur deux lignes en mobile),
  // d'où l'observateur ; elle retombe à zéro à la fermeture.
  const asideRef = useRef<HTMLElement>(null)
  useEffect(() => {
    const aside = asideRef.current
    if (!aside) return
    const root = document.documentElement
    const observer = new ResizeObserver(() => {
      root.style.setProperty('--notice-height', `${aside.offsetHeight}px`)
    })
    observer.observe(aside)
    return () => {
      observer.disconnect()
      root.style.removeProperty('--notice-height')
    }
  }, [isDismissed])

  if (isDismissed) return null

  return (
    <aside
      ref={asideRef}
      aria-label={locale === 'en' ? 'News' : 'Actualités'}
      data-open={isVisible}
      onPointerEnter={() => setIsHeld(true)}
      onPointerLeave={() => setIsHeld(false)}
      className="fixed inset-x-0 bottom-0 z-40 translate-y-full bg-urgent-600 text-white shadow-[0_-8px_30px_-12px_rgb(7_18_36/0.5)] transition-transform duration-500 ease-smooth data-[open=true]:translate-y-0"
    >
      <div className="mx-auto flex max-w-7xl items-center gap-3 py-2.5 pr-14 pl-3 sm:gap-4 sm:py-3 sm:pr-16 sm:pl-6">
        {/* Les deux actualités occupent la même case : la bande garde la
            hauteur de la plus longue et ne saute pas au relais. */}
        <div className="grid min-w-0 flex-1">
          <Slide isActive={active === 0}>
            <SlideIcon>
              <Scales size={20} weight="duotone" aria-hidden="true" />
            </SlideIcon>
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-2 text-[11px] font-bold tracking-[0.1em] text-urgent-100 uppercase">
                <TunisiaFlag className="h-3 w-auto" />
                {locale === 'en' ? 'Tunisia' : 'Tunisie'} · {locale === 'en' ? '4 July 2026' : lawNews.date}
              </p>
              <p className="mt-0.5 text-[13px] leading-snug sm:text-[14px]">
                <strong className="font-semibold">
                  {locale === 'en' ? 'The Ministry of Health is preparing draft legislation' : 'Le ministère de la Santé prépare un projet de loi'}
                </strong>{' '}
                <span className="text-urgent-50">
                  {locale === 'en' ? 'to install defibrillators in public places.' : 'pour installer des défibrillateurs dans les lieux publics.'}
                </span>{' '}
                <a
                  href={lawNews.source.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-0.5 whitespace-nowrap text-urgent-100 underline underline-offset-2 transition-colors hover:text-white"
                >
                  {lawNews.source.label}
                  <ArrowUpRight size={11} aria-hidden="true" />
                </a>
              </p>
            </div>
            <a href={actions.quote.href} className={CTA_CLASS}>
              {locale === 'en' ? 'Get ahead' : 'Anticiper'}
            </a>
          </Slide>

          <Slide isActive={active === 1}>
            <SlideIcon>
              <Megaphone size={20} weight="duotone" aria-hidden="true" />
            </SlideIcon>
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-2 text-[11px] font-bold tracking-[0.1em] text-urgent-100 uppercase">
                <TunisiaFlag className="h-3 w-auto" />
                {locale === 'en' ? 'Ministry of Health' : healthPost.source} · {locale === 'en' ? 'Awareness' : 'Sensibilisation'}
              </p>
              <p className="mt-0.5 text-[13px] leading-snug sm:text-[14px]">
                <strong className="font-semibold">
                  {locale === 'en' ? 'Cardiac arrest: the Ministry of Health raises awareness.' : 'Arrêt cardiaque : le ministère de la Santé sensibilise.'}
                </strong>{' '}
                <a
                  href={healthPost.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-0.5 whitespace-nowrap text-urgent-100 underline underline-offset-2 transition-colors hover:text-white"
                >
                  {locale === 'en' ? 'Read the post' : 'Lire la publication'}
                  <ArrowUpRight size={11} aria-hidden="true" />
                </a>
              </p>
            </div>
            <a href={healthPost.href} target="_blank" rel="noreferrer noopener" className={CTA_CLASS}>
              {locale === 'en' ? 'View' : 'Voir'}
            </a>
          </Slide>
        </div>

        <div role="group" aria-label={locale === 'en' ? 'Choose a news item' : 'Choisir une actualité'} className="flex shrink-0 items-center gap-1">
          {Array.from({ length: SLIDE_COUNT }, (_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setActive(index)}
              aria-label={locale === 'en' ? `News ${index + 1} of ${SLIDE_COUNT}` : `Actualité ${index + 1} sur ${SLIDE_COUNT}`}
              aria-current={active === index ? 'true' : undefined}
              className="grid h-6 w-4 place-items-center"
            >
              <span
                aria-hidden="true"
                className={cn(
                  'h-1.5 rounded-full transition-all duration-300 ease-smooth',
                  active === index ? 'w-4 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/70',
                )}
              />
            </button>
          ))}
          <button
            type="button"
            onClick={() => setActive((current) => (current + 1) % SLIDE_COUNT)}
            aria-label={locale === 'en' ? 'Next news item' : 'Actualité suivante'}
            className="ml-1 grid size-8 place-items-center rounded-full border border-white/35 text-white transition-colors hover:border-white hover:bg-white/15 active:scale-95"
          >
            <CaretRight size={14} weight="bold" aria-hidden="true" />
          </button>
        </div>

        <button
          type="button"
          onClick={() => setIsDismissed(true)}
          aria-label={locale === 'en' ? 'Close this news bar' : 'Fermer les actualités'}
          className="absolute top-1/2 right-2 grid size-9 -translate-y-1/2 place-items-center rounded-md sm:right-4 text-urgent-100 transition-colors hover:bg-white/15 hover:text-white"
        >
          <X size={16} weight="bold" />
        </button>
      </div>
    </aside>
  )
}

const CTA_CLASS =
  'hidden h-9 shrink-0 items-center rounded-md bg-white px-4 text-[13px] font-semibold text-urgent-700 transition-colors hover:bg-urgent-50 sm:inline-flex'

function Slide({ isActive, children }: { isActive: boolean; children: ReactNode }) {
  return (
    <div
      inert={!isActive}
      data-active={isActive}
      className="col-start-1 row-start-1 flex translate-y-2 items-center gap-3 opacity-0 transition-[opacity,translate] duration-500 ease-smooth data-[active=true]:translate-y-0 data-[active=true]:opacity-100 motion-reduce:translate-y-0 sm:gap-4"
    >
      {children}
    </div>
  )
}

function SlideIcon({ children }: { children: ReactNode }) {
  return (
    <span className="hidden size-10 shrink-0 place-items-center rounded-md bg-white/15 sm:grid">
      {children}
    </span>
  )
}
