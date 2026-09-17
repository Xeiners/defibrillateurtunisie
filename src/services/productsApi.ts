import { featuredProducts, type FeaturedProduct } from '@/data/products'

export type { FeaturedProduct }

/**
 * Latence simulée. Elle n'est pas cosmétique : sans elle, l'état de chargement
 * ne s'afficherait jamais en développement et on ne verrait pas qu'il est
 * cassé le jour où une vraie API répondra lentement.
 */
const MOCK_LATENCY_MS = 450

/**
 * Les produits déjà reçus, indexés par identifiant.
 *
 * Le panier ne stocke que des identifiants : il lui faut un moyen de retrouver
 * un produit sans dépendre du catalogue statique. Ce cache est alimenté par
 * chaque réponse, donc il fonctionnera à l'identique une fois l'API branchée.
 */
const cache = new Map<string, FeaturedProduct>()

function remember(products: FeaturedProduct[]) {
  for (const product of products) cache.set(product.id, product)
  return products
}

function wait(ms: number, signal?: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    if (signal?.aborted) {
      reject(signal.reason)
      return
    }
    const timer = setTimeout(resolve, ms)
    signal?.addEventListener(
      'abort',
      () => {
        clearTimeout(timer)
        reject(signal.reason)
      },
      { once: true },
    )
  })
}

/**
 * Catalogue mis en avant dans le hero.
 *
 * ===== BRANCHEMENT DE L'API =====
 * Remplacer le corps de la fonction par :
 *
 *   const response = await fetch(`${import.meta.env.VITE_API_URL}/products/featured`, { signal })
 *   if (!response.ok) throw new Error(`Catalogue indisponible (${response.status})`)
 *   return remember(await response.json())
 *
 * Aucun composant n'est à toucher : ils ne connaissent que cette fonction et
 * le type `FeaturedProduct`. Penser à valider la forme de la réponse, le type
 * TypeScript ne protège de rien à l'exécution.
 */
export async function fetchFeaturedProducts(
  signal?: AbortSignal,
): Promise<FeaturedProduct[]> {
  await wait(MOCK_LATENCY_MS, signal)
  return remember(featuredProducts)
}

/** Retrouve un produit déjà reçu. Utilisé par le panier. */
export function getCachedProduct(id: string) {
  return cache.get(id)
}
