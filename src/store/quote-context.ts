import { createContext, useContext } from 'react'

export type QuoteContextValue = {
  isOpen: boolean
  open: () => void
  close: () => void
}

export const QuoteContext = createContext<QuoteContextValue | null>(null)

/** Renvoie `null` hors fournisseur : un bouton isolé reste un simple lien. */
export function useQuote() {
  return useContext(QuoteContext)
}
