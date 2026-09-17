import { useRef } from 'react'
import { useSectionReveal } from '@/animations/useSectionReveal'
import { about } from '@/data/about'

/**
 * Section pédagogique.
 *
 * La colonne de gauche reste fixe pendant que la droite défile : la question
 * posée demeure sous les yeux pendant qu'on en lit la réponse. C'est ce que
 * ne permettait pas la grille en mosaïque, où tout arrivait d'un bloc.
 *
 * Le `sticky` tombe de lui-même sous `lg`, sans média-query : une colonne
 * pleine largeur n'a rien à quoi adhérer.
 */
export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null)
  useSectionReveal(sectionRef)

  return (
    <section
      id="solutions"
      ref={sectionRef}
      className="on-deep bg-[var(--surface-deep)] py-20 sm:py-28"
    >
      <div className="mx-auto grid max-w-[1560px] grid-cols-1 items-start gap-x-8 px-5 sm:px-8 lg:grid-cols-12">
        <div
          data-reveal
          className="lg:sticky lg:top-24 lg:col-span-5 lg:self-start"
        >
          <p className="label-tech text-[var(--on-deep-muted)]">Comprendre</p>
          <h2 className="mt-5 max-w-[14ch] text-[clamp(2rem,4.4vw,3.5rem)] leading-[1] font-semibold tracking-[-0.04em] text-white">
            {about.heading}
          </h2>
          <p className="mt-6 max-w-[46ch] text-[15px] leading-relaxed text-[var(--on-deep-secondary)]">
            {about.intro}
          </p>
        </div>

        <div className="mt-14 flex flex-col gap-14 lg:col-span-6 lg:col-start-7 lg:mt-0 lg:gap-20">
          <figure data-reveal className="isolate overflow-hidden rounded-[var(--radius-media)]">
            <img
              src={about.media.device.src}
              alt={about.media.device.alt}
              width={1200}
              height={900}
              loading="lazy"
              decoding="async"
              className="aspect-[4/3] w-full object-cover"
            />
          </figure>

          <div data-reveal className="border-t border-[var(--on-deep-line)] pt-8">
            <h3 className="text-[clamp(1.35rem,2.4vw,1.75rem)] leading-tight font-semibold tracking-[-0.025em] text-white">
              {about.mission.title}
            </h3>
            <p className="mt-4 max-w-[52ch] text-[15px] leading-relaxed text-[var(--on-deep-secondary)]">
              {about.mission.body}
            </p>
          </div>

          {/* Chiffre clé. Il occupe seul sa hauteur : c'est l'argument le plus
              lourd de la page, il ne partage pas son espace. */}
          <div data-reveal className="border-t border-[var(--on-deep-line)] pt-8">
            <span className="tabular block text-[clamp(5rem,13vw,10rem)] leading-[0.82] font-semibold tracking-[-0.05em] text-[var(--color-signal-400)]">
              {about.stat.value}
            </span>
            <p className="mt-6 max-w-[34ch] text-[15px] leading-relaxed text-[var(--on-deep-secondary)]">
              {about.stat.label}
            </p>
          </div>

          <figure data-reveal className="isolate overflow-hidden rounded-[var(--radius-media)]">
            <img
              src={about.media.training.src}
              alt={about.media.training.alt}
              width={1000}
              height={1200}
              loading="lazy"
              decoding="async"
              className="aspect-[4/3] w-full object-cover"
            />
          </figure>
        </div>
      </div>
    </section>
  )
}
