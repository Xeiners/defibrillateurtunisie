import {
  EnvelopeSimple,
  FacebookLogo,
  LinkedinLogo,
  MapPin,
  Phone,
} from '@phosphor-icons/react'
import { Button } from '@/components/ui/Button'
import { Logo } from '@/components/ui/Logo'
import { SplitWords } from '@/components/ui/SplitWords'
import { legalLinks, primaryNav } from '@/data/navigation'
import { CURRENCY, HEADLINE_PRICE } from '@/data/pricing'
import { actions, contact, site, socialLinks, studio } from '@/data/site'
import { useLocale } from '@/i18n/LocaleProvider'

const SOCIAL_ICONS = {
  linkedin: LinkedinLogo,
  facebook: FacebookLogo,
} as const

/**
 * Appel final + pied de page.
 *
 * Le bandeau rouge referme la page sur l'action qui l'ouvre. L'adresse e-mail
 * est à ce jour le seul moyen de contact réel : elle porte le devis. Les liens
 * légaux et réseaux ne s'affichent qu'une fois leur destination renseignée.
 */
export function Footer() {
  const { locale, t } = useLocale()
  const mailto = `mailto:${contact.email}`
  const activeLegal = legalLinks.filter((link) => link.href !== '')
  const activeSocial = socialLinks.filter((link) => link.href !== '')

  return (
    <footer id="contact" className="on-dark bg-navy-950 text-white">
      <div className="relative overflow-hidden bg-urgent-600">
        <svg
          viewBox="0 0 1200 80"
          preserveAspectRatio="none"
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-16 w-full text-white/25"
        >
          <path
            data-draw
            d="M0 50 H470 L490 50 L505 12 L530 76 L550 26 L566 50 H1200"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinejoin="round"
          />
        </svg>

        <div className="relative mx-auto flex max-w-7xl flex-col gap-5 px-4 py-10 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:py-12">
          <div>
            <h2 data-anim="words" className="text-[clamp(1.5rem,2.8vw,2.125rem)] leading-tight font-bold tracking-[-0.02em]">
              <SplitWords text={locale === 'en' ? 'Do not leave it to chance.' : 'Ne laissez pas le hasard décider.'} />
            </h2>
            <p data-anim="up" data-delay="0.2" className="mt-2 text-[15px] text-urgent-50">
              {locale === 'en' ? `Free quote, installation throughout Tunisia. From ${HEADLINE_PRICE} ${CURRENCY} excl. tax per month.` : `Devis gratuit, installation partout en Tunisie. Dès ${HEADLINE_PRICE} ${CURRENCY} HT par mois.`}
            </p>
          </div>
          <div data-anim="pop" data-delay="0.3" className="flex flex-wrap gap-2.5">
            <Button href={actions.quote.href} variant="light" withArrow>
              {t(actions.quote.label)}
            </Button>
            {contact.phone !== '' && (
              <Button href={`tel:${contact.phone.replace(/\s/g, '')}`} variant="ghost">
                {contact.phone}
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-2">
            <Logo tone="dark" />
            <p className="mt-3 max-w-md text-[14px] leading-relaxed text-navy-300">
              {locale === 'en' ? `${t(site.baseline)}. Tunisia’s first affordable defibrillator rental service for businesses, schools, shops and public organisations.` : `${site.baseline}. Le premier service de location de défibrillateurs à coût réduit pour les entreprises, écoles, commerces et collectivités.`}
            </p>
            {activeSocial.length > 0 && (
              <ul className="mt-5 flex list-none gap-2">
                {activeSocial.map((link) => {
                  const Icon = SOCIAL_ICONS[link.id as keyof typeof SOCIAL_ICONS]
                  return (
                    <li key={link.id}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        aria-label={link.label}
                        className="grid size-10 place-items-center rounded-full border border-white/15 text-navy-200 transition-colors hover:border-white hover:text-white"
                      >
                        <Icon size={17} />
                      </a>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>

          <nav aria-label={locale === 'en' ? 'Site map' : 'Plan du site'}>
            <p className="text-[13px] font-bold tracking-wide text-white uppercase">Navigation</p>
            <ul className="mt-4 flex list-none flex-col gap-2.5">
              {primaryNav.map((item) => (
                <li key={item.id}>
                  <a href={item.href} className="text-[14px] text-navy-300 transition-colors hover:text-white">
                    {t(item.label)}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="text-[13px] font-bold tracking-wide text-white uppercase">Contact</p>
            <ul className="mt-4 flex list-none flex-col gap-2.5 text-[14px] text-navy-300">
              <li className="flex items-center gap-2.5">
                <MapPin size={16} aria-hidden="true" className="shrink-0" />
                {t(contact.city)}
              </li>
              <li>
                <a href={mailto} className="flex items-center gap-2.5 transition-colors hover:text-white">
                  <EnvelopeSimple size={16} aria-hidden="true" className="shrink-0" />
                  {contact.email}
                </a>
              </li>
              {contact.phone !== '' && (
                <li>
                  <a
                    href={`tel:${contact.phone.replace(/\s/g, '')}`}
                    className="flex items-center gap-2.5 transition-colors hover:text-white"
                  >
                    <Phone size={16} aria-hidden="true" className="shrink-0" />
                    {contact.phone}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-white/10 py-6 text-[13px] text-navy-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.legalName}. {locale === 'en' ? 'All rights reserved.' : 'Tous droits réservés.'}
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {activeLegal.map((link) => (
              <a key={link.id} href={link.href} className="transition-colors hover:text-white">
                {t(link.label)}
              </a>
            ))}
            <p>
              {locale === 'en' ? 'Developed by' : 'Développé par'}{' '}
              {studio.url === '' ? (
                <span className="text-white">{studio.name}</span>
              ) : (
                <a href={studio.url} target="_blank" rel="noreferrer noopener" className="text-white hover:underline">
                  {studio.name}
                </a>
              )}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
