import { useEffect, useState } from 'react'
import { usePrefersReducedMotion } from '@/animations/usePrefersReducedMotion'
import { heroModel } from '@/data/site'

/**
 * L'armoire en trois dimensions, pièce de droite du hero.
 *
 * CHARGÉ À LA DEMANDE. `@google/model-viewer` pèse plusieurs centaines de
 * kilo-octets : l'importer en haut de fichier le placerait dans le lot initial
 * et retarderait l'affichage du titre, qui est le vrai contenu du hero. Il est
 * donc demandé après le premier rendu.
 *
 * SANS IMAGE D'ATTENTE. Jusqu'au chargement, la boîte reste vide mais garde sa
 * hauteur : rien ne bouge dans le hero quand le modèle apparaît. Si le module
 * ne se charge pas, la place reste vide plutôt que d'afficher une erreur.
 *
 * ROTATION. Elle ne démarre qu'après un temps mort et s'arrête dès qu'on
 * saisit l'objet. Sous « mouvement réduit » elle ne démarre pas du tout : le
 * modèle reste posé sur sa vue de trois quarts, et reste manipulable.
 *
 * `touch-action="pan-y"` n'est pas un détail : sans lui, le geste vertical est
 * capté par la scène et le hero devient un piège à défilement sur mobile.
 */
export function HeroModel() {
  const prefersReducedMotion = usePrefersReducedMotion()
  const [isViewerReady, setIsViewerReady] = useState(false)

  useEffect(() => {
    let isCurrent = true

    import('@google/model-viewer')
      .then(() => {
        if (isCurrent) setIsViewerReady(true)
      })
      .catch(() => {
        // La boîte reste vide : le hero ne casse pas si le module ne se
        // charge pas.
      })

    return () => {
      isCurrent = false
    }
  }, [])

  /**
   * La rotation est passée en ATTRIBUTS PRÉSENTS OU ABSENTS, jamais en
   * booléen. `<model-viewer>` est un élément personnalisé : il lit la simple
   * présence de `auto-rotate`, si bien qu'un `auto-rotate="false"` écrit par
   * React serait interprété comme vrai. Ne pas poser l'attribut du tout est
   * la seule façon non ambiguë de couper la rotation.
   */
  const motionProps = prefersReducedMotion
    ? {}
    : {
        'auto-rotate': true,
        'auto-rotate-delay': 2200,
        'rotation-per-second': '18deg',
      }

  return (
    <div
      data-hero="model"
      /* La hauteur est le SEUL réglage de taille du modèle : la colonne étant
         plus étroite que haute, c'est elle qui cadre l'objet. Elle est calée
         sur la hauteur du bloc de gauche — environ 210px depuis que actions
         et mesures partagent une rangée. Plus haut, le modèle imposerait sa
         hauteur à la grille, et `items-center` rendrait l'écart sous forme de
         vide au-dessus et au-dessous du texte. */
      className="relative h-[220px] w-full will-change-transform sm:h-[240px] lg:h-[240px]"
    >
      {isViewerReady && (
        <model-viewer
          src={heroModel.src}
          alt={heroModel.alt}
          environment-image="neutral"
          exposure="1.05"
          shadow-intensity="1"
          shadow-softness="0.8"
          camera-orbit="25deg 78deg 105%"
          camera-controls
          disable-pan
          {...motionProps}
          interaction-prompt="none"
          touch-action="pan-y"
          loading="eager"
          className="size-full [--poster-color:transparent]"
        />
      )}
    </div>
  )
}
