import type { ComponentType } from 'react'
import {
  ArrowsClockwise,
  BatteryCharging,
  Headset,
  Plus,
  ShieldCheck,
  Signpost,
  Star,
  Wrench,
  type IconProps,
} from '@phosphor-icons/react'
import { PackImage } from '@/components/ui/PackImage'
import {
  CURRENCY,
  basePrice,
  defaultTermIndex,
  packIncludes,
  packs,
  type Pack,
} from '@/data/pricing'
import { cn } from '@/lib/cn'
import { useQuote } from '@/store/quote-context'
import { QuotePackCard } from './QuotePackCard'
import { useLocale } from '@/i18n/LocaleProvider'

/** Une icône par élément commun aux trois packs, comme dans la section packs. */
const INCLUDE_ICONS: Record<string, ComponentType<IconProps>> = {
  cabinet: Signpost,
  battery: BatteryCharging,
  install: Wrench,
  maintenance: ShieldCheck,
  replace: ArrowsClockwise,
  support: Headset,
}

/**
 * Colonne « ce que je demande », à droite du formulaire.
 *
 * Elle reste COLLÉE en vue sur grand écran : le visiteur remplit ses
 * coordonnées sans perdre de vue ce qu'il a choisi, ni le loyer que cela
 * représente. Sous `lg`, elle passe simplement au-dessus du formulaire — c'est
 * l'ordre naturel : on vérifie sa sélection, puis on donne ses coordonnées.
 */
