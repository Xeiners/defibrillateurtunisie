import { useState } from 'react'
import {
  ArrowRight,
  ArrowUpRight,
  ArrowsClockwise,
  BatteryCharging,
  Check,
  Cube,
  Headset,
  Heartbeat,
  ShieldCheck,
  Signpost,
  SpeakerHigh,
  Star,
  Translate,
  UsersThree,
  WifiHigh,
  Wrench,
  X,
  type IconProps,
} from '@phosphor-icons/react'
import type { ComponentType } from 'react'
import { CabinetModel } from '@/components/ui/CabinetModel'
import { PackImage } from '@/components/ui/PackImage'
import { SectionTitle } from '@/components/ui/SectionTitle'
import {
  CURRENCY,
  basePrice,
  defaultTermIndex,
  packIncludes,
  packs,
  purchaseSite,
  type Pack,
} from '@/data/pricing'
import { actions } from '@/data/site'
import { cn } from '@/lib/cn'
import { useQuote } from '@/store/quote-context'
import { useLocale } from '@/i18n/LocaleProvider'

/** Une icône par élément commun aux trois packs. */
const INCLUDE_ICONS: Record<string, ComponentType<IconProps>> = {
  cabinet: Signpost,
  battery: BatteryCharging,
  install: Wrench,
  maintenance: ShieldCheck,
  replace: ArrowsClockwise,
  support: Headset,
}

/** Une icône par caractéristique : la ligne se reconnaît avant d'être lue. */
const FEATURE_ICONS: Record<string, ComponentType<IconProps>> = {
  voice: SpeakerHigh,
  training: UsersThree,
  languages: Translate,
  cpr: Heartbeat,
  connected: WifiHigh,
}

/**
 * Nos packs.
 *
 * Trois formules, une par appareil : c'est le modèle loué qui fait la
 * différence, pas une durée. Les caractéristiques sont alignées d'une carte à
 * l'autre, cochées ou barrées, pour que la comparaison se fasse à l'horizontale
 * sans lire trois listes.
 *
 * Ce qui est commun aux trois est dit UNE FOIS, sous les cartes.
 *
 * La durée d'engagement est un sélecteur : on la change, le loyer suit. Le
 * pack s'ouvre sur la durée la plus longue, donc sur le prix le plus bas.
 *
 * « Choisir ce pack » ne fait pas défiler vers un formulaire : il AJOUTE le
 * pack — avec la durée affichée à cet instant — puis mène à `/devis`, où la
 * carte se retrouve telle quelle. Le visiteur ne ressaisit rien.
 */
export function OffersSection() {
  const { locale } = useLocale()
  return (
    <section id="offres" className="bg-white py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionTitle
          label={locale === 'en' ? 'Our packages' : 'Nos packs'}
          title={locale === 'en' ? 'Three devices,' : 'Trois appareils,'}
          accent={locale === 'en' ? 'everything included.' : 'tout compris.'}
          intro={locale === 'en' ? 'Turnkey rental: you choose the device, we take care of everything else.' : 'Location clé en main : vous choisissez l’appareil, nous nous occupons du reste.'}
        />

        <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-3">
          {packs.map((pack, index) => (
            <PackCard key={pack.id} pack={pack} delay={index * 0.08} />
          ))}
        </div>

        <CommonIncludes />
        <PurchaseBanner />
      </div>
    </section>
  )
}

