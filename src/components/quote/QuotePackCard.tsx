import type { ReactNode } from 'react'
import { Minus, Plus, Star, Trash } from '@phosphor-icons/react'
import { PackImage } from '@/components/ui/PackImage'
import { CURRENCY, basePrice, packs } from '@/data/pricing'
import { cn } from '@/lib/cn'
import { useQuote, type QuoteLine } from '@/store/quote-context'
import { useLocale } from '@/i18n/LocaleProvider'

/**
 * Un pack retenu, dans le devis.
 *
 * C'est la MÊME carte que dans la section des packs, resserrée : visuel,
 * appareil, sélecteur de durée et loyer restent à leur place. Le visiteur
 * reconnaît ce qu'il a choisi, et peut encore changer d'avis sans revenir en
 * arrière — la durée et le nombre d'appareils se règlent ici.
 */
export function QuotePackCard({ line }: { line: QuoteLine }) {
  const { locale, t } = useLocale()
  const { remove, setMonths, setQuantity } = useQuote()
  const pack = packs.find((item) => item.id === line.packId)

  // Un pack retiré du catalogue : la ligne a déjà été écartée à la relecture.
  if (!pack) return null

  const term =
    pack.terms.find((option) => option.months === line.months) ??
    pack.terms[pack.terms.length - 1]
  const reference = basePrice(pack)
  const discount = reference > term.monthly ? Math.round((1 - term.monthly / reference) * 100) : 0
  const lineTotal = term.monthly * line.quantity
  const isPopular = pack.isPopular === true

  return (
    <article
      className={cn(
        'relative overflow-hidden rounded-xl border bg-white',
        'transition-[border-color,box-shadow] duration-300 ease-smooth hover:shadow-(--shadow-card)',
        isPopular ? 'border-urgent-200' : 'border-navy-100 hover:border-navy-200',
      )}
    >
      {/* Filet de couleur en tête : rouge pour le pack le plus choisi, bleu
          nuit pour les autres. Il donne son identité à la carte sans répéter
          la photo produit en grand. */}
      <span
        aria-hidden="true"
        className={cn(
          'absolute inset-x-0 top-0 h-1',
          isPopular ? 'bg-linear-to-r from-urgent-600 to-urgent-400' : 'bg-navy-200',
        )}
      />

      <div className="flex items-start gap-3.5 p-3.5 pt-4.5">
        <div className="grid size-19 shrink-0 place-items-center overflow-hidden rounded-lg border border-navy-100 bg-white">
          <PackImage pack={pack} className="size-full object-contain p-1.5" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="flex min-w-0 items-center gap-1.5">
              <span className="truncate text-[11px] font-bold tracking-[0.14em] text-urgent-600 uppercase">
                {locale === 'en' ? 'Package' : 'Pack'} {t(pack.name)}
              </span>
              {isPopular && (
                <Star size={11} weight="fill" className="shrink-0 text-urgent-500" aria-hidden="true" />
              )}
            </p>

            <button
              type="button"
              onClick={() => remove(pack.id)}
              aria-label={locale === 'en' ? `Remove the ${t(pack.name)} package from my quote` : `Retirer le pack ${pack.name} de mon devis`}
              className="-mt-1 -mr-1 grid size-8 shrink-0 place-items-center rounded-md text-navy-300 transition-colors duration-200 hover:bg-urgent-50 hover:text-urgent-600"
            >
              <Trash size={15} />
            </button>
          </div>

          <h3 className="mt-0.5 truncate text-[15px] leading-tight font-bold text-navy-950">
            {pack.device}
          </h3>
          <p className="mt-0.5 truncate text-[12.5px] text-navy-400">
            {t(pack.deviceType)} · {t(pack.summary)}
          </p>
        </div>
      </div>

      <div className="px-3.5 pb-3.5">
        <p className="text-[11px] font-semibold text-navy-500">{locale === 'en' ? 'Commitment period' : 'Durée d’engagement'}</p>
        <div
          role="group"
          aria-label={locale === 'en' ? `Commitment period for the ${t(pack.name)} package` : `Durée d’engagement du pack ${pack.name}`}
          className="mt-1.5 flex gap-1 rounded-md bg-navy-50 p-1"
        >
          {pack.terms.map((option) => {
            const isActive = option.months === term.months
            return (
              <button
                key={option.months}
                type="button"
                aria-pressed={isActive}
                onClick={() => setMonths(pack.id, option.months)}
                className={cn(
                  'flex-1 rounded-sm py-1.5 text-[12px] font-semibold transition-colors duration-200',
                  isActive
                    ? 'bg-white text-navy-950 shadow-(--shadow-card)'
                    : 'text-navy-500 hover:text-navy-900',
                )}
              >
                {option.months} {locale === 'en' ? 'months' : 'mois'}
              </button>
            )
          })}
        </div>

        <div className="mt-3 flex flex-wrap items-end justify-between gap-x-4 gap-y-3 border-t border-navy-100 pt-3">
          <div>
            <p className="text-[11px] font-semibold text-navy-500">{locale === 'en' ? 'Monthly rent' : 'Loyer mensuel'}</p>
            {/* `key` sur la valeur : le prix rejoue son entrée à chaque durée. */}
            <p key={term.monthly} className="animate-pop mt-0.5 flex flex-wrap items-baseline gap-x-2">
              <span className="tabular text-[24px] leading-none font-bold tracking-[-0.03em] text-navy-950">
                {term.monthly}
              </span>
              <span className="text-[12px] font-semibold text-navy-500">{CURRENCY}/{locale === 'en' ? 'month' : 'mois'}</span>
              {discount > 0 && (
                <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-bold text-brand-700">
                  −{discount} %
                </span>
              )}
            </p>
          </div>

          <QuantityStepper
            packName={pack.name}
            quantity={line.quantity}
            onChange={(next) => setQuantity(pack.id, next)}
          />
        </div>

        {/* Le sous-total n'apparaît qu'à partir de deux appareils : à un seul,
            il répéterait le loyer juste au-dessus. */}
        {line.quantity > 1 && (
          <p className="mt-2.5 flex items-center justify-between gap-3 rounded-md bg-navy-50 px-3 py-2 text-[12px]">
            <span className="text-navy-500">
              {line.quantity} {locale === 'en' ? 'devices' : 'appareils'} × {term.monthly} {CURRENCY}
            </span>
            <span className="tabular font-bold text-navy-950">
              {lineTotal} {CURRENCY}/{locale === 'en' ? 'month' : 'mois'}
            </span>
          </p>
        )}
      </div>
    </article>
  )
}

