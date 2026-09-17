import { useEffect, type RefObject } from 'react'
import { gsap } from './gsap'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

/**
 * Apparition en cascade des blocs marqués `[data-reveal]` à l'entrée dans le
 * champ de vision.
 *
 * `once: true` : la section se révèle une fois et ne rejoue pas au retour, un
 * contenu qui clignote à chaque passage de scroll est agaçant à la lecture.
 *
 * Rôle : hiérarchie. La cascade suit l'ordre de lecture, elle n'est pas là
 * pour faire joli.
 */
export function useSectionReveal(scope: RefObject<HTMLElement | null>) {
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const root = scope.current
    if (!root || prefersReducedMotion) return

    const context = gsap.context(() => {
      gsap.from('[data-reveal]', {
        y: 30,
        opacity: 0,
        duration: 0.9,
        stagger: 0.08,
        ease: 'expo.out',
        scrollTrigger: { trigger: root, start: 'top 78%', once: true },
      })
    }, root)

    return () => context.revert()
  }, [scope, prefersReducedMotion])
}
