import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { CartContext, type CartContextValue } from './cart-context'

/**
 * Sélection de produits en vue d'un devis.
 *
 * Pas de quantité ni de prix : à ce stade le visiteur compose une demande, il
 * n'achète pas. Le panier ne stocke donc que des identifiants, et le rendu
 * résout les produits depuis `@/data/products`. Une seule source de vérité.
 */
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<string[]>([])
  const [isOpen, setIsOpen] = useState(false)

  const has = useCallback(
    (productId: string) => items.includes(productId),
    [items],
  )

  const toggle = useCallback((productId: string) => {
    setItems((current) =>
      current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId],
    )
  }, [])

  const remove = useCallback((productId: string) => {
    setItems((current) => current.filter((id) => id !== productId))
  }, [])

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      count: items.length,
      isOpen,
      has,
      toggle,
      remove,
      clear: () => setItems([]),
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
    }),
    [items, isOpen, has, toggle, remove],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
