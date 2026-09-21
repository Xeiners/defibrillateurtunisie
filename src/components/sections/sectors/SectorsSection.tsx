import { useEffect, useRef, useState, type ComponentType } from 'react'
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
import { ScrollTrigger } from '@/animations/gsap'
import { SplitWords } from '@/components/ui/SplitWords'
import { riskFactors, sectors, type RiskFactor, type Sector } from '@/data/landing'
import { CURRENCY, HEADLINE_PRICE } from '@/data/pricing'
import { actions } from '@/data/site'
import { cn } from '@/lib/cn'
import { useLocale } from '@/i18n/LocaleProvider'

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
  const { locale } = useLocale()
  const [checked, setChecked] = useState<ReadonlySet<string>>(new Set())
  const isFirstRender = useRef(true)

  // Cocher une case allonge la colonne de gauche : les repères de ScrollTrigger,
  // calculés sur l'ancienne hauteur, ne valent plus pour tout ce qui suit. On
  // les recalcule UNE FOIS le dépliage terminé — jamais pendant, où `refresh()`
  // rendrait le mouvement saccadé.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    const timer = window.setTimeout(() => ScrollTrigger.refresh(), 420)
    return () => window.clearTimeout(timer)
  }, [checked])

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
            <SplitWords text={locale === 'en' ? 'Could this' : 'Êtes-vous'} />{' '}
            <SplitWords text={locale === 'en' ? 'affect you?' : 'concerné ?'} className="text-urgent-600" />
          </h2>
          <p data-anim="up" data-delay="0.2" className="mt-3 max-w-md text-[15px] leading-relaxed text-navy-500">
            {locale === 'en' ? 'If you work in one of these sectors, cardiac arrest is a risk you need to prepare for.' : "Si vous travaillez dans un de ces secteurs, vous êtes forcément exposé au risque d'arrêt cardiaque."}
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

          <RiskResult count={checked.size} />
        </div>

        {/* Aligné EN HAUT, et non centré : centrée, cette colonne se
            repositionnait à chaque pixel gagné par celle de gauche, et ses huit
            vignettes se repeignaient à chaque image du dépliage. C'était le
            plus gros du coût de l'animation. */}
        <div className="lg:self-start">
          <div>
            <p data-anim="up" className="text-[12px] font-semibold tracking-[0.12em] text-navy-400 uppercase">
              {locale === 'en' ? 'Places concerned' : 'Les lieux concernés'}
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
  const { t } = useLocale()
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
          {t(factor.label)}
        </span>
        {/* L'explication se déplie ET se révèle : la hauteur seule donnait un
            texte coupé net par le bord du masque. L'opacité, elle, ne coûte
            rien — elle est composée par le GPU. */}
        <span
          data-open={isChecked}
          className="group/why grid grid-rows-[0fr] transition-[grid-template-rows] duration-350 ease-smooth data-[open=true]:grid-rows-[1fr]"
        >
          <span className="overflow-hidden">
            <span className="block pt-1 text-[13px] leading-snug text-navy-500 opacity-0 transition-opacity duration-300 ease-smooth group-data-[open=true]/why:opacity-100">
              {t(factor.why)}
            </span>
          </span>
        </span>
      </span>
    </button>
  )
}

/**
 * Verdict du diagnostic, en barre compacte sous les cases : niveau, jauge
 * (un segment par facteur), message et action.
 *
 * La barre est TOUJOURS montée et se DÉPLIE. Montée puis démontée, elle
 * surgissait d'un coup à la première case cochée et faisait sauter de soixante-
 * dix pixels tout ce qui la suit : c'était la secousse la plus visible de la
 * section. Dépliée, elle pousse le contenu au même rythme que les explications
 * juste au-dessus, et la marge vit À L'INTÉRIEUR du masque pour ne pas laisser
 * un blanc quand la barre est repliée.
 */
