import { useEffect, type RefObject } from 'react'
import { gsap } from './gsap'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

/**
 * Effets d'apparition de toute la page, déclarés dans le balisage.
 *
 *   data-anim="up"       se pose en fondu, la netteté revenant (défaut)
 *   data-anim="left"     glisse depuis la gauche, en fondu net
 *   data-anim="right"    glisse depuis la droite, en fondu net
 *   data-anim="pop"      grossit légèrement : ce qui doit capter l'oeil
 *
 * Aucun effet ne fait « monter » un bloc depuis le bas : la page n'est pas une
 * présentation. Le mouvement vient de la netteté et de l'échelle, pas d'un
 * déplacement vertical.
 *   data-anim="clip"     se dévoile comme un volet (photos)
 *   data-anim="words"    titre révélé mot à mot (mots marqués `data-word`)
 *   data-anim="stagger"  enfants directs en cascade
 *   data-anim="grow"     enfants directs qui poussent depuis le bas (barres)
 *   data-delay="0.2"     retard en secondes
 *
 *   data-count="52"      nombre qui compte depuis 0 à l'apparition
 *   data-scrub-x="-30"   glisse horizontalement au rythme du défilement (xPercent)
 *   data-draw            tracé SVG dessiné au rythme du défilement
 *
 * Chaque élément se déclenche à SA position, pas à celle de sa section. Sous
 * « mouvement réduit », rien n'est posé : le contenu reste simplement visible.
 * Ce hook doit être monté au-dessus des sections : leurs épinglages sont ainsi
 * créés avant lui, et les positions calculées ici en tiennent compte.
 */
export function useScrollEffects(scope: RefObject<HTMLElement | null>) {
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const root = scope.current
    if (!root || prefersReducedMotion) return

    const counted: { el: HTMLElement; text: string }[] = []

    const context = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-anim]').forEach((el) => {
        const delay = Number(el.dataset.delay ?? 0)
        const scrollTrigger = { trigger: el, start: 'top 90%', once: true }
        const base = { delay, scrollTrigger, ease: 'expo.out', duration: 0.9 }

        switch (el.dataset.anim) {
          case 'pop':
            gsap.from(el, {
              ...base,
              scale: 0.94,
              opacity: 0,
              filter: 'blur(12px)',
              duration: 1,
              ease: 'power3.out',
            })
            break
          case 'left':
            gsap.from(el, { ...base, x: -32, opacity: 0, filter: 'blur(8px)' })
            break
          case 'right':
            gsap.from(el, { ...base, x: 32, opacity: 0, filter: 'blur(8px)' })
            break
          case 'clip':
            gsap.fromTo(
              el,
              { clipPath: 'inset(0 100% 0 0)' },
              { ...base, clipPath: 'inset(0 0% 0 0)', duration: 1.2, ease: 'expo.inOut' },
            )
            break
          case 'words':
            gsap.from(el.querySelectorAll('[data-word]'), {
              ...base,
              yPercent: 110,
              stagger: 0.035,
            })
            break
          case 'grow':
            gsap.from(el.children, {
              ...base,
              scaleY: 0,
              transformOrigin: 'bottom center',
              stagger: 0.06,
              duration: 0.8,
            })
            break
          case 'stagger':
            gsap.from(el.children, {
              ...base,
              opacity: 0,
              filter: 'blur(10px)',
              scale: 0.97,
              stagger: 0.07,
              duration: 0.9,
              ease: 'power3.out',
            })
            break
          default:
            gsap.from(el, {
              ...base,
              opacity: 0,
              filter: 'blur(10px)',
              scale: 1.015,
              duration: 1.1,
              ease: 'power3.out',
            })
        }
      })

      gsap.utils.toArray<HTMLElement>('[data-count]').forEach((el) => {
        const target = Number(el.dataset.count)
        const counter = { value: 0 }
        counted.push({ el, text: el.textContent ?? '' })
        el.textContent = '0'

        gsap.to(counter, {
          value: target,
          duration: 1.6,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
          onUpdate: () => {
            el.textContent = String(Math.round(counter.value))
          },
        })
      })

      gsap.utils.toArray<HTMLElement>('[data-scrub-x]').forEach((el) => {
        gsap.fromTo(
          el,
          { xPercent: 0 },
          {
            xPercent: Number(el.dataset.scrubX),
            ease: 'none',
            scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 0.5 },
          },
        )
      })

      gsap.utils.toArray<SVGPathElement>('[data-draw]').forEach((path) => {
        const length = path.getTotalLength()
        gsap.fromTo(
          path,
          { strokeDasharray: length, strokeDashoffset: length },
          {
            strokeDashoffset: 0,
            ease: 'none',
            scrollTrigger: { trigger: path, start: 'top 95%', end: 'top 45%', scrub: 0.5 },
          },
        )
      })
    }, root)

    return () => {
      context.revert()
      // Les compteurs écrivent dans le texte, que `revert` ne restaure pas.
      counted.forEach(({ el, text }) => {
        el.textContent = text
      })
    }
  }, [scope, prefersReducedMotion])
}
