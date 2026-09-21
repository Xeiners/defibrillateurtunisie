import { useLayoutEffect, useRef } from 'react'
import { usePrefersReducedMotion } from '@/animations/usePrefersReducedMotion'
import { playSiteIntro, registerCurtain } from '@/lib/page-transition'
import { site } from '@/data/site'

/**
 * Le volet blanc : celui qui ouvre le site, puis celui qui couvre les
 * changements de page.
 *
 * Les deux rôles sont tenus par le MÊME élément, et c'est voulu : le visiteur
 * revoit à chaque navigation le panneau sur lequel le site s'est ouvert.
 * À l'ouverture il porte en plus une ligne ECG qui avance avec le chargement
 * réel et le pourcentage correspondant.
 *
 * Il est TOUJOURS monté. Le monter au moment de s'en servir coûterait un rendu
 * React juste avant l'animation, c'est-à-dire exactement le temps mort qu'il
 * est censé masquer.
 *
 * Son état de repos — couvrant à l'ouverture, caché ensuite — est porté par la
 * classe `page-curtain` et par GSAP, jamais par une `style` de React : React
 * remettrait sa valeur à chaque rendu et effacerait celle de l'animation. Pour
 * la même raison, aucune `transform` n'est écrite ici : GSAP relit la
 * transformation en place avant d'animer, et un `translateY(100%)` en HTML lui
 * reviendrait en pixels, qu'il ajouterait aux siens.
 *
 * Il est invisible aux lecteurs d'écran : ce qu'il annonce — « patientez », « la
 * page change » — n'a de sens qu'à l'oeil.
 */
export function PageCurtain() {
  const prefersReducedMotion = usePrefersReducedMotion()

  const panelRef = useRef<HTMLDivElement>(null)
  const markRef = useRef<HTMLDivElement>(null)
  const traceRef = useRef<SVGPathElement>(null)
  const percentRef = useRef<HTMLSpanElement>(null)

  // `useLayoutEffect` : le volet doit être réglé avant le premier affichage,
  // sinon on aperçoit la page une image avant qu'il ne la couvre.
  useLayoutEffect(() => {
    const panel = panelRef.current
    const mark = markRef.current
    const trace = traceRef.current
    const percent = percentRef.current
    if (!panel || !mark || !trace || !percent) return

    const unregister = registerCurtain({ panel, mark, trace, percent })
    playSiteIntro(!prefersReducedMotion)
    return unregister
  }, [prefersReducedMotion])

  return (
    <div ref={panelRef} aria-hidden="true" className="page-curtain">
      <div ref={markRef} className="flex flex-col items-center">
        <img
          src="/favicon.svg"
          alt=""
          width={72}
          height={72}
          className="size-14 sm:size-16"
        />

        <span className="mt-3 flex items-baseline text-[17px] leading-none font-bold tracking-[-0.02em] text-navy-950 sm:text-[19px]">
          {site.wordmark.lead}
          <span className="text-urgent-600">{site.wordmark.trail}</span>
        </span>

        {/* La trace pâle reste visible comme ligne isoélectrique. La trace
            rouge se dessine par-dessus au rythme du chargement réel. */}
        <svg
          viewBox="0 0 240 48"
          aria-hidden="true"
          className="mt-3 h-12 w-60 max-w-[72vw] overflow-visible"
        >
          <path
            d="M2 24 H50 C54 24 56 22 59 22 C62 22 64 24 68 24 H78 L84 17 L91 31 L99 4 L109 43 L118 24 H145 C150 24 151 20 156 20 C161 20 163 24 168 24 H238"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-navy-100"
          />
          <path
            ref={traceRef}
            d="M2 24 H50 C54 24 56 22 59 22 C62 22 64 24 68 24 H78 L84 17 L91 31 L99 4 L109 43 L118 24 H145 C150 24 151 20 156 20 C161 20 163 24 168 24 H238"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="1000"
            strokeDashoffset="1000"
            className="text-urgent-600"
          />
        </svg>

        <span
          ref={percentRef}
          className="tabular mt-1 block text-[11px] font-semibold tracking-[0.08em] text-navy-400"
        >
          0 %
        </span>
      </div>
    </div>
  )
}
