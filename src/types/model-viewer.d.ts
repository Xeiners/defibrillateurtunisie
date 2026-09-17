import type { DetailedHTMLProps, HTMLAttributes } from 'react'

/**
 * `<model-viewer>` est un ÉLÉMENT PERSONNALISÉ, pas un composant React : il
 * n'existe dans le typage JSX que si on l'y déclare. On ne liste ici que les
 * attributs réellement employés par `HeroModel`, plutôt que d'importer le
 * typage du paquet — ce dernier tirerait le module entier (plusieurs centaines
 * de kilo-octets) dans le graphe, alors qu'il est chargé à la demande.
 *
 * La documentation complète des attributs est sur modelviewer.dev.
 */
type ModelViewerAttributes = {
  src?: string
  alt?: string
  /** Image montrée tant que le modèle n'est pas décodé. */
  poster?: string
  /** `neutral` : éclairage d'atelier, sans reflet coloré. */
  'environment-image'?: string
  exposure?: string | number
  'shadow-intensity'?: string | number
  'shadow-softness'?: string | number
  'camera-orbit'?: string
  'min-camera-orbit'?: string
  'max-camera-orbit'?: string
  'field-of-view'?: string
  'camera-controls'?: boolean
  'disable-zoom'?: boolean
  'disable-pan'?: boolean
  'auto-rotate'?: boolean
  'auto-rotate-delay'?: string | number
  'rotation-per-second'?: string
  'interaction-prompt'?: 'auto' | 'none'
  /**
   * `pan-y` laisse la page défiler au doigt sur le modèle. Sans cela, le
   * geste vertical est capté par la scène et le hero devient un piège à
   * défilement sur mobile.
   */
  'touch-action'?: string
  loading?: 'auto' | 'lazy' | 'eager'
  reveal?: 'auto' | 'manual' | 'interaction'
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': DetailedHTMLProps<
        HTMLAttributes<HTMLElement> & ModelViewerAttributes,
        HTMLElement
      >
    }
  }
}
