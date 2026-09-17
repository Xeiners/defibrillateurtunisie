import { useCallback, useEffect, useState } from 'react'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

/** Délai avant de précharger la deuxième image, une fois la première demandée. */
const FIRST_PRELOAD_MS = 2500

/**
 * État d'un carrousel d'images qui avance seul.
 *
 * AVANCE AUTOMATIQUE, suspendue tant que le curseur ou le focus est dessus
 * (`hold` / `release`), et absente sous « mouvement réduit ». Un choix manuel
 * relance la minuterie : sans cela, une image choisie juste avant la fin du
 * cycle en cours passerait aussitôt à la suivante.
 *
 * CHARGEMENT PROGRESSIF. Les images sont lourdes : seules celles marquées dans
 * `mounted` existent dans le DOM. La première au départ, la deuxième peu après,
 * puis toujours l'image affichée et celle qui la suit. Une image n'est donc
 * téléchargée que lorsqu'elle est sur le point d'être montrée — y compris en
 * reculant depuis la première, qui fait apparaître la dernière.
 */
export function useAutoCarousel(count: number, intervalMs = 5000) {
  const prefersReducedMotion = usePrefersReducedMotion()

  const [index, setIndex] = useState(0)
  const [isHeld, setIsHeld] = useState(false)
  // Incrémenté à chaque choix manuel : il ne décrit aucun état visible, il sert
  // à relancer la minuterie.
  const [cycle, setCycle] = useState(0)
  const [mounted, setMounted] = useState<boolean[]>(() =>
    Array.from({ length: count }, (_, position) => position === 0),
  )

  const isPlaying = !prefersReducedMotion && !isHeld && count > 1

  useEffect(() => {
    if (!isPlaying) return

    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % count)
    }, intervalMs)

    return () => window.clearInterval(id)
  }, [isPlaying, count, intervalMs, cycle])

  const mount = useCallback((...positions: number[]) => {
    setMounted((current) => {
      if (positions.every((position) => current[position])) return current
      const next = [...current]
      for (const position of positions) next[position] = true
      return next
    })
  }, [])

  // Deuxième image : une fois la première demandée, pas en même temps.
  useEffect(() => {
    if (count < 2) return
    const id = window.setTimeout(() => mount(1), FIRST_PRELOAD_MS)
    return () => window.clearTimeout(id)
  }, [count, mount])

  // Ensuite : l'image affichée et la suivante. La garde du tout premier rendu
  // est ce qui laisse à la première image la bande passante pour elle seule.
  useEffect(() => {
    if (index === 0 && cycle === 0) return
    mount(index, (index + 1) % count)
  }, [index, cycle, count, mount])

  const goTo = useCallback(
    (position: number) => {
      setIndex(((position % count) + count) % count)
      setCycle((current) => current + 1)
    },
    [count],
  )

  const showNext = useCallback(() => {
    setIndex((current) => (current + 1) % count)
    setCycle((current) => current + 1)
  }, [count])

  const showPrevious = useCallback(() => {
    setIndex((current) => (current - 1 + count) % count)
    setCycle((current) => current + 1)
  }, [count])

  const hold = useCallback(() => setIsHeld(true), [])
  const release = useCallback(() => setIsHeld(false), [])

  return { index, mounted, goTo, showNext, showPrevious, hold, release }
}
