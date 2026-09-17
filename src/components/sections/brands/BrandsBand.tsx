import { useRef } from 'react'
import { useMarquee } from '@/animations/useMarquee'
import { useMarqueeCopies } from '@/animations/useMarqueeCopies'
import { usePrefersReducedMotion } from '@/animations/usePrefersReducedMotion'
import { brands } from '@/data/brands'
import { cn } from '@/lib/cn'

/** Fondu des deux bords, plus large que celui des cartes : les logos sont petits. */
const EDGE_FADE =
  'linear-gradient(to right, transparent 0, black 12%, black 88%, transparent 100%)'

/**
 * Bande de logos, entre le hero et les formules.
 *
 * DISCRÈTE PAR CONSTRUCTION. Pas de titre, logos en gris à 70%, qui ne
 * reprennent leurs couleurs qu'au survol. Elle s'intercale entre deux blocs
 * déjà denses : elle doit se lire comme une respiration, pas comme une section
 * de plus.
 *
 * SENS INVERSE DES CARTES, ET PLUS LENTE. Deux bandes voisines qui défilent
 * dans le même sens à des vitesses différentes donnent une impression de
 * glissement mal réglé ; en sens contraires, le mouvement se lit comme voulu.
 *
 * CASES DE LARGEUR FIXE. Chaque logo est centré dans une case identique, quelle
 * que soit sa proportion. La bande garde un rythme régulier avec des logos
 * hétérogènes, et le calcul de la boucle reste exact : pas d'écart entre les
 * cases, donc pas de demi-écart qui ferait sauter la boucle.
 *
 * Sous « mouvement réduit », les logos ne défilent plus : ils se rangent sur
 * une ou plusieurs lignes centrées.
 */
export function BrandsBand() {
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLUListElement>(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  const copies = useMarqueeCopies(viewportRef, {
    itemCount: brands.length,
    gap: 0,
    itemSelector: '[data-brand-cell]',
  })

  useMarquee(viewportRef, trackRef, {
    direction: 'left',
    speed: 28,
    itemCount: brands.length * copies,
  })

  return (
    <section aria-label="Marques" className="bg-[var(--surface)] py-8">
      <div
        ref={viewportRef}
        className={prefersReducedMotion ? undefined : 'overflow-hidden'}
        style={
          prefersReducedMotion
            ? undefined
            : { maskImage: EDGE_FADE, WebkitMaskImage: EDGE_FADE }
        }
      >
        <ul
          ref={trackRef}
          className={cn(
            'flex list-none',
            prefersReducedMotion
              ? 'flex-wrap justify-center px-5 sm:px-8'
              : 'w-max',
          )}
        >
          {Array.from({ length: copies }, (_, copy) =>
            brands.map((brand) => (
              <li
                key={`${copy}-${brand.id}`}
                data-brand-cell
                // Les copies ne servent qu'à l'illusion de boucle : `inert`
                // les retire du clavier et des lecteurs d'écran.
                inert={copy > 0}
                className="grid h-14 w-44 shrink-0 place-items-center px-6 sm:w-48 lg:w-56"
              >
                {/* Les vrais logos n'ont pas tous la même proportion : un mot
                    très large (Nihon Kohden) et un sigle compact (Mindray)
                    se côtoient. La hauteur est commune et la largeur plafonnée
                    par la case, `object-contain` gardant les proportions quand
                    le plafond s'applique. Les dimensions d'origine, passées en
                    attributs, réservent la bonne place avant le chargement. */}
                <img
                  src={brand.logo}
                  alt={brand.name}
                  width={brand.width}
                  height={brand.height}
                  decoding="async"
                  className="h-6 w-auto max-w-full object-contain opacity-70 grayscale transition-[opacity,filter] duration-300 hover:opacity-100 hover:grayscale-0"
                />
              </li>
            )),
          )}
        </ul>
      </div>
    </section>
  )
}
