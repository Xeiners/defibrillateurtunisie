import { useEffect, useState } from 'react'
import { ArrowUpRight, Scales, X } from '@phosphor-icons/react'
import { TunisiaFlag } from '@/components/ui/TunisiaFlag'
import { lawNews } from '@/data/landing'
import { actions } from '@/data/site'

/** Court temps mort avant l'entrée : la bande se pose, elle ne surgit pas. */
const REVEAL_DELAY = 400

/**
 * L'annonce du projet de loi, en notification collée au bas de l'écran.
 *
 * Bande rouge pleine largeur, présente dès l'arrivée : c'est l'argument qui
 * fait passer de « utile » à « à faire maintenant ». Elle suit le visiteur où
 * qu'il en soit dans la page et se referme d'un clic.
 * La fermeture n'est PAS mémorisée : la bande revient à chaque rechargement.
 * C'est voulu — l'information vaut d'être revue, et la refermer ne coûte qu'un
 * clic.
 */
export function LawNotice() {
  const [isDismissed, setIsDismissed] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setIsVisible(true), REVEAL_DELAY)
    return () => window.clearTimeout(timer)
  }, [])

  if (isDismissed) return null

  return (
    <aside
      aria-label="Actualité réglementaire"
      data-open={isVisible}
      className="fixed inset-x-0 bottom-0 z-40 translate-y-full bg-urgent-600 text-white shadow-[0_-8px_30px_-12px_rgb(7_18_36/0.5)] transition-transform duration-600 ease-out-expo data-[open=true]:translate-y-0"
    >
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-3 py-2.5 sm:gap-4 sm:px-6 sm:py-3">
        <span className="hidden size-10 shrink-0 place-items-center rounded-md bg-white/15 sm:grid">
          <Scales size={20} weight="duotone" aria-hidden="true" />
        </span>

        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-2 text-[11px] font-bold tracking-[0.1em] text-urgent-100 uppercase">
            <TunisiaFlag className="h-3 w-auto" />
            Tunisie · {lawNews.date}
          </p>
          <p className="mt-0.5 text-[13px] leading-snug sm:text-[14px]">
            <strong className="font-semibold">
              Le ministère de la Santé prépare un projet de loi
            </strong>{' '}
            <span className="text-urgent-50">
              pour installer des défibrillateurs dans les lieux publics.
            </span>{' '}
            <a
              href={lawNews.source.href}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-0.5 whitespace-nowrap text-urgent-100 underline underline-offset-2 transition-colors hover:text-white"
            >
              {lawNews.source.label}
              <ArrowUpRight size={11} aria-hidden="true" />
            </a>
          </p>
        </div>

        <a
          href={actions.quote.href}
          className="hidden h-9 shrink-0 items-center rounded-md bg-white px-4 text-[13px] font-semibold text-urgent-700 transition-colors hover:bg-urgent-50 sm:inline-flex"
        >
          Anticiper
        </a>

        <button
          type="button"
          onClick={() => setIsDismissed(true)}
          aria-label="Fermer cette actualité"
          className="grid size-9 shrink-0 place-items-center rounded-md text-urgent-100 transition-colors hover:bg-white/15 hover:text-white"
        >
          <X size={16} weight="bold" />
        </button>
      </div>
    </aside>
  )
}