export function QuoteSelection({ className }: { className?: string }) {
  const { locale } = useLocale()
  const { lines, count, deviceCount, monthlyTotal, clear } = useQuote()
  const available = packs.filter((pack) => !lines.some((line) => line.packId === pack.id))

  return (
    <aside className={cn('flex flex-col gap-4 lg:sticky lg:top-20', className)}>
      <div className="overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-(--shadow-card)">
        <header className="on-dark flex items-center justify-between gap-3 bg-navy-950 px-5 py-4 text-white">
          <div>
            <p className="text-[11px] font-bold tracking-[0.14em] text-urgent-400 uppercase">
              {locale === 'en' ? 'Your quote' : 'Votre devis'}
            </p>
            <h2 className="mt-1 text-[17px] leading-tight font-bold">
              {count === 0 ? (locale === 'en' ? 'No package selected' : 'Aucun pack choisi') : (locale === 'en' ? 'Selected packages' : 'Packs retenus')}
            </h2>
          </div>

          {count > 0 && (
            <span
              key={deviceCount}
              className="animate-pop tabular grid size-9 shrink-0 place-items-center rounded-full bg-urgent-600 text-[14px] font-bold text-white"
              aria-label={locale === 'en' ? `${deviceCount} device${deviceCount > 1 ? 's' : ''} requested` : `${deviceCount} appareil${deviceCount > 1 ? 's' : ''} demandé${deviceCount > 1 ? 's' : ''}`}
            >
              {deviceCount}
            </span>
          )}
        </header>

        <div className="p-4">
          {count === 0 ? (
            <p className="rounded-lg border border-dashed border-navy-200 bg-navy-50 px-4 py-5 text-center text-[13.5px] leading-relaxed text-navy-500">
              {locale === 'en' ? <>Choose a package below, or leave the selection empty:<br />we will recommend the right device for your site.</> : <>Choisissez un pack ci-dessous, ou laissez la sélection vide :<br />nous vous conseillerons l’appareil adapté à votre site.</>}
            </p>
          ) : (
            <ul className="flex list-none flex-col gap-3">
              {lines.map((line) => (
                <li key={line.packId}>
                  <QuotePackCard line={line} />
                </li>
              ))}
            </ul>
          )}

          {available.length > 0 && (
            <div className={cn(count > 0 && 'mt-5 border-t border-navy-100 pt-4')}>
              <p className="text-[12px] font-semibold text-navy-600">
                {count === 0 ? (locale === 'en' ? 'Our three options' : 'Nos trois formules') : (locale === 'en' ? 'Add another package' : 'Ajouter un autre pack')}
              </p>
              <ul className="mt-2 flex list-none flex-col gap-2">
                {available.map((pack) => (
                  <li key={pack.id}>
                    <AddPackRow pack={pack} />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {count > 0 && (
          <footer className="border-t border-navy-100 bg-navy-50 px-5 py-4">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[12px] font-semibold text-navy-600">{locale === 'en' ? 'Monthly estimate' : 'Estimation mensuelle'}</p>
                <p className="mt-0.5 text-[11px] text-navy-400">
                  {count} {locale === 'en' ? `package${count > 1 ? 's' : ''}` : `pack${count > 1 ? 's' : ''}`} · {deviceCount} {locale === 'en' ? `device${deviceCount > 1 ? 's' : ''}` : `appareil${deviceCount > 1 ? 's' : ''}`}
                </p>
              </div>
              <p key={monthlyTotal} className="animate-pop flex items-baseline gap-1">
                <span className="tabular text-[28px] leading-none font-bold tracking-[-0.03em] text-navy-950">
                  {monthlyTotal}
                </span>
                <span className="text-[13px] font-semibold text-navy-500">{CURRENCY}/{locale === 'en' ? 'month' : 'mois'}</span>
              </p>
            </div>

            <p className="mt-2 text-[11px] leading-snug text-navy-400">
              {locale === 'en' ? 'Indicative amount excluding tax, to be confirmed in the quote we send you.' : 'Montant indicatif hors taxes, confirmé dans le devis que nous vous adressons.'}
            </p>

            <button
              type="button"
              onClick={clear}
              className="mt-3 w-full rounded-md py-2 text-[12.5px] font-semibold text-navy-400 transition-colors duration-200 hover:bg-white hover:text-urgent-600"
            >
              {locale === 'en' ? 'Clear my selection' : 'Vider ma sélection'}
            </button>
          </footer>
        )}
      </div>

      <IncludedRecap />
    </aside>
  )
}

/**
 * Ligne d'ajout d'un pack : visuel, nom, prix d'appel du pack.
 *
 * Elle ajoute le pack sur sa durée la plus longue — la moins chère —, comme la
 * carte de la page d'accueil quand on ne touche pas au sélecteur.
 */
function AddPackRow({ pack }: { pack: Pack }) {
  const { locale, t } = useLocale()
  const { add } = useQuote()
  const cheapest = pack.terms[defaultTermIndex(pack)]
  const reference = basePrice(pack)
  const isPopular = pack.isPopular === true

  return (
    <button
      type="button"
      onClick={() => add(pack.id, cheapest.months)}
      className={cn(
        'group flex w-full items-center gap-3 rounded-lg border bg-white p-2 text-left',
        'transition-[border-color,box-shadow] duration-300 ease-smooth hover:shadow-(--shadow-card)',
        isPopular ? 'border-urgent-200 hover:border-urgent-400' : 'border-navy-100 hover:border-navy-300',
      )}
    >
      <span className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-md border border-navy-100 bg-white">
        <PackImage pack={pack} className="size-full object-contain p-1" />
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5">
          <span className="truncate text-[13.5px] font-bold text-navy-950">{locale === 'en' ? 'Package' : 'Pack'} {t(pack.name)}</span>
          {isPopular && (
            <span className="inline-flex shrink-0 items-center gap-0.5 rounded-full bg-urgent-50 px-1.5 py-0.5 text-[10px] font-bold text-urgent-700 uppercase">
              <Star size={9} weight="fill" aria-hidden="true" />
              Top
            </span>
          )}
        </span>
        <span className="mt-0.5 block truncate text-[12px] text-navy-400">{pack.device}</span>
        <span className="mt-0.5 flex items-baseline gap-1.5">
          <span className="text-[12px] text-navy-500">
            {locale === 'en' ? 'from' : 'dès'}{' '}
            <span className="tabular font-bold text-navy-950">
              {cheapest.monthly} {CURRENCY}
            </span>
            /{locale === 'en' ? 'month' : 'mois'}
          </span>
          {reference > cheapest.monthly && (
            <s className="tabular text-[11px] text-navy-300">{reference}</s>
          )}
        </span>
      </span>

      <span
        aria-hidden="true"
        className="grid size-8 shrink-0 place-items-center rounded-md bg-navy-950 text-white transition-colors duration-200 group-hover:bg-urgent-600"
      >
        <Plus size={14} weight="bold" />
      </span>
    </button>
  )
}

/** Rappel de ce que la location comprend, quel que soit le pack retenu. */
function IncludedRecap() {
  const { locale, t } = useLocale()
  return (
    <div className="rounded-2xl border border-navy-100 bg-white p-5">
      <p className="text-[13px] font-bold text-navy-950">{locale === 'en' ? 'Included in every package' : 'Compris dans chaque pack'}</p>
      <ul className="mt-3 grid list-none gap-2 sm:grid-cols-2 lg:grid-cols-1">
        {packIncludes.map((item) => {
          const Icon = INCLUDE_ICONS[item.icon]
          return (
            <li key={item.label} className="flex items-center gap-2.5 text-[13px] text-navy-600">
              <span className="grid size-7 shrink-0 place-items-center rounded-md bg-brand-50 text-brand-700">
                <Icon size={14} weight="bold" aria-hidden="true" />
              </span>
              {t(item.label)}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
