import { useEffect, useState } from 'react'
import { usePrefersReducedMotion } from '@/animations/usePrefersReducedMotion'
import { cabinetModel } from '@/data/site'
import { cn } from '@/lib/cn'
import { useLocale } from '@/i18n/LocaleProvider'

/**
 * L'armoire murale en 3D.
 *
 * `@google/model-viewer` pèse plusieurs centaines de kilo-octets : il est
 * importé après le premier rendu pour ne pas retarder la page. La boîte garde
 * sa hauteur pendant le chargement, rien ne bouge à l'apparition.
 *
 * `auto-rotate` est un attribut de présence : un `auto-rotate="false"` serait
 * lu comme vrai, d'où l'objet vide sous « mouvement réduit ».
 *
 * `touch-action="pan-y"` laisse la page défiler au doigt sur le modèle.
 */
export function CabinetModel({ className }: { className?: string }) {
  const { t } = useLocale()
  const prefersReducedMotion = usePrefersReducedMotion()
  const [isViewerReady, setIsViewerReady] = useState(false)

  useEffect(() => {
    let isCurrent = true

    import('@google/model-viewer')
      .then(() => {
        if (isCurrent) setIsViewerReady(true)
      })
      .catch(() => {
        // La boîte reste vide si le module ne se charge pas.
      })

    return () => {
      isCurrent = false
    }
  }, [])

  const motionProps = prefersReducedMotion
    ? {}
    : {
        'auto-rotate': true,
        'auto-rotate-delay': 800,
        'rotation-per-second': '22deg',
      }

  return (
    <div className={cn('relative w-full', className)}>
      {isViewerReady && (
        <model-viewer
          src={cabinetModel.src}
          alt={t(cabinetModel.alt)}
          environment-image="neutral"
          exposure="1.1"
          shadow-intensity="1"
          shadow-softness="0.9"
          camera-orbit="25deg 78deg 105%"
          camera-controls
          disable-pan
          disable-zoom
          {...motionProps}
          interaction-prompt="none"
          touch-action="pan-y"
          loading="lazy"
          className="size-full [--poster-color:transparent] [--progress-bar-color:transparent]"
        />
      )}
    </div>
  )
}
