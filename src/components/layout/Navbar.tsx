import { useEffect, useRef, useState } from 'react'
import { List, Phone, X } from '@phosphor-icons/react'
import { primaryNav } from '@/data/navigation'
import { actions, contact } from '@/data/site'
import { Logo } from '@/components/ui/Logo'
import { Button } from '@/components/ui/Button'
import { gsap } from '@/animations/gsap'
import { cn } from '@/lib/cn'

const MENU_ID = 'menu-principal'

/**
 * Barre de navigation collante, 64px.
 *
 * Un filet rouge court sous elle et suit la progression de lecture. L'ombre
 * n'apparaît qu'une fois la page défilée. En mobile, le menu se déplie sous la
 * barre — quatre liens n'en demandent pas plus.
 */
export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const progressRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const tween = gsap.to(progressRef.current, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: { start: 0, end: 'max', scrub: 0.3 },
    })
    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [])

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!isMenuOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsMenuOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
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

        <nav aria-label="Navigation principale" className="hidden lg:block">
          <ul className="flex list-none items-center gap-1">
            {primaryNav.map((item) => (
              <li key={item.id}>
                <a
                  href={item.href}
                  className="rounded-md px-3.5 py-2 text-[14px] font-medium text-navy-600 transition-colors duration-200 hover:bg-navy-50 hover:text-navy-950"
                >
                  {item.label}
                </a>
              </li>
            ))}
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

          <Button href={actions.quote.href} size="sm" className="hidden sm:inline-flex">
            {actions.quote.short}
          </Button>

          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-expanded={isMenuOpen}
            aria-controls={MENU_ID}
            aria-label={isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
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

      <div
        id={MENU_ID}
        inert={!isMenuOpen}
        data-open={isMenuOpen}
        className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-400 ease-out-expo data-[open=true]:grid-rows-[1fr] lg:hidden"
      >
        <div className="overflow-hidden">
          <nav aria-label="Navigation mobile" className="border-t border-navy-100 px-4 pt-3 pb-5 sm:px-6">
            <ul className="flex list-none flex-col">
              {primaryNav.map((item) => (
                <li key={item.id}>
                  <a
                    href={item.href}
                    onClick={closeMenu}
                    className="block rounded-md px-3 py-3 text-[16px] font-semibold text-navy-900 hover:bg-navy-50"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
            <Button href={actions.quote.href} onClick={closeMenu} withArrow className="mt-3 w-full">
              {actions.quote.label}
            </Button>
          </nav>
        </div>
      </div>
    </header>
  )
}
