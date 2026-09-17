import { useState, type ComponentType } from 'react'
import {
  ArrowRight,
  Bank,
  Barbell,
  Bed,
  Check,
  Factory,
  FirstAid,
  ForkKnife,
  GraduationCap,
  Storefront,
  type IconProps,
} from '@phosphor-icons/react'
import { SplitWords } from '@/components/ui/SplitWords'
import { riskFactors, sectors, type RiskFactor, type Sector } from '@/data/landing'
import { CURRENCY, HEADLINE_PRICE } from '@/data/pricing'
import { actions } from '@/data/site'
import { cn } from '@/lib/cn'

const SECTOR_ICONS: Record<string, ComponentType<IconProps>> = {
  ecoles: GraduationCap,
  sport: Barbell,
  restaurants: ForkKnife,
  hotels: Bed,
  entreprises: Factory,
  commerces: Storefront,
  sante: FirstAid,
  public: Bank,
}

/** Extensions essayées, dans l'ordre, pour l'illustration d'un secteur. */
const IMAGE_EXTENSIONS = ['webp', 'jpg', 'png']

type RiskLevel = {
  label: string
  message: string
  /** Couleur de la jauge et du libellé. */
  tone: string
  text: string
}

/**
 * Niveau de risque selon le nombre de facteurs cochés. Le message porte ce
 * que le niveau implique, pas seulement son nom.
 */
function riskLevelOf(count: number): RiskLevel | null {
  if (count === 0) return null
  if (count === 1)
    return {
      label: 'Risque modéré',
      message: 'Un arrêt cardiaque peut toucher n’importe qui, n’importe quand.',
      tone: 'bg-amber-500',
      text: 'text-amber-400',
    }
  if (count <= 3)
    return {
      label: 'Risque élevé',
      message: 'Un défibrillateur doit être accessible en moins de 3 minutes.',
      tone: 'bg-orange-500',
      text: 'text-orange-400',
    }
  return {
    label: 'Risque critique',
    message: 'Équipez-vous sans attendre : −10 % de survie par minute.',
    tone: 'bg-urgent-500',
    text: 'text-urgent-400',
  }
}

/**
 * « Êtes-vous concerné ? »
 *
 * La question EST le titre. À gauche, un diagnostic : chaque facteur coché
 * explique pourquoi il compte, et la barre de résultat juste dessous fait
 * monter sa jauge et change de verdict. À droite, les lieux concernés.
 */