function PackCard({ pack, delay }: { pack: Pack; delay: number }) {
  const { locale, t } = useLocale()
  const { add, has } = useQuote()
  const [termIndex, setTermIndex] = useState(() => defaultTermIndex(pack))
  const isPopular = pack.isPopular === true
  const isSelected = has(pack.id)
  const term = pack.terms[termIndex]
  const reference = basePrice(pack)

  return (
    <article
      data-anim="pop"
      data-delay={String(delay)}
      className={cn(
        'group/pack relative flex flex-col overflow-hidden rounded-xl border bg-white',
        'transition-[translate,scale,box-shadow,border-color] duration-250 ease-smooth will-change-transform hover:-translate-y-1.5',
        isPopular
          ? 'border-2 border-urgent-600 shadow-[0_24px_50px_-30px_rgb(216_30_39/0.55)] hover:shadow-[0_34px_60px_-28px_rgb(216_30_39/0.6)]'
          : 'border-navy-100 hover:border-navy-300 hover:shadow-[0_30px_55px_-32px_rgb(7_18_36/0.5)]',
      )}
    >
      {isPopular && (
        <span className="absolute top-3 right-3 z-10 inline-flex items-center gap-1 rounded-full bg-urgent-600 px-2.5 py-1 text-[11px] font-bold tracking-wide text-white uppercase">
          <Star size={11} weight="fill" aria-hidden="true" />
          {locale === 'en' ? 'Most popular' : 'Le plus choisi'}
        </span>
      )}

      {/* Fond BLANC : les photos produit sont détourées sur blanc, un gris
          derrière elles se verrait comme un rectangle. L'appareil occupe toute
          la case, c'est lui qu'on vient regarder. */}
      <div className="relative h-44 shrink-0 overflow-hidden bg-white sm:h-48">
        <PackImage
          pack={pack}
          className="absolute inset-0 size-full object-contain p-3 transition-transform duration-400 ease-smooth group-hover/pack:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="text-[11px] font-bold tracking-[0.14em] text-urgent-600 uppercase">
            {locale === 'en' ? 'Package' : 'Pack'} {t(pack.name)}
          </span>
          {/* Le pack déjà retenu le dit ici : la carte reste identique, seul
              l'état change. */}
          {isSelected && (
            <span className="animate-pop inline-flex items-center gap-1 rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-bold text-brand-700 uppercase">
              <Check size={9} weight="bold" aria-hidden="true" />
              {locale === 'en' ? 'In your quote' : 'Dans votre devis'}
            </span>
          )}
        </p>
        <h3 className="mt-1 text-[17px] leading-tight font-bold text-navy-950">{pack.device}</h3>
        <p className="mt-0.5 text-[13px] text-navy-400">
          {t(pack.deviceType)} · {t(pack.summary)}
        </p>

        {/* Durée d'engagement : c'est un CHOIX, et il fait bouger le prix. */}
        <div
          role="group"
          aria-label={locale === 'en' ? `Commitment period for the ${t(pack.name)} package` : `Durée d’engagement du pack ${pack.name}`}
          className="mt-3 flex gap-1 rounded-md bg-navy-50 p-1"
        >
          {pack.terms.map((option, index) => {
            const isActive = index === termIndex
            return (
              <button
                key={option.months}
                type="button"
                aria-pressed={isActive}
                onClick={() => setTermIndex(index)}
                className={cn(
                  'flex-1 rounded-sm py-1.5 text-[12px] font-semibold transition-colors duration-200',
                  isActive ? 'bg-white text-navy-950 shadow-(--shadow-card)' : 'text-navy-500 hover:text-navy-900',
                )}
              >
                {option.months} {locale === 'en' ? 'months' : 'mois'}
              </button>
            )
          })}
        </div>

        <div className="mt-2.5 flex flex-wrap items-baseline gap-x-2 gap-y-1">
          {/* `key` sur la valeur : le prix rejoue son entrée à chaque durée. */}
          <p key={term.monthly} className="animate-pop flex items-baseline gap-1">
            <span className="tabular text-[30px] leading-none font-bold tracking-[-0.03em] text-navy-950">
              {term.monthly}
            </span>
            <span className="text-[13px] font-semibold text-navy-500">{CURRENCY}/{locale === 'en' ? 'month' : 'mois'}</span>
          </p>

          {/* Tarif de référence barré : la remise de l'engagement se voit. */}
          {reference > term.monthly && (
            <p className="flex items-baseline gap-1.5">
              <s className="tabular text-[14px] font-semibold text-navy-300">
                {reference} {CURRENCY}
              </s>
              <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-bold text-brand-700">
                −{Math.round((1 - term.monthly / reference) * 100)} %
              </span>
            </p>
          )}
        </div>

        <ul className="mt-3.5 mb-4 flex list-none flex-col gap-1.5 border-t border-navy-100 pt-3.5">
          {pack.features.map((feature) => {
            const Icon = FEATURE_ICONS[feature.icon]
            return (
              <li key={feature.label} className="flex items-center gap-2.5 text-[13px] leading-snug">
                <span
                  className={cn(
                    'grid size-6 shrink-0 place-items-center rounded-md',
                    feature.included ? 'bg-brand-50 text-brand-700' : 'bg-navy-50 text-navy-300',
                  )}
                >
                  <Icon size={13} weight="bold" aria-hidden="true" />
                </span>
                <span className={feature.included ? 'text-navy-700' : 'text-navy-300 line-through decoration-navy-200'}>
                  {t(feature.label)}
                </span>
                {feature.included ? (
                  <Check size={13} weight="bold" className="ml-auto shrink-0 text-brand-600" aria-hidden="true" />
                ) : (
                  <X size={13} weight="bold" className="ml-auto shrink-0 text-navy-300" aria-hidden="true" />
                )}
              </li>
            )
          })}
        </ul>

        {/* Un `<a>` et non un `<button>` : le routeur intercepte le clic, mais
            « ouvrir dans un nouvel onglet » mène toujours à la page de devis. */}
        <a
          href={actions.quote.href}
          onClick={() => add(pack.id, term.months)}
          aria-label={locale === 'en' ? `Add the ${t(pack.name)} package for ${term.months} months to my quote` : `Ajouter le pack ${pack.name} sur ${term.months} mois à mon devis`}
          className={cn(
            'group mt-auto inline-flex h-10 items-center justify-center gap-2 rounded-md text-[14px] font-semibold transition-colors duration-250',
            isPopular
              ? 'bg-urgent-600 text-white hover:bg-urgent-700'
              : 'bg-navy-950 text-white hover:bg-urgent-600',
          )}
        >
          {isSelected ? (locale === 'en' ? 'View in my quote' : 'Voir dans mon devis') : (locale === 'en' ? 'Choose this package' : 'Choisir ce pack')}
          <ArrowRight
            size={15}
            weight="bold"
            className="transition-transform duration-250 group-hover:translate-x-1"
            aria-hidden="true"
          />
        </a>
      </div>
    </article>
  )
}

