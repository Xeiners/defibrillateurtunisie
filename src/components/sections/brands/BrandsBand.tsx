import { useRef } from 'react'
import { useMarquee } from '@/animations/useMarquee'
import { useMarqueeCopies } from '@/animations/useMarqueeCopies'
import { usePrefersReducedMotion } from '@/animations/usePrefersReducedMotion'
import { brands } from '@/data/brands'
import { cn } from '@/lib/cn'

const EDGE_FADE =
  'linear-gradient(to right, transparent 0, black 15%, black 85%, transparent 100%)'

/**
 * « Ils nous font confiance » : un titre centré entre deux filets, puis les
 * logos CLIENTS qui défilent dessous, sur toute la largeur.
 *
 * Cases de largeur fixe, sans écart : la boucle de `useMarquee` reste exacte
 * quelle que soit la proportion des logos. Sous « mouvement réduit », les
 * logos se rangent sur une ligne centrée.
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
    speed: 32,
    itemCount: brands.length * copies,
  })

  return (
    <section aria-labelledby="confiance-titre" className="bg-white pt-14 pb-8 sm:pt-16">
      <div className="mx-auto flex max-w-3xl items-center gap-4 px-4 sm:px-6">
        <span aria-hidden="true" className="h-px flex-1 bg-linear-to-r from-transparent to-navy-200" />
        <h2
          id="confiance-titre"
          data-anim="pop"
          className="text-center text-[15px] font-semibold text-navy-700 sm:text-[16px]"
        >
          Ils nous font <span className="text-urgent-600">confiance</span>
        </h2>
        <span aria-hidden="true" className="h-px flex-1 bg-linear-to-l from-transparent to-navy-200" />
      </div>

      <div
        ref={viewportRef}
        className={cn('mt-6', !prefersReducedMotion && 'overflow-hidden')}
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
            prefersReducedMotion ? 'flex-wrap justify-center px-4' : 'w-max',
          )}
        >
          {Array.from({ length: copies }, (_, copy) =>
            brands.map((brand) => (
              <li
                key={`${copy}-${brand.id}`}
                data-brand-cell
                inert={copy > 0}
                className="grid h-20 w-36 shrink-0 place-items-center px-4 sm:w-44"
              >
                {/* Les fichiers sont détourés de leurs marges : chaque logo
                    remplit donc la case, quelle que soit sa proportion. */}
                <img
                  src={brand.logo}
                  alt={brand.name}
                  decoding="async"
                  className="max-h-14 w-auto max-w-full object-contain opacity-75 grayscale transition-[opacity,filter] duration-300 hover:opacity-100 hover:grayscale-0"
                />
              </li>
            )),
          )}
        </ul>
      </div>
    </section>
  )
}
