import { createContext, useContext } from 'react'

export type CartContextValue = {
  /** Identifiants produit sélectionnés, dans l'ordre d'ajout. */
  items: string[]
  count: number
  isOpen: boolean
  has: (productId: string) => boolean
  toggle: (productId: string) => void
  remove: (productId: string) => void
  clear: () => void
  open: () => void
  close: () => void
}

export const CartContext = createContext<CartContextValue | null>(null)

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart doit être utilisé dans un <CartProvider>.')
  }
  return context
}