type QuantityStepperProps = {
  packName: string
  quantity: number
  onChange: (quantity: number) => void
}

/** Nombre d'appareils pour ce pack : deux boutons plutôt qu'un champ à saisir. */
function QuantityStepper({ packName, quantity, onChange }: QuantityStepperProps) {
  const { locale } = useLocale()
  return (
    <div className="shrink-0">
      <p className="text-[11px] font-semibold text-navy-500">{locale === 'en' ? 'Devices' : 'Appareils'}</p>
      <div className="mt-1 flex items-center gap-1 rounded-md border border-navy-200 p-0.5">
        <StepperButton
          label={locale === 'en' ? `Remove one device from the ${packName} package` : `Retirer un appareil du pack ${packName}`}
          disabled={quantity <= 1}
          onClick={() => onChange(quantity - 1)}
        >
          <Minus size={13} weight="bold" />
        </StepperButton>

        <span aria-live="polite" className="tabular w-7 text-center text-[14px] font-bold text-navy-950">
          {quantity}
        </span>

        <StepperButton
          label={locale === 'en' ? `Add one device to the ${packName} package` : `Ajouter un appareil au pack ${packName}`}
          onClick={() => onChange(quantity + 1)}
        >
          <Plus size={13} weight="bold" />
        </StepperButton>
      </div>
    </div>
  )
}

function StepperButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string
  disabled?: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="grid size-7 place-items-center rounded-sm text-navy-700 transition-colors duration-200 hover:bg-navy-50 hover:text-navy-950 disabled:cursor-not-allowed disabled:text-navy-200 disabled:hover:bg-transparent"
    >
      {children}
    </button>
  )
}
