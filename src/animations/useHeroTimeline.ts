import { useEffect, type RefObject } from 'react'
import { gsap } from './gsap'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

/**
 * Chorégraphie d'entrée du hero.
 *
 * GSAP est propriétaire des noeuds `[data-hero="…"]` uniquement. La couche de
 * survol (anime.js) travaille sur d'autres noeuds : voir `./README.md`.
 *
 * DEUX COLONNES QUI SE CROISENT. L'armoire monte et se pose pendant que le
 * discours se dévoile ligne à ligne à sa gauche ; les formules ferment la
 * marche, après l'objet qu'elles qualifient. Le décalage n'est pas décoratif,
 * il impose l'ordre de lecture : quoi, puis combien.
 *
 * La parallaxe au scroll a disparu avec le diaporama : elle animait un décor à
 * bord perdu. La colonne de droite porte maintenant des liens, et un contenu
 * cliquable qui dérive sous le curseur se rate.
 *
 * Toutes les valeurs de départ sont en `.from()` : l'état écrit dans le JSX
 * est donc l'état FINAL. Sans JavaScript, ou sous « mouvement réduit », la
 * page reste correcte et lisible.
 */
export function useHeroTimeline(scope: RefObject<HTMLElement | null>) {
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const root = scope.current
    if (!root || prefersReducedMotion) return

    const context = gsap.context(() => {
      const timeline = gsap.timeline({ defaults: { ease: 'expo.out' } })

      timeline
        .from(
          '[data-hero="model"]',
          { opacity: 0, y: 44, scale: 0.96, duration: 1.5 },
          0.1,
        )
        .from(
          '[data-hero="nav"]',
          { yPercent: -120, opacity: 0, duration: 1 },
          0.35,
        )
        .from(
          '[data-hero="line"]',
          { yPercent: 112, duration: 1.25, stagger: 0.08 },
          0.42,
        )
        .from(
          '[data-hero="cta"]',
          { y: 20, opacity: 0, duration: 0.9, stagger: 0.08 },
          0.82,
        )
        .from(
          '[data-hero="spec"]',
          { y: 18, opacity: 0, duration: 0.85, stagger: 0.07 },
          1,
        )
    }, root)

    // `revert()` supprime les ScrollTrigger, tue les tweens et restaure les
    // styles inline : indispensable avec le double montage de StrictMode.
    return () => context.revert()
  }, [scope, prefersReducedMotion])
}
