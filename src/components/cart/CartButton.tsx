import { useEffect, useRef } from 'react'
import { ShoppingBag } from '@phosphor-icons/react'
import { animate } from 'animejs'
import { usePrefersReducedMotion } from '@/animations/usePrefersReducedMotion'
import { useCart } from '@/store/cart-context'

/**
 * Entrée du panier dans la barre.
 *
 * Le compteur pulse à chaque changement : c'est le seul retour qui confirme
 * qu'un clic sur une carte a bien été enregistré, la carte étant souvent hors
 * du champ de vision au moment du clic puisqu'elle défile.
 *
 * Écrit pour un fond clair : la barre qui l'accueille vit dans le hero.
 */
export function CartButton() {
  const { count, open } = useCart()
  const badgeRef = useRef<HTMLSpanElement>(null)
  const prefersReducedMotion = usePrefersReducedMotion()
  const previousCount = useRef(count)

  useEffect(() => {
    const badge = badgeRef.current
    const hasChanged = previousCount.current !== count
    previousCount.current = count

    if (!badge || !hasChanged || count === 0 || prefersReducedMotion) return

    animate(badge, { scale: [1, 1.4, 1], duration: 460, ease: 'outQuad' })
  }, [count, prefersReducedMotion])

  return (
    <button
      type="button"
      onClick={open}
      aria-label={
        count === 0
          ? 'Ouvrir ma sélection, aucun produit'
          : `Ouvrir ma sélection, ${count} produit${count > 1 ? 's' : ''}`
      }
      className="relative grid size-10 place-items-center rounded-[var(--radius-field)] border border-[var(--border-strong)] text-[var(--text-primary)] transition-colors duration-300 hover:bg-[var(--surface-sunken)]"
    >
      <ShoppingBag size={17} />

      {count > 0 && (
        <span
          ref={badgeRef}
          aria-hidden="true"
          className="tabular absolute -top-1.5 -right-1.5 grid min-w-5 place-items-center rounded-full px-1 text-[11px] leading-[1.5] font-semibold"
          style={{ background: 'var(--accent)', color: 'var(--text-on-accent)' }}
        >
          {count}
        </span>
      )}
    </button>
  )
}
