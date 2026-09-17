import { useEffect, useRef, useState } from 'react'
import { usePanelTransition } from '@/animations/usePanelTransition'
import { useSectionReveal } from '@/animations/useSectionReveal'
import { useTabIndicator } from '@/animations/useTabIndicator'
import {
  SELECT_SEGMENT_EVENT,
  pricingPlans,
  pricingSegments,
  segmentIdFromHash,
} from '@/data/pricing'
import { PlanCard } from './PlanCard'

/**
 * Tarifs.
 *
 * Trois durées en onglets, les formules correspondantes en dessous. Structure
 * classique et lisible : c'est ce qu'un acheteur attend d'une page de prix, et
 * ce qui se compare le plus vite.
 *
 * Le soin est mis dans l'exécution plutôt que dans le dispositif : échelle du
 * prix, filets, formule recommandée passée en encre, glissement du panneau
 * dans le sens de l'onglet choisi.
 *
 * Navigation clavier complète : flèches, Origine et Fin.
 */
export function PricingSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const indicatorRef = useRef<HTMLSpanElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const directionRef = useRef(1)

  const [activeId, setActiveId] = useState(pricingSegments[0].id)
  const activeIndex = pricingSegments.findIndex((s) => s.id === activeId)
  const segment = pricingSegments[activeIndex]

  useSectionReveal(sectionRef)
  useTabIndicator(listRef, indicatorRef, activeId)
  usePanelTransition(viewportRef, panelRef, activeId, directionRef)

  // Formules du régime, de la plus longue à la plus courte : le meilleur
  // tarif ouvre la lecture, ce qui est aussi l'ordre de la recommandation.
  const plans = pricingPlans
    .filter((plan) => plan.segmentId === activeId)
    .sort((a, b) => b.months - a.months)

  const selectTab = (index: number) => {
    const next = pricingSegments[(index + pricingSegments.length) % pricingSegments.length]
    directionRef.current =
      pricingSegments.findIndex((s) => s.id === next.id) > activeIndex ? 1 : -1
    setActiveId(next.id)
  }

  // Lien profond : une seule fois, au chargement. Mettre cette lecture dans
  // l'effet d'écoute ci-dessous la ferait rejouer à chaque changement
  // d'onglet, et le hash reprendrait la main sur les clics du visiteur.
  useEffect(() => {
    const fromHash = segmentIdFromHash(window.location.hash)
    if (fromHash) setActiveId(fromHash)
  }, [])

  // Demandes venues du reste de la page (la bande de formules sous le hero).
  useEffect(() => {
    const apply = (nextId: string) => {
      const nextIndex = pricingSegments.findIndex((s) => s.id === nextId)
      if (nextIndex === -1 || nextIndex === activeIndex) return

      directionRef.current = nextIndex > activeIndex ? 1 : -1
      setActiveId(nextId)
    }

    const onRequest = (event: Event) => {
      apply(String((event as CustomEvent<string>).detail))
    }

    const onHashChange = () => {
      const fromHash = segmentIdFromHash(window.location.hash)
      if (fromHash) apply(fromHash)
    }

    window.addEventListener(SELECT_SEGMENT_EVENT, onRequest)
    window.addEventListener('hashchange', onHashChange)

    return () => {
      window.removeEventListener(SELECT_SEGMENT_EVENT, onRequest)
      window.removeEventListener('hashchange', onHashChange)
    }
  }, [activeIndex])

  const onKeyDown = (event: React.KeyboardEvent) => {
    const moves: Record<string, number> = {
      ArrowRight: activeIndex + 1,
      ArrowLeft: activeIndex - 1,
      Home: 0,
      End: pricingSegments.length - 1,
    }
    const target = moves[event.key]
    if (target === undefined) return

    event.preventDefault()
    selectTab(target)
    const id =
      pricingSegments[(target + pricingSegments.length) % pricingSegments.length].id
    listRef.current?.querySelector<HTMLElement>(`[data-tab="${id}"]`)?.focus()
  }

  return (
    <section
      id="formules"
      ref={sectionRef}
      className="relative bg-[var(--surface-sunken)] py-20 sm:py-28"
    >
      {/* Cibles d'ancre, une par régime. C'est le navigateur qui fait défiler
          jusqu'ici — donc au clic répété, et sur un lien partagé — pendant que
          l'écoute ci-dessus ouvre l'onglet. Elles sont sans hauteur et posées
          au sommet de la section ; `scroll-mt` leur rend l'air que le défilement
          leur prendrait. */}
      {pricingSegments.map((segmentTarget) => (
        <span
          key={segmentTarget.id}
          id={`formule-${segmentTarget.id}`}
          aria-hidden="true"
          className="absolute top-0 block h-0 scroll-mt-10"
        />
      ))}

      <div className="mx-auto max-w-[1560px] px-5 sm:px-8">
        <header data-reveal className="max-w-[46rem]">
          <p className="label-tech text-[var(--text-muted)]">Nos formules</p>
          <h2 className="mt-5 text-[clamp(2rem,4.4vw,3.5rem)] leading-[1] font-semibold tracking-[-0.04em] text-[var(--text-primary)]">
            Tarifs de location de défibrillateur
          </h2>
        </header>

        <div
          data-reveal
          ref={listRef}
          role="tablist"
          aria-label="Durée de location"
          onKeyDown={onKeyDown}
          className="relative mt-10 inline-flex max-w-full gap-1 overflow-x-auto rounded-[var(--radius-field)] border border-[var(--border-subtle)] bg-[var(--surface-raised)] p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {/* Pastille active, glissée par anime.js. Sous la couche des
              libellés, d'où le `relative` sur les boutons. */}
          <span
            ref={indicatorRef}
            aria-hidden="true"
            className="absolute top-1 bottom-1 left-0 rounded-[var(--radius-inset)] opacity-0"
            style={{ background: 'var(--accent)' }}
          />

          {pricingSegments.map((tab, index) => {
            const isActive = tab.id === activeId
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                data-tab={tab.id}
                id={`onglet-${tab.id}`}
                aria-selected={isActive}
                aria-controls={`panneau-${tab.id}`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => selectTab(index)}
                className="relative z-10 rounded-[var(--radius-inset)] px-5 py-3 text-[13px] leading-none font-medium whitespace-nowrap transition-colors duration-200"
                style={{
                  color: isActive
                    ? 'var(--text-on-accent)'
                    : 'var(--text-secondary)',
                }}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        <div ref={viewportRef} className="mt-10">
          <div
            ref={panelRef}
            role="tabpanel"
            id={`panneau-${segment.id}`}
            aria-labelledby={`onglet-${segment.id}`}
            tabIndex={0}
          >
            <p
              data-panel-item
              className="max-w-[62ch] text-[15px] leading-relaxed text-[var(--text-secondary)]"
            >
              {segment.body}
            </p>

            {/* Le nombre de colonnes suit le nombre de formules : à deux
                formules dans une grille de trois, la cellule vide se lisait
                comme un oubli. */}
            <div
              className={
                plans.length === 2
                  ? 'mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:max-w-[62rem]'
                  : 'mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3'
              }
            >
              {plans.map((plan) => (
                <PlanCard key={plan.id} plan={plan} includes={segment.includes} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
