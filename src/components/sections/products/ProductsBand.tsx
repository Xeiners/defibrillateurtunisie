import { useEffect, useRef, useState } from 'react'
import { WarningCircle } from '@phosphor-icons/react'
import { useMarquee } from '@/animations/useMarquee'
import { useProductShelf } from '@/animations/useProductShelf'
import { usePrefersReducedMotion } from '@/animations/usePrefersReducedMotion'
import { useSectionReveal } from '@/animations/useSectionReveal'
import { useFeaturedProducts } from '@/services/useFeaturedProducts'
import { CARD_WIDTH, ProductCard } from './ProductCard'

/** Fondu des deux bords : la piste n'a ni début ni fin visible. */
const EDGE_FADE =
  'linear-gradient(to right, transparent 0, black 6%, black 94%, transparent 100%)'

/** Squelette de chargement : même gabarit que la carte réelle, donc pas de saut. */
function ProductCardSkeleton() {
  return (
    <div aria-hidden="true" className={`shrink-0 ${CARD_WIDTH}`}>
      <div className="h-full animate-pulse rounded-[var(--radius-panel)] border border-[var(--border-subtle)] bg-[var(--surface-raised)] p-3">
        <span className="block aspect-square w-full rounded-[var(--radius-media)] bg-[var(--surface-sunken)]" />
        <span className="mt-4 mb-1 flex flex-col gap-2 px-1">
          <span className="block h-3 w-4/5 rounded-full bg-[var(--surface-sunken)]" />
          <span className="block h-3 w-3/5 rounded-full bg-[var(--surface-sunken)]" />
        </span>
      </div>
    </div>
  )
}

/**
 * Bande catalogue.
 *
 * Elle occupait auparavant l'angle du hero, où elle disputait l'attention au
 * message. Devenue une bande pleine largeur juste en dessous, elle gagne en
 * présence et le hero gagne en calme.
 */
export function ProductsBand() {
  const sectionRef = useRef<HTMLElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = usePrefersReducedMotion()
  const { status, products } = useFeaturedProducts()

  /**
   * Nombre de copies du catalogue sur la piste.
   *
   * La boucle parcourt -50% de la largeur de piste : celle-ci doit donc être
   * faite de DEUX moitiés identiques, et chaque moitié doit à elle seule
   * couvrir le cadre. Avec quatre produits (1168px) dans un cadre de 1440px,
   * deux copies laissaient un vide au moment où la boucle se referme. Le
   * nombre se calcule donc au lieu d'être fixé.
   */
  const [copies, setCopies] = useState(2)

  useSectionReveal(sectionRef)
  useMarquee(viewportRef, trackRef, { itemCount: products.length * copies })
  useProductShelf(viewportRef, products.length * copies)

  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport || products.length === 0) return

    if (prefersReducedMotion) {
      // Sans boucle animée, la duplication n'a plus de raison d'être : elle
      // deviendrait un doublon de contenu dans une simple liste défilante.
      setCopies(1)
      return
    }

    const update = () => {
      const card = viewport.querySelector('[data-card="root"]')
      const cardWidth = card ? card.getBoundingClientRect().width + 16 : 296
      const groupWidth = products.length * cardWidth
      const halves = Math.max(1, Math.ceil(viewport.clientWidth / groupWidth))
      setCopies(halves * 2)
    }

    update()
    const observer = new ResizeObserver(update)
    observer.observe(viewport)
    return () => observer.disconnect()
  }, [products.length, prefersReducedMotion])

  return (
    <section
      id="appareils"
      ref={sectionRef}
      className="overflow-hidden bg-[var(--surface)] py-20 sm:py-28"
    >
      <div className="mx-auto max-w-[1560px] px-5 sm:px-8">
        <header data-reveal className="border-b border-[var(--border-subtle)] pb-8">
          <p className="label-tech text-[var(--text-muted)]">Catalogue</p>
          <h2 className="mt-5 max-w-[16ch] text-[clamp(2rem,4.4vw,3.5rem)] leading-[1] font-semibold tracking-[-0.04em] text-[var(--text-primary)]">
            Le matériel, en location
          </h2>
          <p className="mt-5 max-w-[52ch] text-[15px] leading-relaxed text-[var(--text-secondary)]">
            Touchez une carte pour l’ajouter à votre demande. Nous préparons le
            devis à partir de votre sélection.
          </p>
        </header>
      </div>

      <div data-reveal className="mt-12 sm:mt-14">
        {status === 'error' ? (
          <div className="mx-auto max-w-[1560px] px-5 sm:px-8">
            <p
              role="status"
              className="inline-flex items-center gap-2.5 rounded-[var(--radius-panel)] border border-[var(--border-subtle)] px-5 py-4 text-[14px] text-[var(--text-primary)]"
            >
              <WarningCircle
                size={16}
                aria-hidden="true"
                className="text-[var(--accent-ink)]"
              />
              Catalogue momentanément indisponible.
            </p>
          </div>
        ) : (
          <div
            ref={viewportRef}
            /* La réserve verticale n'est pas de l'espacement : la carte
               survolée se soulève et projette une ombre, or ce cadre est en
               `overflow-hidden`. Sans elle, le survol se ferait rogner. */
            className={
              prefersReducedMotion
                ? 'overflow-x-auto px-5 py-4 sm:px-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
                : 'overflow-hidden py-4'
            }
            style={{ maskImage: EDGE_FADE, WebkitMaskImage: EDGE_FADE }}
          >
            <div ref={trackRef} className="flex w-max gap-4">
              {status === 'loading'
                ? Array.from({ length: 6 }, (_, index) => (
                    <ProductCardSkeleton key={index} />
                  ))
                : Array.from({ length: copies }, (_, copy) =>
                    products.map((product) => (
                      <ProductCard
                        key={`${copy}-${product.id}`}
                        product={product}
                        isClone={copy > 0}
                      />
                    )),
                  )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
