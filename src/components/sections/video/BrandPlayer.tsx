import { MediaPlayer, MediaProvider } from '@vidstack/react'
import '@vidstack/react/player/styles/base.css'

type BrandPlayerProps = {
  videoId: string
  title: string
  autoPlay: boolean
  muted: boolean
}

/**
 * Surface vidéo nue.
 *
 * Aucune interface de lecteur : ni `DefaultVideoLayout`, ni boutons, ni voile,
 * ni bouton de lecture central. Seulement l'image. C'est aussi pour ça qu'on
 * importe `base.css` (4ko) et non le thème par défaut (68ko), qui n'existe que
 * pour habiller des contrôles dont il n'y a plus l'usage.
 *
 * Vidstack reste utile sans son interface : elle recadre l'embed YouTube pour
 * en masquer le bandeau titre, les boutons de partage et les écrans de fin.
 * C'est ce que ne fait pas une iframe brute.
 *
 * Le son est piloté depuis l'extérieur, par un bouton aux couleurs du site.
 * `muted` est réactif : le passer à `false` sur un clic constitue le geste
 * utilisateur qu'exigent les navigateurs pour autoriser le son.
 *
 * Fichier séparé et export par défaut : chargé à la demande par `VideoBand`.
 */
export default function BrandPlayer({
  videoId,
  title,
  autoPlay,
  muted,
}: BrandPlayerProps) {
  return (
    <MediaPlayer
      className="brand-player h-full w-full"
      title={title}
      src={`youtube/${videoId}`}
      aspectRatio="16/9"
      load="visible"
      posterLoad="visible"
      autoPlay={autoPlay}
      muted={muted}
      loop
      playsInline
    >
      <MediaProvider />
    </MediaPlayer>
  )
}
