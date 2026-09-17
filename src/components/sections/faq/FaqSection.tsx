import { useRef, useState } from 'react'
import { useSectionReveal } from '@/animations/useSectionReveal'
import { faqEntries, faqHeading, faqIntro } from '@/data/faq'
import { actions } from '@/data/site'
import { Button } from '@/components/ui/Button'
import { FaqItem } from './FaqItem'

/**
 * Section pédagogique dépliable, posée juste après le hero.
 *
 * UN TON EN DESSOUS DU HERO. Le hero étant passé au blanc, une section blanche
 * de plus se serait fondue dedans sans qu'on voie où l'une finit : d'où le
 * fond `surface-sunken`. Le pas est léger à dessein — il marque le changement
 * de registre, il ne découpe pas la page en deux.
 *
 * UNE SEULE ENTRÉE OUVERTE. Ouvrir une réponse referme la précédente. Les
 * réponses sont longues ; toutes dépliées, la liste des questions cesse d'être
 * lisible d'un coup d'oeil et c'est justement ce qu'on vient chercher ici. La
 * première est ouverte au chargement pour montrer que ça se déplie.
 *
 * La colonne de gauche adhère au défilement : le titre reste en vue pendant
 * qu'on parcourt les réponses. Le `sticky` tombe de lui-même sous `lg`.
 */
export function FaqSection() {
  const sectionRef = useRef<HTMLElement>(null)
  useSectionReveal(sectionRef)

  const [openId, setOpenId] = useState<string | null>(
    faqEntries[0]?.id ?? null,
  )

  return (
    <section
      id="questions"
      ref={sectionRef}
      className="bg-[var(--surface-sunken)] py-20 sm:py-28"
    >
      <div className="mx-auto grid max-w-[1560px] grid-cols-1 items-start gap-x-8 px-5 sm:px-8 lg:grid-cols-12">
        <div
          data-reveal
          className="lg:sticky lg:top-24 lg:col-span-5 lg:self-start"
        >
          <p className="label-tech text-[var(--text-muted)]">Comprendre</p>
          <h2 className="mt-5 max-w-[17ch] text-[clamp(1.75rem,3.6vw,2.875rem)] leading-[1.05] font-semibold tracking-[-0.035em] text-[var(--text-primary)]">
            {faqHeading}
          </h2>
          <p className="mt-6 max-w-[44ch] text-[15px] leading-relaxed text-[var(--text-secondary)]">
            {faqIntro}
          </p>

          {/* La question qui n'est pas dans la liste se pose à quelqu'un. */}
          <div className="mt-8 hidden lg:block">
            <Button href={actions.quote.href} variant="outline" withArrow>
              {actions.quote.label}
            </Button>
          </div>
        </div>

        {/* La liste démarre en colonne 6 et non en 7. La colonne vide qui
            séparait les deux blocs ajoutait une gouttière entière à celle de
            la grille : le titre se retrouvait à l'autre bout de l'écran de la
            question qu'il annonce. */}
        <div className="mt-12 lg:col-span-7 lg:col-start-6 lg:mt-0">
          {/* Le premier filet est porté par le conteneur : chaque entrée ne
              porte que celui du bas, ce qui évite de doubler l'épaisseur aux
              jonctions. */}
          <div className="border-t border-[var(--border-subtle)]">
            {faqEntries.map((entry) => (
              <FaqItem
                key={entry.id}
                entry={entry}
                isOpen={entry.id === openId}
                onToggle={() =>
                  setOpenId((current) =>
                    current === entry.id ? null : entry.id,
                  )
                }
              />
            ))}
          </div>

          <div className="mt-10 lg:hidden">
            <Button href={actions.quote.href} variant="outline" withArrow>
              {actions.quote.label}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
