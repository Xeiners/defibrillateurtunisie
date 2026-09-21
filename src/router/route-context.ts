import { createContext, useContext } from 'react'

/** Les seules adresses du site. Tout le reste retombe sur l'accueil. */
export const ROUTES = {
  home: '/',
  quote: '/devis',
} as const

export type RouteValue = {
  /** Chemin courant, sans ancre ni paramètres. */
  path: string
  /** Ancre courante, `#compris` par exemple, ou chaîne vide. */
  hash: string
  navigate: (to: string, options?: { replace?: boolean }) => void
}

export const RouteContext = createContext<RouteValue | null>(null)

export function useRoute() {
  const context = useContext(RouteContext)
  if (!context) {
    throw new Error('useRoute doit être utilisé dans un <RouterProvider>.')
  }
  return context
}