/**
 * Ce que les trois packs comprennent.
 *
 * Bloc SOMBRE au milieu d'une section claire : il rassemble ce qui ne se
 * négocie pas, et le contraste l'isole des trois cartes qu'il sert. L'armoire
 * en 3D y est posée sur un halo vert, la seule tache de couleur de la section
 * avec les pastilles d'icônes.
 */
function CommonIncludes() {
  const { locale, t } = useLocale()
  return (
    <div
      data-anim="up"
      className="on-dark relative mt-5 flex flex-col gap-6 overflow-hidden rounded-xl bg-navy-950 p-5 sm:p-7 lg:flex-row lg:items-center lg:gap-10"
    >
      <div
        aria-hidden="true"
        className="absolute -top-24 -left-20 size-72 rounded-full bg-brand-500/20 blur-3xl"
      />

      <div className="relative shrink-0 lg:w-56">
        <CabinetModel className="h-36 sm:h-40" />
        <p className="pointer-events-none absolute top-0 left-0 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-white">
          <Cube size={13} weight="bold" aria-hidden="true" />
          {locale === 'en' ? 'Rotate it' : 'Faites-la pivoter'}
        </p>
      </div>

      <div className="relative min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="text-[18px] font-bold text-white sm:text-[20px]">
            {locale === 'en' ? 'Included in all three packages' : 'Inclus dans les trois packs'}
          </h3>
          <span className="rounded-full bg-brand-500/15 px-2.5 py-1 text-[11px] font-bold tracking-wide text-brand-400 uppercase">
            {locale === 'en' ? 'No extra charge' : 'Sans supplément'}
          </span>
        </div>

        <ul className="mt-4 grid list-none gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {packIncludes.map((item) => {
            const Icon = INCLUDE_ICONS[item.icon]
            return (
              <li
                key={item.label}
                className="flex items-center gap-3 rounded-lg bg-white/5 p-2.5 transition-colors duration-300 hover:bg-white/10"
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-md bg-brand-500/15 text-brand-400">
                  <Icon size={17} weight="bold" aria-hidden="true" />
                </span>
                <span className="text-[13.5px] leading-snug text-navy-100">{t(item.label)}</span>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

/** Pour qui ne veut pas louer : la boutique d'achat du groupe, à ses couleurs. */
function PurchaseBanner() {
  const { locale } = useLocale()
  return (
    <div
      data-anim="up"
      className="mt-5 flex flex-col items-start gap-5 rounded-xl border p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6"
      style={{
        borderColor: `${purchaseSite.brand}40`,
        background: `linear-gradient(135deg, ${purchaseSite.brand}14, ${purchaseSite.brand}05)`,
      }}
    >
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-5">
        <img
          src={purchaseSite.logo}
          alt={purchaseSite.label}
          width={752}
          height={212}
          loading="lazy"
          className="h-10 w-auto shrink-0 rounded-md bg-white p-1.5 shadow-(--shadow-card) sm:h-12"
        />
        <div>
          <p className="text-[16px] font-bold text-navy-950 sm:text-[18px]">
            {locale === 'en' ? 'Would you rather own your defibrillator?' : 'Vous préférez posséder votre défibrillateur ?'}
          </p>
          <p className="mt-1 text-[14px] text-navy-500">
            {locale === 'en' ? `Our devices are also available to buy at ${purchaseSite.label}.` : `Nos appareils sont aussi à l’achat sur ${purchaseSite.label}.`}
          </p>
        </div>
      </div>

      <a
        href={purchaseSite.href}
        target="_blank"
        rel="noreferrer noopener"
        className="group inline-flex h-11 shrink-0 items-center gap-2 rounded-md px-5 text-[14px] font-semibold text-white transition-colors"
        style={{ backgroundColor: purchaseSite.brandDeep }}
        onMouseEnter={(event) => {
          event.currentTarget.style.backgroundColor = purchaseSite.brandDeeper
        }}
        onMouseLeave={(event) => {
          event.currentTarget.style.backgroundColor = purchaseSite.brandDeep
        }}
      >
        {locale === 'en' ? `Buy at ${purchaseSite.label}` : `Acheter sur ${purchaseSite.label}`}
        <ArrowUpRight size={15} weight="bold" className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
      </a>
    </div>
  )
}
