import { useEffect, type RefObject } from 'react'
import { gsap } from './gsap'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

type MarqueeOptions = {
  /** Vitesse de défilement, en pixels par seconde. */
  speed?: number
  /**
   * Sens dans lequel le contenu se déplace à l'écran.
   *
   * `left` est le réglage par défaut, celui du catalogue. `right` inverse
   * simplement la course, sans rien changer d'autre.
   */
  direction?: 'left' | 'right'
  /**
   * Nombre d'éléments sur la piste.
   *
   * Ce n'est pas une option de réglage : c'est la dépendance qui relance la
   * boucle quand le contenu arrive ou que le nombre de copies change. Sans
   * elle, l'effet mesurerait une piste encore vide et la boucle tournerait sur
   * une largeur nulle.
   */
  itemCount?: number
}

/**
 * Défilement continu et sans couture.
 *
 * La piste contient un nombre PAIR de copies du contenu. Parcourir 50% de sa
 * largeur ramène donc la seconde moitié très précisément là où était la
 * première : la répétition est invisible, sans calcul de position par élément.
 * Condition : si les éléments sont séparés par un écart, la piste doit se
 * terminer par ce même écart, sinon la moitié tombe à un demi-écart près et la
 * boucle saute.
 *
 * Vers la droite, la course est inversée : la piste part de `-50%` et revient
 * à `0`. Ces deux positions montrent le même contenu, si bien que le retour au
 * départ à chaque tour ne se voit pas.
 *
 * Le survol et le focus ne coupent pas la boucle, ils amènent son `timeScale`
 * à zéro : la piste ralentit puis repart, au lieu de s'arrêter net sous le
 * curseur. Ces événements sont écoutés sur `hoverZone`, en pratique le cadre
 * qui contient la piste.
 */
export function useMarquee(
  hoverZone: RefObject<HTMLElement | null>,
  track: RefObject<HTMLElement | null>,
  { speed = 55, direction = 'left', itemCount = 0 }: MarqueeOptions = {},
) {
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const zoneEl = hoverZone.current
    const trackEl = track.current
    if (!zoneEl || !trackEl || prefersReducedMotion) return
    if (itemCount === 0) return

    const durationFor = () => trackEl.scrollWidth / 2 / speed

    const cycle = { ease: 'none', repeat: -1, duration: durationFor() }
    const loop =
      direction === 'right'
        ? gsap.fromTo(trackEl, { xPercent: -50 }, { xPercent: 0, ...cycle })
        : gsap.to(trackEl, { xPercent: -50, ...cycle })

    const glideTo = (timeScale: number) =>
      gsap.to(loop, {
        timeScale,
        duration: 0.45,
        ease: 'power2.out',
        overwrite: true,
      })

    const pause = () => glideTo(0)
    const resume = () => glideTo(1)

    zoneEl.addEventListener('pointerenter', pause)
    zoneEl.addEventListener('pointerleave', resume)
    zoneEl.addEventListener('focusin', pause)
    zoneEl.addEventListener('focusout', resume)

    // La largeur des éléments change aux points de bascule : la vitesse doit
    // rester constante à l'écran, donc la durée se recalcule.
    const observer = new ResizeObserver(() => {
      loop.duration(durationFor())
    })
    observer.observe(trackEl)

    return () => {
      observer.disconnect()
      zoneEl.removeEventListener('pointerenter', pause)
      zoneEl.removeEventListener('pointerleave', resume)
      zoneEl.removeEventListener('focusin', pause)
      zoneEl.removeEventListener('focusout', resume)
      loop.kill()
      gsap.set(trackEl, { clearProps: 'transform' })
    }
  }, [hoverZone, track, prefersReducedMotion, speed, direction, itemCount])
}
