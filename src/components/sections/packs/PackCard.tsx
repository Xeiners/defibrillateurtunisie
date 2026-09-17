import {
  ArrowRight,
  CalendarBlank,
  Check,
  ShieldCheck,
  Timer,
  type Icon,
} from '@phosphor-icons/react'
import {
  CURRENCY,
  pricingSegments,
  requestSegment,
  segmentHref,
  segmentOf,
  type PricingPlan,
} from '@/data/pricing'

/** Largeur d'une carte. Partagée avec la bande, qui mesure la piste. */
export const PACK_CARD_WIDTH = 'w-[240px] sm:w-[252px] lg:w-[264px]'

/**
 * EMPLACEMENT IMAGE — provisoire.
 *
 * Un glyphe par régime (courte, moyenne, longue durée) occupe le coin du
 * panneau de tête, où viendra le visuel définitif. Les glyphes viennent de la
 * fonte d'icônes déjà chargée, donc l'attente ne coûte pas un octet.
 */
const SEGMENT_ICONS: Icon[] = [Timer, CalendarBlank, ShieldCheck]

/** Dégradé du panneau mis en avant : du vert de marque vers son cran pâle. */
const FEATURED_HEAD =
  'linear-gradient(152deg, var(--color-signal-400) 0%, var(--color-signal-200) 100%)'

type PackCardProps = {
  plan: PricingPlan
}

/**
 * Une formule de location : une carte DANS une carte.
 *
 * Les données sont celles de la section tarifs — mensuel, accroche, garantie —
 * et non un résumé : une formule modifiée dans `data/pricing.ts` change ici et
 * là-bas en même temps.
 *
 * Le panneau de tête regroupe ce qui décide — durée, prix, action — sur son
 * propre fond, et ce que comprend la formule suit en dehors, sur le blanc de
 * la carte. La garantie ouvre la liste : c'est le seul point propre à la
 * formule, les suivants sont communs à tout son régime.
 *
 * FORMAT COMPACT. Largeur, marges et corps ont été réduits ENSEMBLE : réduire
 * les marges seules aurait resserré le contenu et rendu la carte chargée. Le
 * total sur la durée a été retiré pour la même raison — il répétait le prix
 * mensuel sous une autre forme ; la section tarifs l'affiche toujours.
 *
 * ARRONDIS CONCENTRIQUES. Le panneau intérieur prend `radius-media` (14px)
 * et non `radius-panel` (20px) : l'arrondi intérieur doit valoir l'extérieur
 * moins l'épaisseur qui l'en sépare, ici les 6px de cadre.
 *
 * LE BOUTON N'EST PAS UN LIEN. Toute la carte en est un ; imbriquer un second
 * lien dedans produirait un HTML invalide. La pastille est donc un `span`
 * dessiné comme un bouton, et c'est la carte qui reçoit le clic.
 */
export function PackCard({ plan }: PackCardProps) {
  const segment = segmentOf(plan)
  const segmentIndex = Math.max(
    0,
    pricingSegments.findIndex((candidate) => candidate.id === segment.id),
  )
  const Illustration = SEGMENT_ICONS[segmentIndex % SEGMENT_ICONS.length]
  const isFeatured = plan.isPopular === true

  return (
    <a
      href={segmentHref(segment.id)}
      onClick={() => requestSegment(segment.id)}
      aria-label={`Formule ${plan.months} mois, ${plan.pricePerMonth} ${CURRENCY} par mois hors taxes — voir le détail`}
      className="group/pack flex h-full flex-col rounded-[var(--radius-panel)] border border-[var(--border-subtle)] bg-[var(--surface-raised)] p-1.5 transition-[border-color,box-shadow,transform] duration-400 ease-[var(--ease-out-expo)] hover:-translate-y-1 hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-float)]"
    >
      <span
        className="flex flex-col gap-4 rounded-[var(--radius-media)] p-4"
        style={{
          background: isFeatured ? FEATURED_HEAD : 'var(--surface-sunken)',
        }}
      >
        <span className="flex items-start justify-between gap-3">
          <span
            className="label-tech rounded-full px-2.5 py-1.5"
            style={{
              background: 'var(--surface-raised)',
              color: 'var(--text-primary)',
            }}
          >
            {plan.months} mois
          </span>

          <Illustration
            size={20}
            weight="light"
            aria-hidden="true"
            className="mt-0.5 shrink-0 text-[var(--text-primary)] opacity-45 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover/pack:scale-110"
          />
        </span>

        <span className="flex flex-col gap-1.5">
          <span className="tabular flex items-baseline gap-1">
            <span className="text-[28px] leading-[0.95] font-semibold tracking-[-0.045em] text-[var(--text-primary)]">
              {plan.pricePerMonth}
            </span>
            <span className="text-[13px] leading-none font-medium text-[var(--text-primary)]">
              {CURRENCY}
            </span>
            <span className="text-[12px] leading-none text-[var(--text-secondary)]">
              /mois HT
            </span>
          </span>

          <span className="text-[12px] leading-snug font-medium text-[var(--text-primary)]">
            {plan.tagline}
          </span>
        </span>

        <span className="flex items-center justify-center gap-1.5 rounded-full bg-[var(--surface-deep)] px-4 py-2.5 text-[13px] leading-none font-medium text-white transition-colors duration-300 group-hover/pack:bg-[var(--color-ink-800)]">
          Voir la formule
          <ArrowRight
            size={13}
            aria-hidden="true"
            className="shrink-0 transition-transform duration-400 ease-[var(--ease-out-expo)] group-hover/pack:translate-x-1"
          />
        </span>
      </span>

      <span className="flex flex-col gap-2 px-3.5 pt-4 pb-3.5">
        {[plan.warranty, ...segment.includes].map((item) => (
          <span
            key={item}
            className="flex items-start gap-2 text-[12px] leading-snug text-[var(--text-secondary)]"
          >
            <Check
              size={11}
              weight="bold"
              aria-hidden="true"
              className="mt-[2px] shrink-0 text-[var(--accent-ink)]"
            />
            {item}
          </span>
        ))}
      </span>
    </a>
  )
}
