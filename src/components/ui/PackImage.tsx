import { useState } from 'react'
import type { Pack } from '@/data/pricing'

/**
 * Visuel d'un pack, avec repli d'extension.
 *
 * `pack.images` liste les fichiers dans l'ordre de préférence (`.webp`, puis
 * `.jpg`, puis `.png`) : on essaie le suivant à chaque échec, et la case reste
 * vide plutôt que d'afficher une image cassée quand aucun ne répond.
 */
export function PackImage({ pack, className }: { pack: Pack; className?: string }) {
  const [attempt, setAttempt] = useState(0)
  const src = pack.images[attempt]

  if (!src) return null

  return (
    <img
      src={src}
      alt={pack.device}
      loading="lazy"
      decoding="async"
      onError={() => setAttempt((current) => current + 1)}
      className={className}
    />
  )
}
