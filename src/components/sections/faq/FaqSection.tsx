import { useState, type ComponentType } from 'react'
import {
  ArrowRight,
  ArrowsClockwise,
  Baby,
  Buildings,
  CalendarCheck,
  FileText,
  Heartbeat,
  Lifebuoy,
  Lightning,
  MapPinArea,
  Package,
  MapTrifold,
  Plus,
  Receipt,
  Scales,
  ShieldCheck,
  ShoppingCart,
  Timer,
  Translate,
  UsersThree,
  Wallet,
  Wrench,
  GraduationCap,
  type IconProps,
} from '@phosphor-icons/react'
import { RichText } from '@/components/ui/RichText'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { faqEntries, type FaqEntry } from '@/data/faq'
import { actions } from '@/data/site'
import { ROUTES } from '@/router/route-context'
import { cn } from '@/lib/cn'
import { useLocale } from '@/i18n/LocaleProvider'

const FAQ_ICONS: Record<string, ComponentType<IconProps>> = {
  wallet: Wallet,
  law: Scales,
  training: GraduationCap,
  box: Package,
  map: MapTrifold,
  timer: Timer,
  calendar: CalendarCheck,
  renew: ArrowsClockwise,
  cart: ShoppingCart,
  lightning: Lightning,
  shield: ShieldCheck,
  baby: Baby,
  languages: Translate,
  pin: MapPinArea,
  wrench: Wrench,
  lifebuoy: Lifebuoy,
  heartbeat: Heartbeat,
  team: UsersThree,
  file: FileText,
  receipt: Receipt,
  buildings: Buildings,
}

/**
 * Questions fréquentes.
 *
 * Une seule réponse ouverte à la fois, et dans chaque réponse l'essentiel est
 * surligné en rouge : on doit pouvoir répondre à sa question sans lire la
 * phrase entière. Chaque question porte l'icône de son sujet.
 */
export function FaqSection() {
  const { locale } = useLocale()
  const [openId, setOpenId] = useState<string | null>(faqEntries[0].id)

  return (
    <section id="faq" className="border-t border-navy-100 bg-navy-50 py-14 sm:py-20">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_1.6fr] lg:gap-14">
        <div>
          <SectionTitle
            label={locale === 'en' ? 'Frequently asked questions' : 'Questions fréquentes'}
            title={locale === 'en' ? 'Everything you need to know' : 'Tout ce qu’il faut savoir'}
            accent={locale === 'en' ? 'before getting equipped.' : 'avant de vous équiper.'}
          />
          <div data-anim="up" className="mt-5 flex flex-col items-start gap-2.5">
            <a
              href={ROUTES.faq}
              className="group inline-flex items-center gap-1.5 text-[14px] font-semibold text-navy-900 transition-colors hover:text-urgent-700"
            >
              {locale === 'en' ? 'See all questions' : 'Voir toutes les questions'}
              <ArrowRight size={14} weight="bold" className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </a>
            <a
              href={actions.quote.href}
              className="group inline-flex items-center gap-1.5 text-[14px] font-semibold text-urgent-600"
            >
              {locale === 'en' ? 'Another question? Contact us' : 'Une autre question ? Écrivez-nous'}
              <ArrowRight size={14} weight="bold" className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </a>
          </div>
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
  size?: 'md' | 'lg'
}

/**
 * Hauteur animée par `grid-template-rows: 0fr -> 1fr` : la course suit le contenu.
 *
 * Partagé avec la page `/faq`, qui le prend en `lg` : textes plus grands, et
 * pastille d'icône grisée puisqu'il y est posé sur une carte blanche.
 */
export function FaqItem({ entry, isOpen, onToggle, size = 'md' }: FaqItemProps) {
  const { t } = useLocale()
  const buttonId = `question-${entry.id}`
  const panelId = `reponse-${entry.id}`
  const Icon = FAQ_ICONS[entry.icon]
  const isLarge = size === 'lg'

  return (
    <div className={cn('border-b', isLarge ? 'border-navy-100 last:border-b-0' : 'border-navy-200')}>
      <h3>
        <button
          type="button"
          id={buttonId}
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={panelId}
          className={cn('group flex w-full cursor-pointer items-center text-left', isLarge ? 'gap-4 py-5' : 'gap-3.5 py-4')}
        >
          <span
            aria-hidden="true"
            className={cn(
              'grid shrink-0 place-items-center rounded-md transition-colors duration-300',
              isLarge ? 'size-10' : 'size-9',
              isOpen
                ? 'bg-urgent-600 text-white'
                : cn(isLarge ? 'bg-navy-50' : 'bg-white', 'text-navy-500 group-hover:text-urgent-600'),
            )}
          >
            <Icon size={isLarge ? 20 : 18} weight={isOpen ? 'fill' : 'regular'} />
          </span>

          <span
            className={cn(
              'flex-1 leading-snug font-semibold text-navy-950 transition-colors group-hover:text-urgent-700',
              isLarge ? 'text-[16px] sm:text-[18px]' : 'text-[15px] sm:text-[16px]',
            )}
          >
            {t(entry.question)}
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
        className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-350 ease-smooth data-[open=true]:grid-rows-[1fr]"
      >
        <div className="overflow-hidden">
          <p
            inert={!isOpen}
            className={cn(
              'max-w-2xl leading-relaxed text-navy-600',
              isLarge ? 'pb-6 pl-14 text-[15px] sm:text-[16.5px]' : 'pb-5 pl-12.5 text-[14px] sm:text-[15px]',
            )}
          >
            <RichText text={t(entry.answer)} />
          </p>
        </div>
      </div>
    </div>
  )
}
