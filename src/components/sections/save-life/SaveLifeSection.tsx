import { useState, type ComponentType } from 'react'
import {
  ArrowRight,
  HandPalm,
  Lightning,
  PhoneCall,
  Warning,
  type IconProps,
} from '@phosphor-icons/react'
import { RichText } from '@/components/ui/RichText'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { rescueSteps, type RescueStep } from '@/data/landing'
import { CURRENCY, HEADLINE_PRICE } from '@/data/pricing'
import { actions } from '@/data/site'
import { cn } from '@/lib/cn'
import { useLocale } from '@/i18n/LocaleProvider'

const STEP_ICONS: Record<string, ComponentType<IconProps>> = {
  reconnaitre: Warning,
  alerter: PhoneCall,
  masser: HandPalm,
  defibriller: Lightning,
}

/** Extensions essayées, dans l'ordre, pour l'illustration d'une étape. */
const IMAGE_EXTENSIONS = ['webp', 'jpg', 'png']

/**
 * Les gestes qui sauvent.
 *
 * Les quatre gestes sont POSÉS CÔTE À CÔTE : rien à faire glisser, on les
 * embrasse d'un regard. Le dernier — défibriller — porte un contour rouge et
 * une pointe qui descend vers le bandeau juste dessous : c'est le geste qui
 * dépend d'un appareil, et le bandeau dit ce qui se passe quand il manque.
 */
export function SaveLifeSection() {
  const { locale } = useLocale()
  return (
    <section
      id="sauver-une-vie"
      className="border-b border-navy-100 bg-white py-12 sm:py-14"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionTitle
          label={locale === 'en' ? 'Before emergency services arrive' : 'Avant l’arrivée des secours'}
          title={locale === 'en' ? '4 actions' : 'Les 4 gestes'}
          accent={locale === 'en' ? 'that save lives.' : 'qui sauvent.'}
          intro={locale === 'en' ? 'No medical training required. We still train your teams.' : 'Aucune formation médicale nécessaire. Nous formons tout de même vos équipes.'}
        />

        <ol data-anim="stagger" className="mt-8 grid list-none grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {rescueSteps.map((step, index) => (
            <li key={step.id} className="relative">
              <StepCard step={step} index={index} />

              {/* Pointe rouge sous la dernière carte : elle relie le geste au
                  bandeau. Posée ICI et non dans la carte, qui rogne ce qui
                  dépasse d'elle. */}
              {index === rescueSteps.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute -bottom-2.5 left-1/2 hidden size-5 -translate-x-1/2 rotate-45 rounded-[3px] bg-urgent-600 lg:block"
                />
              )}
            </li>
          ))}
        </ol>

        <ClosingBanner />
      </div>
    </section>
  )
}

function StepCard({ step, index }: { step: RescueStep; index: number }) {
  const { t } = useLocale()
  const [attempt, setAttempt] = useState(0)
  const Icon = STEP_ICONS[step.id]
  const isLast = index === rescueSteps.length - 1

  const candidates = [
    ...IMAGE_EXTENSIONS.map((extension) => `/etapes/${step.id}.${extension}`),
    ...(step.fallbackImage ? [step.fallbackImage] : []),
  ]
  const image = candidates[attempt]

  return (
    <article
      className={cn(
        'flex h-full flex-col overflow-hidden rounded-lg border bg-white',
        isLast ? 'border-2 border-urgent-600 shadow-[0_18px_40px_-24px_rgb(216_30_39/0.55)]' : 'border-navy-100',
      )}
    >
      {/* Hauteur FIXE et fond propre à l'illustration : les dessins n'ont ni la
          même taille ni le même format, le fond comble ce qui manque et toutes
          les cartes gardent la même silhouette. */}
      <div className="relative h-42 shrink-0" style={{ backgroundColor: step.background }}>
        {image ? (
          <img
            src={image}
            alt=""
            loading="lazy"
            onError={() => setAttempt((current) => current + 1)}
            className="absolute inset-0 size-full object-contain p-3"
          />
        ) : (
          <span className="grid size-full place-items-center">
            <Icon size={52} weight="light" className="text-navy-400/60" aria-hidden="true" />
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <h3 className="flex items-center gap-2.5 text-[18px] leading-tight font-bold text-navy-950">
          <span
            className={cn(
              'grid size-8 shrink-0 place-items-center rounded-md text-white',
              isLast ? 'bg-urgent-600' : 'bg-navy-950',
            )}
          >
            <Icon size={16} weight="fill" aria-hidden="true" />
          </span>
          {t(step.title)}
        </h3>

        <p className="mt-2.5 text-[13.5px] leading-relaxed text-navy-500">
          <RichText text={t(step.body)} />
        </p>
      </div>

    </article>
  )
}

/** Ce que la série implique pour l'établissement : le geste 4 a besoin d'un appareil. */
function ClosingBanner() {
  const { locale } = useLocale()
  return (
    <aside
      data-anim="pop"
      className="mt-4 flex flex-col gap-4 rounded-lg bg-urgent-600 p-5 text-white sm:p-6 lg:flex-row lg:items-center lg:justify-between lg:gap-8"
    >
      <div className="flex items-start gap-4">
        <span className="grid size-11 shrink-0 place-items-center rounded-md bg-white/15">
          <Warning size={22} weight="fill" aria-hidden="true" />
        </span>
        <div>
          <p className="text-[clamp(1.125rem,2vw,1.5rem)] leading-tight font-bold">
            {locale === 'en' ? 'What if it happened on your premises, without a defibrillator?' : 'Et si ça arrivait chez vous, sans défibrillateur ?'}
          </p>
          <p className="mt-1.5 text-[14px] leading-snug text-urgent-50">
            {locale === 'en' ? <>The 4<sup>th</sup> action becomes impossible: emergency services arrive too late for that step. The device must already be on site.</> : <>Le 4<sup>e</sup> geste devient impossible : les secours arrivent trop tard pour celui-là. L’appareil doit déjà être sur place.</>}
          </p>
        </div>
      </div>

      <a
        href={actions.quote.href}
        className="group inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-md bg-white px-5 text-[14px] font-semibold text-urgent-700 transition-colors hover:bg-urgent-50"
      >
        {locale === 'en' ? `Rent one from ${HEADLINE_PRICE} ${CURRENCY}/month` : `En louer un dès ${HEADLINE_PRICE} ${CURRENCY}/mois`}
        <ArrowRight size={15} weight="bold" className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
      </a>
    </aside>
  )
}
