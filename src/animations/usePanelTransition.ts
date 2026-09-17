import { useLayoutEffect, useRef, type RefObject } from 'react'
import { animate, stagger, utils } from 'animejs'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

/**
 * Glissement d'un panneau d'onglet à l'autre (anime.js).
 *
 * POINT CRITIQUE : l'état de départ est posé SYNCHRONEMENT, dans le
 * `useLayoutEffect`, avant tout rendu écran. anime.js ne démarre qu'à la frame
 * suivante ; si on lui laisse poser l'opacité 0 et la hauteur de départ, le
 * navigateur peint d'abord le nouveau panneau à sa taille et son opacité
 * FINALES, puis l'animation le remet à zéro. C'était l'origine du
 * clignotement à chaque changement d'onglet.
 *
 * La hauteur est bien une propriété de mise en page, animée à contre-courant
 * de la règle « transform et opacity seulement ». C'est assumé : UN élément,
 * 560ms, déclenché par un clic. Aucune alternative en transform n'ouvre un
 * conteneur sans déformer son contenu.
 */
export function usePanelTransition(
  viewport: RefObject<HTMLElement | null>,
  panel: RefObject<HTMLElement | null>,
  activeId: string,
  direction: RefObject<number>,
) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const previousHeight = useRef(0)

  useLayoutEffect(() => {
    const viewportEl = viewport.current
    const panelEl = panel.current
    if (!viewportEl || !panelEl) return

    const nextHeight = panelEl.offsetHeight
    const fromHeight = previousHeight.current
    previousHeight.current = nextHeight

    // Premier rendu : on mémorise la hauteur, il n'y a rien à animer.
    if (fromHeight === 0 || prefersReducedMotion) return

    const items = Array.from(
      panelEl.querySelectorAll<HTMLElement>('[data-panel-item]'),
    )

    // --- État de départ, appliqué avant le premier rendu écran ---
    viewportEl.style.height = `${fromHeight}px`
    // Masqué UNIQUEMENT le temps de la transition : le reste du temps le
    // débordement doit rester visible, sinon les ombres seraient rognées.
    viewportEl.style.overflow = 'hidden'
    utils.set(items, { translateX: direction.current * 42, opacity: 0 })

    const heightAnimation = animate(viewportEl, {
      height: nextHeight,
      duration: 560,
      ease: 'outExpo',
      onComplete: () => {
        viewportEl.style.height = 'auto'
        viewportEl.style.overflow = ''
      },
    })

    const itemsAnimation = animate(items, {
      translateX: 0,
      opacity: 1,
      delay: stagger(60),
      duration: 640,
      ease: 'outExpo',
    })

    return () => {
      heightAnimation.pause()
      itemsAnimation.pause()
      utils.remove(viewportEl)
      utils.remove(items)
      viewportEl.style.height = 'auto'
      viewportEl.style.overflow = ''
    }
  }, [viewport, panel, activeId, direction, prefersReducedMotion])
}
