import { useState, type ComponentType } from 'react'
import {
  ArrowRight,
  Package,
  MapTrifold,
  Plus,
  Scales,
  Timer,
  Wallet,
  GraduationCap,
  type IconProps,
} from '@phosphor-icons/react'
import { RichText } from '@/components/ui/RichText'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { faqEntries, type FaqEntry } from '@/data/faq'
import { actions } from '@/data/site'
import { cn } from '@/lib/cn'

const FAQ_ICONS: Record<string, ComponentType<IconProps>> = {
  wallet: Wallet,
  law: Scales,
  training: GraduationCap,
  box: Package,
  map: MapTrifold,
  timer: Timer,
}

/**
 * Questions fréquentes.
 *
 * Une seule réponse ouverte à la fois, et dans chaque réponse l'essentiel est
 * surligné en rouge : on doit pouvoir répondre à sa question sans lire la
 * phrase entière. Chaque question porte l'icône de son sujet.
 */
export function FaqSection() {
  const [openId, setOpenId] = useState<string | null>(faqEntries[0].id)

  return (
    <section id="faq" className="border-t border-navy-100 bg-navy-50 py-14 sm:py-20">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_1.6fr] lg:gap-14">
        <div>
          <SectionTitle
            label="Questions fréquentes"
            title="Tout ce qu’il faut savoir"
            accent="avant de vous équiper."
          />
          <a
            data-anim="up"
            href={actions.quote.href}
            className="group mt-5 inline-flex items-center gap-1.5 text-[14px] font-semibold text-urgent-600"
          >
            Une autre question ? Écrivez-nous
            <ArrowRight size={14} weight="bold" className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </a>
        </div>

        <div data-anim="stagger" className="border-t border-navy-200">
          {faqEntries.map((entry) => (
            <FaqItem
              key={entry.id}
              entry={entry}
              isOpen={openId === entry.id}
              onToggle={() => setOpenId((current) => (current === entry.id ? null : entry.id))}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

type FaqItemProps = {
  entry: FaqEntry
  isOpen: boolean
  onToggle: () => void
}

/** Hauteur animée par `grid-template-rows: 0fr -> 1fr` : la course suit le contenu. */
function FaqItem({ entry, isOpen, onToggle }: FaqItemProps) {
  const buttonId = `question-${entry.id}`
  const panelId = `reponse-${entry.id}`
  const Icon = FAQ_ICONS[entry.icon]

  return (
    <div className="border-b border-navy-200">
      <h3>
        <button
          type="button"
          id={buttonId}
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={panelId}
          className="group flex w-full cursor-pointer items-center gap-3.5 py-4 text-left"
        >
          <span
            aria-hidden="true"
            className={cn(
              'grid size-9 shrink-0 place-items-center rounded-md transition-colors duration-300',
              isOpen ? 'bg-urgent-600 text-white' : 'bg-white text-navy-500 group-hover:text-urgent-600',
            )}
          >
            <Icon size={18} weight={isOpen ? 'fill' : 'regular'} />
          </span>

          <span className="flex-1 text-[15px] leading-snug font-semibold text-navy-950 transition-colors group-hover:text-urgent-700 sm:text-[16px]">
            {entry.question}
          </span>

          <Plus
            size={16}
            weight="bold"
            data-open={isOpen}
            aria-hidden="true"
            className="shrink-0 text-navy-400 transition-transform duration-300 data-[open=true]:rotate-45 data-[open=true]:text-urgent-600"
          />
        </button>
      </h3>

      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        data-open={isOpen}
        className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-400 ease-out-expo data-[open=true]:grid-rows-[1fr]"
      >
        <div className="overflow-hidden">
          <p inert={!isOpen} className="max-w-2xl pb-5 pl-12.5 text-[14px] leading-relaxed text-navy-600 sm:text-[15px]">
            <RichText text={entry.answer} />
          </p>
        </div>
      </div>
    </div>
  )
}
