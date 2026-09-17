import { useEffect, type RefObject } from 'react'
import { gsap } from './gsap'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

/**
 * Fait glisser une piste horizontalement pendant que sa section traverse
 * l'écran, sur grand écran uniquement.
 *
 * SANS ÉPINGLAGE : la page continue de défiler normalement, donc la section
 * garde la hauteur de son contenu. La course vaut exactement ce qui dépasse du
 * cadre, si bien que le dernier panneau arrive pile quand la section sort.
 *
 * `progress`, s'il est fourni, est une barre mise à l'échelle de 0 à 1 pendant
 * la course : elle dit où l'on en est dans la série.
 *
 * Sous `lg`, ou sous « mouvement réduit », rien n'est posé : la piste reste un
 * conteneur défilant au doigt (`overflow-x-auto` côté balisage).
 */
export function useHorizontalScroll(
  section: RefObject<HTMLElement | null>,
  track: RefObject<HTMLElement | null>,
  progress?: RefObject<HTMLElement | null>,
) {
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (prefersReducedMotion) return

    const media = gsap.matchMedia()

    media.add('(min-width: 1024px)', () => {
      const sectionEl = section.current
      const trackEl = track.current
      if (!sectionEl || !trackEl) return

      const distance = () =>
        Math.max(0, trackEl.scrollWidth - (trackEl.parentElement?.clientWidth ?? 0))

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionEl,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      })

      timeline.fromTo(trackEl, { x: 0 }, { x: () => -distance(), ease: 'none' }, 0)

      if (progress?.current) {
        timeline.fromTo(progress.current, { scaleX: 0 }, { scaleX: 1, ease: 'none' }, 0)
      }
    })

    return () => media.revert()
  }, [section, track, progress, prefersReducedMotion])
}
