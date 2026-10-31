import { useRef } from 'react'
import { useMarquee } from '@/animations/useMarquee'
import { useMarqueeCopies } from '@/animations/useMarqueeCopies'
import { usePrefersReducedMotion } from '@/animations/usePrefersReducedMotion'
import { brandGroups, type BrandGroup } from '@/data/brands'
import { cn } from '@/lib/cn'
import { useLocale } from '@/i18n/LocaleProvider'

const EDGE_FADE =
  'linear-gradient(to right, transparent 0, black 15%, black 85%, transparent 100%)'

/**
 * « Ils nous font confiance » : un titre centré entre deux filets, puis les
 * logos CLIENTS rangés en trois colonnes, une par secteur, séparées par un
 * filet. Chaque colonne défile pour son compte ; celle du milieu en sens
 * inverse, pour que les trois ne glissent pas comme un seul bandeau.
 *
 * Sur mobile, les colonnes s'empilent et le filet devient horizontal.
 */
export function BrandsBand() {
  const { locale } = useLocale()

  return (
    <section aria-labelledby="confiance-titre" className="bg-white pt-6 pb-2 sm:pt-8 overflow-x-clip">
      <div className="mx-auto flex max-w-3xl items-center gap-4 px-4 sm:px-6">
        <span aria-hidden="true" className="h-px flex-1 bg-linear-to-r from-transparent to-navy-200" />
        <h2
          id="confiance-titre"
          data-anim="pop"
          className="text-center text-[15px] font-semibold text-navy-700 sm:text-[16px]"
        >
          {locale === 'en' ? <>Trusted by leading <span className="text-urgent-600">organisations</span></> : <>Ils nous font <span className="text-urgent-600">confiance</span></>}
        </h2>
        <span aria-hidden="true" className="h-px flex-1 bg-linear-to-l from-transparent to-navy-200" />
      </div>

      <ul className="mt-3 grid list-none sm:mt-4 lg:grid-cols-3">
        {brandGroups.map((group, index) => (
          <li key={group.id} className="relative py-3 lg:py-1">
            {index > 0 && (
              <span
                aria-hidden="true"
                className="absolute inset-x-12 top-0 h-px bg-linear-to-r from-transparent via-navy-200 to-transparent lg:inset-x-auto lg:inset-y-2 lg:left-0 lg:h-auto lg:w-px lg:bg-linear-to-b"
              />
            )}
            <BrandMarquee group={group} direction={index % 2 === 1 ? 'right' : 'left'} />
          </li>
        ))}
      </ul>
    </section>
  )
}

/**
 * Une colonne : l'intitulé du secteur, puis ses logos en boucle.
 *
 * Cases de largeur fixe, sans écart : la boucle de `useMarquee` reste exacte
 * quelle que soit la proportion des logos. Sous « mouvement réduit », les
 * logos se rangent sur des lignes centrées.
 */
function BrandMarquee({ group, direction }: { group: BrandGroup; direction: 'left' | 'right' }) {
  const { t } = useLocale()
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLUListElement>(null)
  const prefersReducedMotion = usePrefersReducedMotion()
  const labelId = `confiance-${group.id}`

  const copies = useMarqueeCopies(viewportRef, {
    itemCount: group.brands.length,
    gap: 0,
    itemSelector: '[data-brand-cell]',
  })

  useMarquee(viewportRef, trackRef, {
    direction,
    speed: 26,
    itemCount: group.brands.length * copies,
  })

  return (
    <>
      <p
        id={labelId}
        className="text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-navy-400"
      >
        {t(group.label)}
      </p>

      <div
        ref={viewportRef}
        className={cn('mt-1', !prefersReducedMotion && 'overflow-hidden')}
        style={
          prefersReducedMotion
            ? undefined
            : { maskImage: EDGE_FADE, WebkitMaskImage: EDGE_FADE }
        }
      >
        <ul
          ref={trackRef}
          aria-labelledby={labelId}
          className={cn(
            'flex list-none',
            prefersReducedMotion ? 'flex-wrap justify-center px-4' : 'w-max',
          )}
        >
          {Array.from({ length: copies }, (_, copy) =>
            group.brands.map((brand) => (
              <li
                key={`${copy}-${brand.id}`}
                data-brand-cell
                inert={copy > 0}
                className="grid h-20 w-36 shrink-0 place-items-center px-4 sm:w-40"
              >
                {/* Les fichiers sont détourés de leurs marges : chaque logo
                    remplit donc la case, quelle que soit sa proportion. */}
                <img
                  src={brand.logo}
                  alt={brand.name}
                  decoding="async"
                  className="max-h-14 w-auto max-w-full object-contain transition-transform duration-300 hover:scale-105"
                />
              </li>
            )),
          )}
        </ul>
      </div>
    </>
  )
}
