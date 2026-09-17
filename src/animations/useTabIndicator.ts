import { useLayoutEffect, useRef, type RefObject } from 'react'
import { animate, utils } from 'animejs'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

/**
 * Pastille active qui glisse d'un onglet à l'autre (anime.js).
 *
 * Elle se cale sur la position réelle du bouton actif plutôt que sur des
 * largeurs codées en dur : les libellés peuvent changer sans rien casser.
 *
 * Le `ResizeObserver` la replace sans animation quand la mise en page bouge
 * (point de bascule, police enfin chargée). Sa toute première notification est
 * IGNORÉE : un ResizeObserver se déclenche dès `observe()`, et ce
 * repositionnement instantané tuait le glissement à peine lancé.
 */
export function useTabIndicator(
  list: RefObject<HTMLElement | null>,
  indicator: RefObject<HTMLElement | null>,
  activeId: string,
) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const hasPositioned = useRef(false)

  useLayoutEffect(() => {
    const listEl = list.current
    const indicatorEl = indicator.current
    if (!listEl || !indicatorEl) return

    const place = (animated: boolean) => {
      const active = listEl.querySelector<HTMLElement>(`[data-tab="${activeId}"]`)
      if (!active) return

      const target = {
        translateX: active.offsetLeft,
        width: active.offsetWidth,
        opacity: 1,
      }

      if (animated) {
        animate(indicatorEl, { ...target, duration: 460, ease: 'outExpo' })
      } else {
        utils.set(indicatorEl, target)
      }
    }

    place(hasPositioned.current && !prefersReducedMotion)
    hasPositioned.current = true

    let isFirstNotification = true
    const observer = new ResizeObserver(() => {
      if (isFirstNotification) {
        isFirstNotification = false
        return
      }
      place(false)
    })
    observer.observe(listEl)

    return () => {
      observer.disconnect()
      utils.remove(indicatorEl)
    }
  }, [list, indicator, activeId, prefersReducedMotion])
}