function RiskResult({ count }: { count: number }) {
  const { locale } = useLocale()
  // Pendant le repli, le contenu n'est plus visible : on garde le niveau d'un
  // seul facteur, le temps que l'animation se termine sur un rendu valide.
  const level = riskLevelOf(Math.max(count, 1))
  if (!level) return null

  return (
    <div
      data-open={count > 0}
      className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-350 ease-smooth data-[open=true]:grid-rows-[1fr]"
    >
      <div className="overflow-hidden">
        <div aria-live="polite" className="mt-3 rounded-md bg-navy-950 px-4 py-3 text-white">
          <div className="flex items-center gap-3">
            <p className={cn('shrink-0 text-[14px] font-bold transition-colors duration-300', level.text)}>
              {locale === 'en' ? ({ 'Risque modéré': 'Moderate risk', 'Risque élevé': 'High risk', 'Risque critique': 'Critical risk' }[level.label] ?? level.label) : level.label}
            </p>
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

          {/* `animate-rise` et non `animate-pop` : le verdict change à chaque
              case cochée, et un rebond depuis 60 % d'échelle à chaque clic
              donnait une ligne de texte qui sautille. */}
          <div
            key={level.label}
            className="animate-rise mt-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-2"
          >
            <p className="text-[13px] leading-snug text-navy-200">{locale === 'en' ? ({
              'Un arrêt cardiaque peut toucher n’importe qui, n’importe quand.': 'Cardiac arrest can happen to anyone, at any time.',
              'Un défibrillateur doit être accessible en moins de 3 minutes.': 'A defibrillator should be accessible in under 3 minutes.',
              'Équipez-vous sans attendre : −10 % de survie par minute.': 'Get equipped now: survival falls by 10% every minute.',
            }[level.message] ?? level.message) : level.message}</p>
            <a
              href={actions.quote.href}
              className="group inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md bg-urgent-600 px-3 text-[13px] font-semibold text-white transition-colors hover:bg-urgent-700"
            >
              {locale === 'en' ? `Get equipped from ${HEADLINE_PRICE} ${CURRENCY}/month` : `M’équiper dès ${HEADLINE_PRICE} ${CURRENCY}/mois`}
              <ArrowRight
                size={13}
                weight="bold"
                className="transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </a>
          </div>
        </div>
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
  const { t } = useLocale()
  const [attempt, setAttempt] = useState(0)
  const hasImage = attempt < IMAGE_EXTENSIONS.length
  const Icon = SECTOR_ICONS[sector.id]

  // Au survol, la carte se lève doucement et un halo pâle monte derrière
  // l'illustration. Tout ce qui bouge est en `transform` et en `opacity`, sur
  // une même durée et une même courbe : les trois mouvements n'en font qu'un.
  //
  // L'OMBRE n'est pas animée : elle est posée une fois pour toutes sur une
  // couche à part, dont seule l'opacité change. Faire varier un `box-shadow`
  // oblige le navigateur à la redessiner à chaque image ; une opacité, le GPU
  // la compose sans rien redessiner.
  return (
    <article className="group relative flex h-full flex-col rounded-lg border border-navy-100 bg-white p-2 transition-[border-color,translate,scale] duration-500 ease-smooth hover:-translate-y-1 hover:border-urgent-200">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-lg opacity-0 shadow-[0_10px_20px_-16px_rgb(216_30_39/0.35)] transition-opacity duration-500 ease-smooth group-hover:opacity-100"
      />

      <div className="relative grid aspect-[5/3] place-items-center overflow-hidden rounded-md bg-white sm:aspect-square">
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_60%,var(--color-urgent-50),transparent_70%)] opacity-0 transition-opacity duration-500 ease-smooth group-hover:opacity-100"
        />

        {hasImage ? (
          <img
            src={`/secteurs/${sector.id}.${IMAGE_EXTENSIONS[attempt]}`}
            alt=""
            loading="lazy"
            onError={() => setAttempt((current) => current + 1)}
            className="relative size-[80%] object-contain transition-transform duration-500 ease-smooth group-hover:-translate-y-0.5 group-hover:scale-[1.05]"
          />
        ) : (
          <Icon
            size={44}
            weight="light"
            aria-hidden="true"
            className="relative text-navy-400 transition-[color,translate,scale] duration-500 ease-smooth group-hover:-translate-y-0.5 group-hover:scale-[1.05] group-hover:text-urgent-600"
          />
        )}
      </div>

      <div className="px-1 pt-1 pb-1 text-center">
        {/* Un trait plein sous le nom : un peu de rouge sur une carte
            autrement neutre. Il s'étire sur toute la largeur au survol. */}
        <h3 className="relative inline-block max-w-full truncate align-bottom text-[14px] font-bold text-navy-950 transition-colors duration-500 ease-smooth group-hover:text-urgent-700">
          {t(sector.label)}
          <span
            aria-hidden="true"
            className="absolute inset-x-0 -bottom-0.5 h-[3px] origin-left scale-x-[0.82] rounded-full bg-urgent-500 transition-transform duration-500 ease-smooth group-hover:scale-x-100"
          />
        </h3>
        <p className="truncate text-[12px] text-navy-500 transition-colors duration-500 ease-smooth group-hover:text-navy-700">
          {t(sector.hint)}
        </p>
      </div>
    </article>
  )
}
