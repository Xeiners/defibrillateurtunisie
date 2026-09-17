import { Check, Plus } from '@phosphor-icons/react'
import type { FeaturedProduct } from '@/data/products'
import { useCart } from '@/store/cart-context'

type ProductCardProps = {
  product: FeaturedProduct
  /**
   * Copie servant uniquement à boucler la piste : retirée du parcours clavier
   * et de l'arbre d'accessibilité pour ne pas annoncer deux fois le catalogue.
   * Elle reste cliquable à la souris, ce que le visiteur attend puisqu'elle est
   * visuellement identique à l'originale.
   */
  isClone?: boolean
}

export const CARD_WIDTH = 'w-[206px] sm:w-[244px] lg:w-[280px]'

/**
 * Carte produit sélectionnable.
 *
 * C'est un `<button>` et non un lien : l'action est d'ajouter à la sélection,
 * pas de naviguer. Son contenu n'utilise que des `<span>` et des `<img>`, le
 * modèle de contenu d'un bouton n'admettant pas d'éléments de flux.
 *
 * L'image est en tête et le libellé en pied : la lecture d'un catalogue passe
 * par le visuel, le nom ne fait que confirmer.
 */
export function ProductCard({ product, isClone = false }: ProductCardProps) {
  const { has, toggle } = useCart()
  const isSelected = has(product.id)
  const label = product.titleLines.join(' ')

  return (
    <button
      type="button"
      data-card="root"
      data-selected={isSelected}
      onClick={() => toggle(product.id)}
      aria-pressed={isSelected}
      aria-hidden={isClone || undefined}
      tabIndex={isClone ? -1 : undefined}
      aria-label={
        isSelected
          ? `Retirer ${label} de ma sélection`
          : `Ajouter ${label} à ma sélection`
      }
      className={`block shrink-0 rounded-[var(--radius-panel)] text-left ${CARD_WIDTH}`}
    >
      <span
        data-card="inner"
        className="block h-full rounded-[var(--radius-panel)] border border-[var(--border-subtle)] bg-[var(--surface-raised)] p-3 will-change-transform"
      >
        <span className="block overflow-hidden rounded-[var(--radius-media)] bg-[var(--surface-sunken)]">
          <img
            data-card="media"
            src={product.image.src}
            alt=""
            width={800}
            height={800}
            // Pas de `loading="lazy"` : la piste défile, une vignette différée
            // apparaîtrait par à-coups en cours de course.
            fetchPriority="low"
            decoding="async"
            className="aspect-square w-full object-cover will-change-transform"
          />
        </span>

        <span className="flex items-start justify-between gap-3 px-1 pt-4 pb-1">
          <span className="text-[14px] leading-snug font-medium tracking-[-0.01em] text-[var(--text-primary)]">
            {product.titleLines[0]}
            <br />
            {product.titleLines[1]}
          </span>

          <span
            data-card="action"
            aria-hidden="true"
            className="grid size-7 shrink-0 place-items-center rounded-[var(--radius-field)] border transition-colors duration-300 will-change-transform"
            style={
              isSelected
                ? {
                    background: 'var(--accent)',
                    borderColor: 'var(--accent)',
                    color: 'var(--text-on-accent)',
                  }
                : {
                    background: 'transparent',
                    borderColor: 'var(--border-subtle)',
                    color: 'var(--accent-ink)',
                  }
            }
          >
            {isSelected ? <Check size={14} /> : <Plus size={14} />}
          </span>
        </span>
      </span>
    </button>
  )
}
