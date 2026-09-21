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
 * À l'ouverture il porte en plus le cœur qui bat et le pourcentage, qui n'ont
 * de sens que pendant un chargement.
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
  const heartRef = useRef<HTMLImageElement>(null)
  const ruleRef = useRef<HTMLSpanElement>(null)
  const percentRef = useRef<HTMLSpanElement>(null)

  // `useLayoutEffect` : le volet doit être réglé avant le premier affichage,
  // sinon on aperçoit la page une image avant qu'il ne la couvre.
  useLayoutEffect(() => {
    const panel = panelRef.current
    const mark = markRef.current
    const heart = heartRef.current
    const rule = ruleRef.current
    const percent = percentRef.current
    if (!panel || !mark || !heart || !rule || !percent) return

    const unregister = registerCurtain({ panel, mark, heart, rule, percent })
    playSiteIntro(!prefersReducedMotion)
    return unregister
  }, [prefersReducedMotion])

  return (
    <div ref={panelRef} aria-hidden="true" className="page-curtain">
      <div ref={markRef} className="flex flex-col items-center">
        <img
          ref={heartRef}
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

        {/* Filet rouge qui se remplit : la seule chose qui « avance » pendant
            le temps couvert, et le seul rappel de couleur du volet. */}
        <span className="mt-3.5 block h-0.5 w-28 overflow-hidden rounded-full bg-navy-100">
          <span ref={ruleRef} className="block h-full origin-left scale-x-0 rounded-full bg-urgent-600" />
        </span>

        <span
          ref={percentRef}
          className="tabular mt-2.5 block text-[11px] font-semibold tracking-[0.08em] text-navy-400"
        >
          0 %
        </span>
      </div>
    </div>
  )
}
