import { useEffect, useState } from 'react'
import { List, X } from '@phosphor-icons/react'
import { isLiveHref, primaryNav } from '@/data/navigation'
import { actions } from '@/data/site'
import { Logo } from '@/components/ui/Logo'
import { Button } from '@/components/ui/Button'
import { CartButton } from '@/components/cart/CartButton'

const MENU_ID = 'menu-principal'

/**
 * Barre de navigation, posée sur le hero clair.
 *
 * Plus de pilule de verre : un simple alignement, un filet de séparation, et
 * un soulignement qui se déploie au survol. Le geste est piloté par `scaleX`
 * et non par une largeur, donc il reste sur la couche de composition.
 *
 * En mobile, le menu occupe tout l'écran : à cette taille, un panneau replié
 * sous la barre est toujours à l'étroit. Il est clair lui aussi, et non en
 * encre : il se déploie DEPUIS cette barre, un basculement de valeur au
 * passage le ferait lire comme un autre écran plutôt que comme son extension.
 *
 * Ce composant n'est monté que dans le hero et suppose un fond clair.
 */
export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Même règle qu'au pied de page : on ne propose que ce qui existe. Deux
  // entrées de `primaryNav` (« Maintenance », « Formation ») n'ont à ce jour
  // aucune section qui les porte et ne sont donc pas rendues.
  const navItems = primaryNav.filter((item) => isLiveHref(item.href))

  useEffect(() => {
    if (!isMenuOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsMenuOpen(false)
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [isMenuOpen])

  return (
    <>
      <header
        data-hero="nav"
        className="absolute inset-x-0 top-0 z-40 will-change-transform"
      >
      <div className="mx-auto flex h-20 max-w-[1560px] items-center justify-between gap-6 px-5 sm:px-8">
        <Logo tone="light" />

        <nav aria-label="Navigation principale" className="hidden lg:block">
          <ul className="flex list-none items-center gap-9">
            {navItems.map((item) => (
              <li key={item.id}>
                <a
                  href={item.href}
                  className="group relative block py-2 text-[14px] text-[var(--text-secondary)] transition-colors duration-300 hover:text-[var(--text-primary)]"
                >
                  {item.label}
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-[var(--text-primary)] transition-transform duration-400 ease-[var(--ease-out-expo)] group-hover:scale-x-100"
                  />
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <Button href={actions.quote.href} size="sm" withArrow>
              {actions.quote.label}
            </Button>
          </div>

          <CartButton />

          <button
            type="button"
            onClick={() => setIsMenuOpen(true)}
            aria-expanded={isMenuOpen}
            aria-controls={MENU_ID}
            aria-label="Ouvrir le menu"
            className="grid size-10 place-items-center rounded-[var(--radius-field)] border border-[var(--border-strong)] text-[var(--text-primary)] transition-colors duration-300 hover:bg-[var(--surface-sunken)] lg:hidden"
          >
            <List size={17} />
          </button>
        </div>
        </div>
      </header>

      {/* Menu plein écran.
          Il est SORTI du `<header>` à dessein : GSAP y applique un `transform`
          pour l'entrée, or un ancêtre transformé devient le bloc conteneur des
          descendants en `position: fixed`. Le menu se calait alors sur la
          barre, haute de 80px, et son décalage de -100% ne le sortait plus de
          l'écran : il restait visible par-dessus le hero. */}
      <div
        id={MENU_ID}
        inert={!isMenuOpen}
        data-open={isMenuOpen}
        className="fixed inset-0 z-50 flex -translate-y-full flex-col bg-[var(--surface)] transition-transform duration-500 ease-[var(--ease-out-expo)] data-[open=true]:translate-y-0 lg:hidden"
      >
        <div className="flex h-20 items-center justify-between px-5 sm:px-8">
          <Logo tone="light" />
          <button
            type="button"
            onClick={() => setIsMenuOpen(false)}
            aria-label="Fermer le menu"
            className="grid size-10 place-items-center rounded-[var(--radius-field)] border border-[var(--border-strong)] text-[var(--text-primary)] transition-colors duration-300 hover:bg-[var(--surface-sunken)]"
          >
            <X size={17} />
          </button>
        </div>

        <nav
          aria-label="Navigation principale"
          className="flex flex-1 flex-col justify-center px-5 sm:px-8"
        >
          <ul className="flex list-none flex-col">
            {navItems.map((item) => (
              <li
                key={item.id}
                className="border-t border-[var(--border-subtle)]"
              >
                <a
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="block py-5 text-[clamp(1.75rem,9vw,2.5rem)] leading-none font-medium tracking-[-0.03em] text-[var(--text-primary)] transition-opacity duration-300 hover:opacity-60"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-10">
            <Button
              href={actions.quote.href}
              className="w-full justify-center"
              withArrow
            >
              {actions.quote.label}
            </Button>
          </div>
        </nav>
      </div>
    </>
  )
}