export function SectorsSection() {
  const [checked, setChecked] = useState<ReadonlySet<string>>(new Set())
  const level = riskLevelOf(checked.size)

  const toggle = (id: string) =>
    setChecked((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  return (
    <section id="pourquoi" className="bg-navy-50 py-14 sm:py-20">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_1fr] lg:gap-14">
        <div>
          <h2
            data-anim="words"
            className="text-[clamp(2.25rem,5vw,3.5rem)] leading-[1.02] font-bold tracking-[-0.03em] text-navy-950"
          >
            <SplitWords text="Êtes-vous" />{' '}
            <SplitWords text={'concerné ?'} className="text-urgent-600" />
          </h2>
          <p data-anim="up" data-delay="0.2" className="mt-3 max-w-md text-[15px] leading-relaxed text-navy-500">
            Si vous travaillez dans un de ces secteurs, vous êtes forcément exposé au risque d'arrêt cardiaque.
          </p>

          <ul data-anim="stagger" data-delay="0.3" className="mt-6 flex list-none flex-col gap-2">
            {riskFactors.map((factor) => (
              <li key={factor.id}>
                <RiskCheckbox
                  factor={factor}
                  isChecked={checked.has(factor.id)}
                  onToggle={() => toggle(factor.id)}
                />
              </li>
            ))}
          </ul>

          <RiskResult level={level} count={checked.size} />
        </div>

        <div className="lg:self-center">
          <div>
            <p data-anim="up" className="text-[12px] font-semibold tracking-[0.12em] text-navy-400 uppercase">
              Les lieux concernés
            </p>
            <ul data-anim="stagger" className="mt-3 grid list-none grid-cols-2 gap-2.5 sm:grid-cols-4">
              {sectors.map((sector) => (
                <li key={sector.id} className="h-full">
                  <SectorTile sector={sector} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

type RiskCheckboxProps = {
  factor: RiskFactor
  isChecked: boolean
  onToggle: () => void
}

/** Case à cocher : l'explication se déplie sous le libellé une fois cochée. */
function RiskCheckbox({ factor, isChecked, onToggle }: RiskCheckboxProps) {
  return (
    <button
      type="button"
      aria-pressed={isChecked}
      onClick={onToggle}
      className={cn(
        'flex w-full items-start gap-3 rounded-md border bg-white px-4 py-3 text-left transition-colors duration-200',
        isChecked ? 'border-urgent-600' : 'border-navy-100 hover:border-navy-300',
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          'mt-px grid size-5 shrink-0 place-items-center rounded-sm border transition-colors duration-200',
          isChecked ? 'border-urgent-600 bg-urgent-600 text-white' : 'border-navy-300',
        )}
      >
        {isChecked && <Check size={12} weight="bold" className="animate-pop" />}
      </span>

      <span className="min-w-0 flex-1">
        <span className={cn('block text-[14px] font-semibold', isChecked ? 'text-navy-950' : 'text-navy-700')}>
          {factor.label}
        </span>
        <span
          data-open={isChecked}
          className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-400 ease-out-expo data-[open=true]:grid-rows-[1fr]"
        >
          <span className="overflow-hidden">
            <span className="block pt-1 text-[13px] leading-snug text-navy-500">{factor.why}</span>
          </span>
        </span>
      </span>
    </button>
  )
}

/**
 * Verdict du diagnostic, en barre compacte sous les cases : niveau, jauge
 * (un segment par facteur), message et action. Rien n'est rendu tant qu'aucune
 * situation n'est cochée.
 */
function RiskResult({ level, count }: { level: RiskLevel | null; count: number }) {
  // Rien de coché : pas de barre vide à afficher.
  if (!level) return null

  return (
    <div aria-live="polite" className="mt-3 rounded-md bg-navy-950 px-4 py-3 text-white">
      <div className="flex items-center gap-3">
        <p className={cn('shrink-0 text-[14px] font-bold', level.text)}>{level.label}</p>
        <div className="flex flex-1 gap-1" aria-hidden="true">
          {riskFactors.map((factor, index) => (
            <span
              key={factor.id}
              className={cn(
                'h-1.5 flex-1 rounded-full transition-colors duration-500',
                index < count ? level.tone : 'bg-white/10',
              )}
            />
          ))}
        </div>
        <p className="tabular shrink-0 text-[12px] font-semibold text-navy-400">
          {count}/{riskFactors.length}
        </p>
      </div>

      <div key={level.label} className="animate-pop mt-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <p className="text-[13px] leading-snug text-navy-200">{level.message}</p>
          <a
            href={actions.quote.href}
            className="group inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md bg-urgent-600 px-3 text-[13px] font-semibold text-white transition-colors hover:bg-urgent-700"
          >
            M’équiper dès {HEADLINE_PRICE} {CURRENCY}/mois
            <ArrowRight size={13} weight="bold" className="transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </a>
      </div>
    </div>
  )
}

/**
 * Carte de secteur : l'illustration en grand dans une zone claire, le texte
 * dessous sur une ligne chacun — jamais par-dessus.
 *
 * L'illustration vient de `public/secteurs/<id>` (les extensions sont essayées
 * l'une après l'autre). Sans fichier, l'icône du secteur prend la même place.
 */
function SectorTile({ sector }: { sector: Sector }) {
  const [attempt, setAttempt] = useState(0)
  const hasImage = attempt < IMAGE_EXTENSIONS.length
  const Icon = SECTOR_ICONS[sector.id]

  return (
    <article className="group flex h-full flex-col rounded-lg border border-navy-100 bg-white p-2 transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:border-urgent-200 hover:shadow-(--shadow-card)">
      <div className="grid aspect-[5/3] place-items-center overflow-hidden rounded-md bg-white sm:aspect-square">
        {hasImage ? (
          <img
            src={`/secteurs/${sector.id}.${IMAGE_EXTENSIONS[attempt]}`}
            alt=""
            loading="lazy"
            onError={() => setAttempt((current) => current + 1)}
            className="size-[80%] object-contain transition-transform duration-500 ease-out-expo group-hover:scale-110"
          />
        ) : (
          <Icon
            size={44}
            weight="light"
            aria-hidden="true"
            className="text-navy-400 transition-[color,transform] duration-500 ease-out-expo group-hover:scale-110 group-hover:text-urgent-600"
          />
        )}
      </div>

      <div className="px-1 pt-1 pb-1 text-center">
        {/* Un trait plein sous le nom : un peu de rouge sur une carte
            autrement neutre. Il s'étire sur toute la largeur au survol. */}
        <h3 className="relative inline-block max-w-full truncate align-bottom text-[14px] font-bold text-navy-950">
          {sector.label}
          <span
            aria-hidden="true"
            className="absolute inset-x-0 -bottom-0.5 h-[3px] origin-left scale-x-[0.82] rounded-full bg-urgent-500 transition-transform duration-500 ease-out-expo group-hover:scale-x-100"
          />
        </h3>
        <p className="truncate text-[12px] text-navy-500">{sector.hint}</p>
      </div>
    </article>
  )
}
