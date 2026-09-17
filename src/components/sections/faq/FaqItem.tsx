import { Plus } from '@phosphor-icons/react'
import type { FaqEntry } from '@/data/faq'

type FaqItemProps = {
  entry: FaqEntry
  isOpen: boolean
  onToggle: () => void
}

/**
 * Une entrée dépliable.
 *
 * OUVERTURE. La hauteur est animée par `grid-template-rows: 0fr -> 1fr` et non
 * par une `max-height` arbitraire : la course est exactement celle du contenu,
 * donc la courbe ne se termine ni trop tôt (saut) ni trop tard (attente sur du
 * vide). Le navigateur qui ne sait pas interpoler les `fr` ouvre d'un coup,
 * ce qui reste correct.
 *
 * ACCESSIBILITÉ. Le bouton porte l'état, le panneau est une région qu'il
 * nomme. Replié, le contenu reste dans le flux pour être mesuré : `inert` le
 * retire alors du clavier et des technologies d'assistance, sans quoi on
 * tabulerait dans des réponses invisibles.
 */
export function FaqItem({ entry, isOpen, onToggle }: FaqItemProps) {
  const buttonId = `question-${entry.id}`
  const panelId = `reponse-${entry.id}`

  return (
    <div data-reveal className="border-b border-[var(--border-subtle)]">
      {/* Le titre porte le bouton, et non l'inverse : la liste des questions
          reste alors une table des matières pour un lecteur d'écran. */}
      <h3>
        <button
          type="button"
          id={buttonId}
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={panelId}
          className="group/q flex w-full cursor-pointer items-start justify-between gap-5 py-7 text-left sm:gap-10"
        >
          <span className="flex flex-col gap-3">
            <span className="label-tech text-[var(--text-muted)] transition-colors duration-300 group-hover/q:text-[var(--accent-ink)]">
              {entry.tag}
            </span>
            {/* 40 signes et non 32 : la colonne s'étant élargie, une mesure
                courte laissait la commande flotter loin de sa question. */}
            <span className="max-w-[40ch] text-[clamp(1.0625rem,1.9vw,1.4375rem)] leading-snug font-medium tracking-[-0.025em] text-[var(--text-primary)]">
              {entry.question}
            </span>
          </span>

          {/* Le « + » pivote de 45° et devient une croix : un seul glyphe pour
              les deux états, donc aucun saut de gabarit à la bascule. */}
          <span
            aria-hidden="true"
            data-open={isOpen}
            className="mt-4 grid size-9 shrink-0 place-items-center rounded-[var(--radius-field)] border border-[var(--border-subtle)] text-[var(--text-secondary)] transition-[transform,background-color,border-color,color] duration-400 ease-[var(--ease-out-expo)] group-hover/q:border-[var(--border-strong)] data-[open=true]:rotate-45 data-[open=true]:border-[var(--accent)] data-[open=true]:bg-[var(--accent)] data-[open=true]:text-[var(--text-on-accent)]"
          >
            <Plus size={15} weight="bold" />
          </span>
        </button>
      </h3>

      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        data-open={isOpen}
        className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-[var(--ease-out-expo)] data-[open=true]:grid-rows-[1fr]"
      >
        <div className="overflow-hidden">
          <div
            inert={!isOpen}
            data-open={isOpen}
            className="max-w-[64ch] pb-9 opacity-0 transition-opacity duration-400 ease-[var(--ease-out-expo)] data-[open=true]:opacity-100"
          >
            {entry.answer.map((paragraph) => (
              <p
                key={paragraph.slice(0, 40)}
                className="mt-5 text-[16px] leading-relaxed text-[var(--text-secondary)] first:mt-0 sm:text-[17px]"
              >
                {paragraph}
              </p>
            ))}

            {entry.bullets && (
              <ul className="mt-6 grid list-none gap-x-8 gap-y-3 sm:grid-cols-2">
                {entry.bullets.map((bullet) => (
                  <li
                    key={bullet}
                    className="flex items-start gap-3 text-[16px] leading-snug text-[var(--text-secondary)] sm:text-[17px]"
                  >
                    {/* Puce dessinée, pas un caractère : elle s'aligne sur la
                        première ligne quel que soit le corps du texte.
                        En cran sombre : à 6px sur fond clair, l'aplat de
                        marque ne se verrait tout simplement pas. */}
                    <span
                      aria-hidden="true"
                      className="mt-[9px] size-1.5 shrink-0 rounded-full"
                      style={{ background: 'var(--accent-ink)' }}
                    />
                    {bullet}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
