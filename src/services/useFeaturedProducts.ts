import { useEffect, useState } from 'react'
import { fetchFeaturedProducts, type FeaturedProduct } from './productsApi'

export type ProductsState =
  | { status: 'loading'; products: FeaturedProduct[] }
  | { status: 'ready'; products: FeaturedProduct[] }
  | { status: 'error'; products: FeaturedProduct[]; message: string }

/**
 * Charge le catalogue mis en avant.
 *
 * L'`AbortController` sert deux causes : il annule la requête si le composant
 * disparaît, et il neutralise le double montage de StrictMode en
 * développement, qui déclencherait sinon deux appels et deux mises à jour
 * d'état concurrentes.
 */
export function useFeaturedProducts(): ProductsState {
  const [state, setState] = useState<ProductsState>({
    status: 'loading',
    products: [],
  })

  useEffect(() => {
    const controller = new AbortController()

    fetchFeaturedProducts(controller.signal)
      .then((products) => {
        if (controller.signal.aborted) return
        setState({ status: 'ready', products })
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return
        setState({
          status: 'error',
          products: [],
          message:
            error instanceof Error
              ? error.message
              : 'Catalogue momentanément indisponible.',
        })
      })

    return () => controller.abort()
  }, [])

  return state
}
