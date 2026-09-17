import { ArrowRight, Check } from '@phosphor-icons/react'
import { actions } from '@/data/site'
import {
  CURRENCY,
  imageOf,
  totalLabel,
  type PricingPlan,
} from '@/data/pricing'
import { cn } from '@/lib/cn'

type PlanCardProps = {
  plan: PricingPlan
  includes: string[]
}

/**
 * Carte de formule.
 *
 * PHOTO EN VIGNETTE, À DROITE DU PRIX. Les photos produit sont des images
 * détourées : elles n'ont besoin ni d'un bandeau pleine largeur ni d'un fond,
 * l'appareil se pose directement sur la carte, à côté de ce qu'il coûte.
 *
 * LARGEUR DE VIGNETTE PAR PALIER. Les cartes n'ont pas la même largeur selon
 * l'écran : pleine largeur en mobile, deux par rangée dès `sm`, trois dès
 * `lg` — où elles sont au plus étroit, d'où la vignette qui y redescend —
 * puis de plus en plus larges. Le texte garde ainsi de quoi respirer à chaque
 * palier, et le prix peut replier « /mois HT » sous le montant plutôt que de
 * déborder.
 *
 * La formule recommandée passe en encre profonde. La hiérarchie vient donc du
 * contraste, et non d'un badge collé dans un coin sur une carte par ailleurs
 * identique aux autres.
 */
export function PlanCard({ plan, includes }: PlanCardProps) {
  const isRecommended = plan.isPopular === true
  const image = imageOf(plan)

  return (
    <article
      data-panel-item
      className={cn(
        'flex h-full flex-col rounded-[var(--radius-panel)] p-7 sm:p-8',
        isRecommended
          ? 'on-deep bg-[var(--surface-deep)]'
          : 'border border-[var(--border-subtle)] bg-[var(--surface-raised)]',
      )}
    >
      <div className="flex items-center gap-4 xl:gap-6">
        {/* `min-w-0` : sans lui, un mot long empêcherait la colonne de texte
            de rétrécir et pousserait la vignette hors de la carte. */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <p
              className="label-tech"
              style={{
                color: isRecommended
                  ? 'var(--color-signal-300)'
                  : 'var(--text-muted)',
              }}
            >
              {plan.months} mois
            </p>
            {isRecommended && (
              <p className="label-tech text-[var(--on-deep-muted)]">
                Recommandé
              </p>
            )}
          </div>

          <p
            className="mt-4 text-[15px] leading-snug"
            style={{
              color: isRecommended
                ? 'var(--on-deep-secondary)'
                : 'var(--text-secondary)',
            }}
          >
            {plan.tagline}
          </p>

          <p className="tabular mt-6 flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span
              className="text-[clamp(2.5rem,4.2vw,3.5rem)] leading-[0.85] font-semibold tracking-[-0.05em]"
              style={{
                color: isRecommended ? '#ffffff' : 'var(--text-primary)',
              }}
            >
              {plan.pricePerMonth}
            </span>
            <span
              className="text-[18px] leading-none font-semibold"
              style={{
                color: isRecommended ? '#ffffff' : 'var(--text-primary)',
              }}
            >
              {CURRENCY}
            </span>
            <span
              className="text-[14px] leading-none"
              style={{
                color: isRecommended
                  ? 'var(--on-deep-secondary)'
                  : 'var(--text-secondary)',
              }}
            >
              /mois HT
            </span>
          </p>

          <p
            className="tabular mt-3 text-[13px]"
            style={{
              color: isRecommended
                ? 'var(--on-deep-muted)'
                : 'var(--text-muted)',
            }}
          >
            {totalLabel(plan)}
          </p>
        </div>

        {/* Le rapport d'image vient des dimensions de la photo : la vignette
            épouse son format, et une photo en paysage ne sera pas tassée dans
            un cadre en portrait. */}
        <div
          className="w-20 shrink-0 overflow-hidden rounded-[var(--radius-field)] sm:w-24 lg:w-20 xl:w-28"
          style={{ aspectRatio: `${image.width} / ${image.height}` }}
        >
          <img
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            // La section tarifs est loin sous la ligne de flottaison.
            loading="lazy"
            decoding="async"
            className="size-full object-contain"
          />
        </div>
      </div>

      <p
        className={cn(
          'mt-7 border-t pt-6 text-[14px] font-medium',
          isRecommended
            ? 'border-[var(--on-deep-line)]'
            : 'border-[var(--border-subtle)]',
        )}
        style={{ color: isRecommended ? '#ffffff' : 'var(--text-primary)' }}
      >
        {plan.warranty}
      </p>

      <ul className="mt-5 mb-8 flex list-none flex-col gap-3">
        {includes.map((item) => (
          <li
            key={item}
            className="flex items-start gap-2.5 text-[14px] leading-snug"
            style={{
              color: isRecommended
                ? 'var(--on-deep-secondary)'
                : 'var(--text-secondary)',
            }}
          >
            <Check
              size={13}
              aria-hidden="true"
              className="mt-[3px] shrink-0"
              style={{
                color: isRecommended
                  ? 'var(--color-signal-300)'
                  : 'var(--accent-ink)',
              }}
            />
            {item}
          </li>
        ))}
      </ul>

      {/* `mt-auto` aligne les actions entre cartes de contenus inégaux. */}
      <div className="mt-auto">
        <a
          href={actions.quote.href}
          aria-label={`${actions.quote.label} pour un engagement de ${plan.months} mois`}
          className={cn(
            'group/cta flex items-center justify-between gap-4 rounded-[var(--radius-field)]',
            'px-5 py-4 text-[14px] leading-none font-medium transition-colors duration-300 active:scale-[0.99]',
            isRecommended
              ? 'bg-[var(--accent)] text-[var(--text-on-accent)] hover:bg-[var(--accent-hover)]'
              : 'border border-[var(--border-strong)] text-[var(--text-primary)] hover:border-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--text-on-accent)]',
          )}
        >
          {actions.quote.label}
          <ArrowRight
            size={15}
            aria-hidden="true"
            className="shrink-0 transition-transform duration-400 ease-[var(--ease-out-expo)] group-hover/cta:translate-x-1"
          />
        </a>
      </div>
    </article>
  )
}
