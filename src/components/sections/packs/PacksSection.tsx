import { useCallback, useEffect, useRef, useState } from 'react'
import { CaretLeft, CaretRight } from '@phosphor-icons/react'
import { usePrefersReducedMotion } from '@/animations/usePrefersReducedMotion'
import { useSectionReveal } from '@/animations/useSectionReveal'
import { pricingPlans } from '@/data/pricing'
import { PACK_CARD_WIDTH, PackCard } from './PackCard'
import { PackGallery } from './PackGallery'

/** Écart entre deux cartes, en pixels. Doit rester égal à `gap-5`. */
const CARD_GAP = 20

/**
 * Fondu des bords, côté par côté.
 *
 * Un bord ne s'estompe que s'il reste des cartes à découvrir de ce côté : le
 * fondu signale qu'il y a une suite. Au repos, la première carte est donc
 * nette, et la dernière l'est aussi une fois la bande parcourue.
 */
function edgeFade(fadeStart: boolean, fadeEnd: boolean) {
  if (!fadeStart && !fadeEnd) return undefined

  const start = fadeStart ? 'transparent 0, black 6%' : 'black 0'
  const end = fadeEnd ? 'black 94%, transparent 100%' : 'black 100%'
  return `linear-gradient(to right, ${start}, ${end})`
}

/**
 * Flèche de navigation des cartes.
 *
 * `top` est décalé de 10px au-dessus du milieu : le cadre réserve 12px en haut
 * et 32px en bas pour l'ombre des cartes, si bien que son milieu tombe plus bas
 * que celui des cartes. Sans ce décalage, les flèches paraîtraient descendues.
 *
 * Une flèche qui n'a plus rien à montrer DISPARAÎT au lieu de rester grisée :
 * posée par-dessus la première ou la dernière carte, une flèche éteinte ne
 * ferait que la masquer.
 */
const ARROW_CLASS =
  'absolute top-[calc(50%-10px)] z-10 grid size-10 -translate-y-1/2 cursor-pointer place-items-center rounded-full border border-[var(--border-subtle)] bg-[var(--surface-raised)] text-[var(--text-primary)] shadow-[var(--shadow-panel)] transition-[border-color,color,opacity,scale] duration-300 hover:border-[var(--accent-ink)] hover:text-[var(--accent-ink)] active:scale-95 disabled:pointer-events-none disabled:opacity-0'

/**
 * Formules et photos, sous la bande des marques.
 *
 * DEUX COLONNES. À gauche, huit colonnes sur douze : les formules. À droite,
 * quatre : un carrousel de photos. Les deux se partagent la même hauteur,
 * fixée par les cartes. Sous `lg`, les photos passent sous les cartes.
 *
 * SANS TITRE. La section prolonge le haut de page au lieu d'ouvrir un nouveau
 * chapitre : pas d'intitulé et le même fond blanc que le hero.
 *
 * BANDE FIXE. Les cartes ne défilent plus seules : c'est le visiteur qui
 * avance. La bande est un défilement horizontal natif avec accrochage carte
 * par carte, et les flèches ne font que le piloter. Tout ce qu'on attend d'un
 * défilement marche donc sans être réécrit : le glisser au doigt ou au
 * trackpad, la roulette, et le recentrage automatique quand une carte reçoit
 * le focus au clavier.
 *
 * ÉTAT LU SUR LA BANDE. Les flèches et les fondus dépendent de la position de
 * défilement, LUE sur le cadre plutôt que comptée dans une variable : le
 * visiteur peut faire défiler sans passer par les flèches, un compteur interne
 * se désynchroniserait aussitôt.
 */
export function PacksSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  const [canScrollBack, setCanScrollBack] = useState(false)
  const [canScrollOn, setCanScrollOn] = useState(false)

  useSectionReveal(sectionRef)

  const syncEdges = useCallback(() => {
    const viewport = viewportRef.current
    if (!viewport) return

    // Marge d'un pixel : les navigateurs arrondissent `scrollLeft`, et une
    // comparaison stricte laisserait une flèche visible en butée.
    const maxScroll = viewport.scrollWidth - viewport.clientWidth
    setCanScrollBack(viewport.scrollLeft > 1)
    setCanScrollOn(viewport.scrollLeft < maxScroll - 1)
  }, [])

  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return

    syncEdges()

    // `ResizeObserver` et non `window.resize` : la bande change aussi de
    // largeur aux points de bascule de la grille, sans que la fenêtre soit
    // forcément redimensionnée d'autant.
    const observer = new ResizeObserver(syncEdges)
    observer.observe(viewport)
    viewport.addEventListener('scroll', syncEdges, { passive: true })

    return () => {
      observer.disconnect()
      viewport.removeEventListener('scroll', syncEdges)
    }
  }, [syncEdges])

  /** -1 : cartes situées à gauche ; 1 : cartes situées à droite. */
  const showCardsOn = (side: -1 | 1) => {
    const viewport = viewportRef.current
    if (!viewport) return

    // Mesuré sur une carte réelle : la course suit la largeur de carte à
    // chaque point de bascule, sans valeur écrite en dur. L'accrochage
    // rattrape ensuite tout écart d'arrondi.
    const card = viewport.querySelector<HTMLElement>('[data-pack-card]')
    const step = (card ? card.offsetWidth : 264) + CARD_GAP

    viewport.scrollBy({
      left: side * step,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    })
  }

  const fade = edgeFade(canScrollBack, canScrollOn)

  return (
    <section
      id="packs"
      ref={sectionRef}
      aria-label="Formules de location"
      className="bg-[var(--surface)] pb-12 sm:pb-14"
    >
      <div className="mx-auto grid max-w-[1560px] grid-cols-1 gap-x-8 px-5 sm:px-8 lg:grid-cols-12">
        {/* `min-w-0` est indispensable : la rangée de cartes est bien plus
            large que la colonne. Sans lui, la colonne de grille s'élargirait
            à la largeur de la rangée et repousserait les photos hors de la
            page. */}
        <div className="relative min-w-0 lg:col-span-8">
          {/* Réserve verticale : au survol la carte se soulève et projette une
              ombre, que le cadre de défilement rognerait sans elle. */}
          <div
            data-reveal
            ref={viewportRef}
            className="flex snap-x snap-mandatory gap-5 overflow-x-auto pt-3 pb-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            style={fade ? { maskImage: fade, WebkitMaskImage: fade } : undefined}
          >
            {pricingPlans.map((plan) => (
              <div
                key={plan.id}
                data-pack-card
                className={`shrink-0 snap-start ${PACK_CARD_WIDTH}`}
              >
                <PackCard plan={plan} />
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => showCardsOn(-1)}
            disabled={!canScrollBack}
            aria-label="Voir les formules à gauche"
            className={`${ARROW_CLASS} left-2`}
          >
            <CaretLeft size={16} weight="bold" />
          </button>
          <button
            type="button"
            onClick={() => showCardsOn(1)}
            disabled={!canScrollOn}
            aria-label="Voir les formules à droite"
            className={`${ARROW_CLASS} right-2`}
          >
            <CaretRight size={16} weight="bold" />
          </button>
        </div>

        {/* Mêmes réserves haute et basse que la bande de cartes : le cadre
            photo s'aligne ainsi sur le haut et le bas des cartes, et non sur
            leur zone d'ombre. */}
        <div data-reveal className="pb-2 lg:col-span-4 lg:pt-3 lg:pb-8">
          <PackGallery />
        </div>
      </div>
    </section>
  )
}
