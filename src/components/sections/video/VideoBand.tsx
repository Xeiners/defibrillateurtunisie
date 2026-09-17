import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { SpeakerHigh, SpeakerSlash } from '@phosphor-icons/react'
import { usePrefersReducedMotion } from '@/animations/usePrefersReducedMotion'
import { useSectionReveal } from '@/animations/useSectionReveal'

const BrandPlayer = lazy(() => import('./BrandPlayer'))

const VIDEO_ID = 'SjbqlyQ0iI8'
const VIDEO_TITLE = 'Defibrillateur.TN, le défibrillateur en situation'

/**
 * Bande vidéo.
 *
 * L'encre profonde a remplacé l'aplat turquoise provisoire : le turquoise
 * propre à la vidéo y ressort désormais comme un accent, au lieu de se
 * confondre avec son fond.
 *
 * La vidéo n'est jamais recadrée et aucune interface de lecteur ne se pose
 * dessus. Le seul contrôle est le bouton de son, dessiné comme le reste du
 * site et placé HORS de l'image.
 *
 * Le lecteur (~195ko) n'est téléchargé qu'à l'approche du champ de vision ;
 * le cadre 16:9 est réservé d'avance, donc son arrivée ne décale rien.
 */
export function VideoBand() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isNearViewport, setIsNearViewport] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const prefersReducedMotion = usePrefersReducedMotion()

  useSectionReveal(sectionRef)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setIsNearViewport(true)
          observer.disconnect()
        }
      },
      { rootMargin: '400px' },
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="video"
      ref={sectionRef}
      className="on-deep bg-[var(--surface-deep)] pb-20 sm:pb-28"
    >
      <div className="mx-auto max-w-[1560px] px-5 sm:px-8">
        <div
          data-reveal
          className="flex flex-wrap items-end justify-between gap-6 border-t border-[var(--on-deep-line)] pt-8"
        >
          <div>
            <p className="label-tech text-[var(--on-deep-muted)]">En situation</p>
            <h2 className="mt-5 max-w-[20ch] text-[clamp(1.5rem,3vw,2.25rem)] leading-tight font-semibold tracking-[-0.03em] text-white">
              Trente secondes pour comprendre le geste
            </h2>
          </div>

          <button
            type="button"
            onClick={() => setIsMuted((muted) => !muted)}
            aria-pressed={!isMuted}
            className="inline-flex items-center gap-2.5 rounded-[var(--radius-field)] border border-[var(--on-deep-line-strong)] px-5 py-3 text-[13px] leading-none font-medium whitespace-nowrap text-white transition-colors duration-300 hover:bg-white/10 active:scale-[0.98]"
          >
            {isMuted ? <SpeakerHigh size={15} /> : <SpeakerSlash size={15} />}
            {isMuted ? 'Activer le son' : 'Couper le son'}
          </button>
        </div>

        {/* `overflow-hidden` est nécessaire pour que l'arrondi s'applique au
            lecteur, qui est monté en enfant. Seuls les angles sont rognés :
            l'image reste entière sur ses quatre bords. */}
        <div
          data-reveal
          className="mt-10 aspect-[16/9] w-full overflow-hidden rounded-[var(--radius-panel)]"
        >
          {isNearViewport && (
            <Suspense fallback={null}>
              <BrandPlayer
                videoId={VIDEO_ID}
                title={VIDEO_TITLE}
                autoPlay={!prefersReducedMotion}
                muted={isMuted}
              />
            </Suspense>
          )}
        </div>
      </div>
    </section>
  )
}
