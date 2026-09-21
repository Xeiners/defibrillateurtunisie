import { useEffect, useRef, useState } from 'react'
import { List, Phone, Translate, X } from '@phosphor-icons/react'
import { primaryNav } from '@/data/navigation'
import { actions, contact } from '@/data/site'
import { Logo } from '@/components/ui/Logo'
import { Button } from '@/components/ui/Button'
import { gsap } from '@/animations/gsap'
import { useRoute } from '@/router/route-context'
import { cn } from '@/lib/cn'
import { useLocale } from '@/i18n/LocaleProvider'

const MENU_ID = 'menu-principal'

/**
 * Barre de navigation collante, 64px.
 *
 * Un filet rouge court sous elle et suit la progression de lecture. L'ombre
 * n'apparaît qu'une fois la page défilée. En mobile, le menu se déplie sous la
 * barre — quatre liens n'en demandent pas plus.
 */
export function Navbar() {
  const { path } = useRoute()
  const { locale, t } = useLocale()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const progressRef = useRef<HTMLSpanElement>(null)

  // Le filet est recréé à chaque changement de page : `end: 'max'` dépend de la
  // hauteur du document, qui n'est pas la même sur l'accueil et sur le devis.
  useEffect(() => {
    const tween = gsap.to(progressRef.current, {
      scaleX: 1,
      ease: 'none',
      force3D: true,
      scrollTrigger: { start: 0, end: 'max', scrub: 0.3, invalidateOnRefresh: true },
    })
    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [path])

  // Une navigation depuis le menu mobile doit le refermer derrière elle, y
  // compris quand elle vient du bouton « précédent » du navigateur.
  useEffect(() => setIsMenuOpen(false), [path])

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Le menu flotte au-dessus de la page : il se referme à l'échappement comme
  // au premier clic posé ailleurs.
  useEffect(() => {
    if (!isMenuOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsMenuOpen(false)
    }
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Element | null
      if (!target?.closest?.('header')) setIsMenuOpen(false)
    }

    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown)
    }
  }, [isMenuOpen])

  const closeMenu = () => setIsMenuOpen(false)

  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b border-navy-100 bg-white transition-shadow duration-300',
        isScrolled && 'shadow-[0_8px_24px_-18px_rgb(7_18_36/0.35)]',
      )}
    >
      <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6">
        <Logo />

        <nav aria-label={locale === 'en' ? 'Main navigation' : 'Navigation principale'} className="hidden lg:block">
          <ul className="flex list-none items-center gap-1">
            {primaryNav.map((item) => (
              <li key={item.id}>
                <a
                  href={item.href}
                  className="rounded-md px-3.5 py-2 text-[14px] font-medium text-navy-600 transition-colors duration-200 hover:bg-navy-50 hover:text-navy-950"
                >
                  {t(item.label)}
                </a>
              </li>
            ))}
            <li>
              <a
                href={actions.quote.href}
                aria-current={path === actions.quote.href ? 'page' : undefined}
                className={cn(
                  'rounded-md px-3.5 py-2 text-[14px] font-medium transition-colors duration-200 hover:bg-navy-50 hover:text-navy-950',
                  path === actions.quote.href ? 'text-urgent-600' : 'text-navy-600',
                )}
              >
                {locale === 'en' ? 'Quote' : 'Devis'}
              </a>
            </li>
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          {/* Le téléphone commercial n'apparaît que s'il est renseigné. */}
          {contact.phone !== '' && (
            <a
              href={`tel:${contact.phone.replace(/\s/g, '')}`}
              className="hidden items-center gap-2 rounded-full px-3 py-2 text-[14px] font-semibold text-navy-700 transition-colors hover:text-urgent-600 xl:inline-flex"
            >
              <Phone size={17} weight="fill" className="text-urgent-600" aria-hidden="true" />
              {contact.phone}
            </a>
          )}

          <LanguageSwitch />

          <Button href={actions.quote.href} size="sm" className="hidden sm:inline-flex">
            {t(actions.quote.short)}
          </Button>

          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-expanded={isMenuOpen}
            aria-controls={MENU_ID}
            aria-label={isMenuOpen ? (locale === 'en' ? 'Close menu' : 'Fermer le menu') : (locale === 'en' ? 'Open menu' : 'Ouvrir le menu')}
            className="grid size-9 place-items-center rounded-md border border-navy-200 bg-white text-navy-900 transition-colors hover:border-navy-900 lg:hidden"
          >
            {isMenuOpen ? <X size={18} weight="bold" /> : <List size={18} weight="bold" />}
          </button>
        </div>
      </div>

      <span
        ref={progressRef}
        aria-hidden="true"
        className="absolute inset-x-0 -bottom-px h-0.5 origin-left scale-x-0 bg-urgent-600"
      />

      {/*
        Menu mobile : DÉROULANT, posé au-dessus de la page et non dans le flux.
        Dans le flux, il grandissait la barre collante et poussait tout le
        contenu vers le bas ; une ancre visée depuis le menu était alors mesurée
        avant sa fermeture, et le visiteur atterrissait 250 px trop bas.
      */}
      <div
        id={MENU_ID}
        inert={!isMenuOpen}
        data-open={isMenuOpen}
        className="absolute inset-x-0 top-full grid grid-rows-[0fr] bg-white transition-[grid-template-rows] duration-350 ease-smooth data-[open=true]:grid-rows-[1fr] data-[open=true]:shadow-[0_20px_32px_-22px_rgb(7_18_36/0.45)] lg:hidden"
      >
        <div className="overflow-hidden">
          <nav aria-label={locale === 'en' ? 'Mobile navigation' : 'Navigation mobile'} className="border-t border-navy-100 px-4 pt-3 pb-5 sm:px-6">
            <ul className="flex list-none flex-col">
              {primaryNav.map((item) => (
                <li key={item.id}>
                  <a
                    href={item.href}
                    onClick={closeMenu}
                    className="block rounded-md px-3 py-3 text-[16px] font-semibold text-navy-900 hover:bg-navy-50"
                  >
                    {t(item.label)}
                  </a>
                </li>
              ))}
            </ul>
            <Button href={actions.quote.href} onClick={closeMenu} withArrow className="mt-3 w-full">
              {t(actions.quote.label)}
            </Button>
          </nav>
        </div>
      </div>
    </header>
  )
}

function LanguageSwitch() {
  const { locale, setLocale } = useLocale()
  const nextLocale = locale === 'fr' ? 'en' : 'fr'
  const label = locale === 'fr' ? 'Switch to English' : 'Passer en français'

  return (
    <button
      type="button"
      onClick={() => setLocale(nextLocale)}
      aria-label={label}
      title={label}
      className="inline-flex h-9 items-center gap-1.5 rounded-md border border-navy-200 bg-white px-2.5 text-[12px] font-bold text-navy-700 transition-colors hover:border-navy-400 hover:text-navy-950 active:scale-[0.98]"
    >
      <Translate size={15} weight="bold" aria-hidden="true" />
      <span aria-hidden="true">{locale === 'fr' ? 'EN' : 'FR'}</span>
    </button>
  )
}
