import { useEffect, type RefObject } from 'react'
import { animate, spring, utils } from 'animejs'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

const INNER = '[data-card="inner"]'
const MEDIA = '[data-card="media"]'
const ACTION = '[data-card="action"]'

/**
 * Couche de survol des cartes produit (anime.js).
 *
 * anime.js ne pilote QUE les enfants d'une carte. La piste défilante et
 * l'entrée du hero restent la propriété de GSAP, donc les deux moteurs
 * n'écrivent jamais sur le même noeud. Voir `./README.md`.
 *
 * Seule la carte survolée bouge : les voisines restent intactes. Sur une piste
 * qui défile en continu, assombrir les autres cartes créerait un scintillement
 * permanent au passage du curseur.
 */
export function useProductShelf(
  scope: RefObject<HTMLElement | null>,
  /** Relance l'effet quand le catalogue arrive de l'API. */
  itemCount: number,
) {
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const root = scope.current
    if (!root || prefersReducedMotion) return

    const cards = Array.from(
      root.querySelectorAll<HTMLElement>('[data-card="root"]'),
    )
    if (cards.length === 0) return

    const setCardActive = (card: HTMLElement, isActive: boolean) => {
      // Ressort neuf à chaque appel : anime.js écrit `parent` sur l'instance
      // d'easing, une instance partagée serait un état mutable partagé.
      const lift = spring({ stiffness: 155, damping: 18 })

      const inner = card.querySelector<HTMLElement>(INNER)
      const media = card.querySelector<HTMLElement>(MEDIA)
      const action = card.querySelector<HTMLElement>(ACTION)

      if (inner) animate(inner, { translateY: isActive ? -10 : 0, ease: lift })
      if (media) {
        animate(media, {
          scale: isActive ? 1.07 : 1,
          duration: 760,
          ease: 'outExpo',
        })
      }
      if (action) animate(action, { scale: isActive ? 1.12 : 1, ease: lift })
    }

    const detachers = cards.flatMap((card) => {
      const activate = () => setCardActive(card, true)
      const deactivate = () => setCardActive(card, false)

      // `focusin` / `focusout` donnent le même retour visuel au clavier.
      card.addEventListener('pointerenter', activate)
      card.addEventListener('pointerleave', deactivate)
      card.addEventListener('focusin', activate)
      card.addEventListener('focusout', deactivate)

      return [
        () => card.removeEventListener('pointerenter', activate),
        () => card.removeEventListener('pointerleave', deactivate),
        () => card.removeEventListener('focusin', activate),
        () => card.removeEventListener('focusout', deactivate),
      ]
    })

    return () => {
      for (const detach of detachers) detach()

      const query = (selector: string) =>
        cards.flatMap((card) => [
          ...card.querySelectorAll<HTMLElement>(selector),
        ])

      const inners = query(INNER)
      const medias = query(MEDIA)
      const actions = query(ACTION)

      utils.remove([...inners, ...medias, ...actions])
      utils.set(inners, { translateY: 0 })
      utils.set([...medias, ...actions], { scale: 1 })
    }
  }, [scope, prefersReducedMotion, itemCount])
}
