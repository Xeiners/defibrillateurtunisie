import { useEffect, useState, type RefObject } from 'react'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

type MarqueeCopiesOptions = {
  /** Nombre d'éléments dans UNE copie du contenu. */
  itemCount: number
  /** Écart entre deux éléments, en pixels. */
  gap: number
  /** Sélecteur d'un élément, mesuré pour connaître la largeur d'une copie. */
  itemSelector: string
}

/**
 * Nombre de copies du contenu à poser sur la piste d'une bande défilante.
 *
 * `useMarquee` fait parcourir 50% de la piste : celle-ci doit donc être faite
 * d'un nombre PAIR de copies, et chaque moitié doit couvrir à elle seule la
 * largeur du cadre. Sinon un vide apparaît au moment où la boucle se referme —
 * sur un écran large, ou quand il y a peu d'éléments. Le nombre se calcule
 * donc à partir de la largeur réelle, et se recalcule quand elle change.
 *
 * Sous « mouvement réduit », la bande ne tourne pas : une seule copie suffit,
 * les autres ne seraient qu'un doublon de contenu.
 *
 * Les éléments doivent avoir une largeur fixe : la mesure porte sur le premier
 * et vaut pour tous.
 */
export function useMarqueeCopies(
  viewport: RefObject<HTMLElement | null>,
  { itemCount, gap, itemSelector }: MarqueeCopiesOptions,
) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const [copies, setCopies] = useState(2)

  useEffect(() => {
    const viewportEl = viewport.current
    if (!viewportEl || itemCount === 0) return

    if (prefersReducedMotion) {
      setCopies(1)
      return
    }

    const update = () => {
      const item = viewportEl.querySelector(itemSelector)
      if (!item) return

      const groupWidth = itemCount * (item.getBoundingClientRect().width + gap)
      const halves = Math.max(1, Math.ceil(viewportEl.clientWidth / groupWidth))
      setCopies(halves * 2)
    }

    update()
    const observer = new ResizeObserver(update)
    observer.observe(viewportEl)
    return () => observer.disconnect()
  }, [viewport, itemCount, gap, itemSelector, prefersReducedMotion])

  return copies
}
