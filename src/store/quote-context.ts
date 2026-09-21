import { createContext, useContext } from 'react'

export type QuoteLine = {
  packId: string
  /** Durée d'engagement retenue, en mois : elle vient de la carte cliquée. */
  months: number
  /** Nombre d'appareils pour ce pack. */
  quantity: number
}

export type QuoteContextValue = {
  lines: QuoteLine[]
  /** Nombre de packs distincts dans la demande. */
  count: number
  /** Nombre total d'appareils demandés. */
  deviceCount: number
  /** Loyer mensuel cumulé de la sélection, en dinars. */
  monthlyTotal: number
  has: (packId: string) => boolean
  /** Ajoute le pack, ou remplace sa durée s'il y est déjà. */
  add: (packId: string, months: number) => void
  remove: (packId: string) => void
  setMonths: (packId: string, months: number) => void
  setQuantity: (packId: string, quantity: number) => void
  clear: () => void
}

export const QuoteContext = createContext<QuoteContextValue | null>(null)

export function useQuote() {
  const context = useContext(QuoteContext)
  if (!context) {
    throw new Error('useQuote doit être utilisé dans un <QuoteProvider>.')
  }
  return context
}
