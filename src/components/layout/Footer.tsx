import { useRef } from 'react'
import {
  ArrowUpRight,
  EnvelopeSimple,
  FacebookLogo,
  LinkedinLogo,
  MapPin,
  Phone,
} from '@phosphor-icons/react'
import { useSectionReveal } from '@/animations/useSectionReveal'
import { Logo } from '@/components/ui/Logo'
import { Button } from '@/components/ui/Button'
import { footerColumns, isLiveHref, legalLinks } from '@/data/navigation'
import { contact, site, socialLinks, studio } from '@/data/site'

const SOCIAL_ICONS = {
  linkedin: LinkedinLogo,
  facebook: FacebookLogo,
} as const

/** Crédit de l'atelier. Devient un lien dès que `studio.url` est renseigné. */
function StudioCredit() {
  if (studio.url === '') {
    return (
      <p>
        Développé par <span className="text-white">{studio.name}</span>
      </p>
    )
  }

  return (
    <p>
      Développé par{' '}
      <a
        href={studio.url}
        target="_blank"
        rel="noreferrer noopener"
        className="text-white underline-offset-4 transition-colors duration-300 hover:underline"
      >
        {studio.name}
      </a>
    </p>
  )
}

/**
 * Pied de page.
 *
 * Il reprend l'encre du hero et referme la page sur l'action qui l'ouvre.
 *
 * RIEN DE MORT. Aucun lien n'est rendu tant qu'il ne mène nulle part :
 * les ancres sont confrontées à `liveAnchors`, les pages légales et les
 * réseaux à leur destination. Une colonne vidée de tous ses liens disparaît
 * entièrement plutôt que de laisser un titre orphelin. Le pied de page est
 * donc court aujourd'hui et se remplira tout seul à mesure que les sections
 * reviennent — sans qu'on ait à y retoucher.
 *
 * D'où la mise en page en `flex-wrap` et non en grille à colonnes fixes :
 * elle tient aussi bien avec une colonne qu'avec quatre.
 *
 * L'adresse e-mail est le seul moyen de contact réel à ce stade : elle porte
 * l'action principale, au lieu d'un bouton qui simulerait un formulaire.
 */
export function Footer() {
  const footerRef = useRef<HTMLElement>(null)
  useSectionReveal(footerRef)

  const mailto = `mailto:${contact.email}`
  const activeLegal = legalLinks.filter((link) => isLiveHref(link.href))
  const activeSocial = socialLinks.filter((link) => isLiveHref(link.href))

  const activeColumns = footerColumns
    .map((column) => ({
      ...column,
      items: column.items.filter((item) => isLiveHref(item.href)),
    }))
    .filter((column) => column.items.length > 0)

  return (
    <footer
      ref={footerRef}
      id="contact"
      className="on-deep bg-[var(--surface-deep)]"
    >
      <div className="mx-auto max-w-[1560px] px-5 pt-20 pb-10 sm:px-8 sm:pt-28 sm:pb-12">
        {/* --- Appel ------------------------------------------------------ */}
        <div
          data-reveal
          className="flex flex-col items-start justify-between gap-10 border-b border-[var(--on-deep-line)] pb-16 lg:flex-row lg:items-end"
        >
          {/* Espace insécable avant le « ? » : règle typographique française,
              et le point d'interrogation ne tombe plus seul en fin de ligne. */}
          <h2 className="max-w-[13ch] text-[clamp(2.25rem,6vw,4.5rem)] leading-[0.98] font-semibold tracking-[-0.045em] text-white">
            {'Prêt à équiper vos sites ?'}
          </h2>

          <div className="flex flex-col items-start gap-5">
            <p className="max-w-[34ch] text-[15px] leading-relaxed text-[var(--on-deep-secondary)]">
              Décrivez-nous votre site et le nombre de postes à couvrir : nous
              revenons vers vous avec une proposition chiffrée.
            </p>
            <Button href={mailto} withArrow>
              Demander un devis
            </Button>
          </div>
        </div>

        {/* --- Identité, navigation, contact ------------------------------- */}
        <div className="flex flex-col gap-12 py-14 lg:flex-row lg:justify-between lg:gap-16">
          <div data-reveal>
            <Logo />
            <p className="mt-5 max-w-[30ch] text-[14px] leading-relaxed text-[var(--on-deep-secondary)]">
              {site.baseline}. Location, maintenance et formation partout en
              Tunisie.
            </p>
          </div>

          <div className="flex flex-wrap gap-x-16 gap-y-10 lg:gap-x-20">
            {activeColumns.map((column) => (
              <nav key={column.id} data-reveal aria-label={column.title}>
                <p className="label-tech text-[var(--on-deep-muted)]">
                  {column.title}
                </p>
                <ul className="mt-5 flex list-none flex-col gap-3">
                  {column.items.map((item) => (
                    <li key={item.id}>
                      <a
                        href={item.href}
                        className="text-[14px] whitespace-nowrap text-[var(--on-deep-secondary)] transition-colors duration-300 hover:text-white"
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}

            <div data-reveal>
              <p className="label-tech text-[var(--on-deep-muted)]">Contact</p>
              <ul className="mt-5 flex list-none flex-col gap-3 text-[14px] text-[var(--on-deep-secondary)]">
                <li className="flex items-start gap-2.5">
                  <MapPin
                    size={15}
                    aria-hidden="true"
                    className="mt-[3px] shrink-0"
                  />
                  {contact.city}
                </li>
                <li>
                  <a
                    href={mailto}
                    className="group/mail flex items-start gap-2.5 transition-colors duration-300 hover:text-white"
                  >
                    <EnvelopeSimple
                      size={15}
                      aria-hidden="true"
                      className="mt-[3px] shrink-0"
                    />
                    {contact.email}
                    <ArrowUpRight
                      size={12}
                      aria-hidden="true"
                      className="mt-[4px] shrink-0 opacity-0 transition-opacity duration-300 group-hover/mail:opacity-100"
                    />
                  </a>
                </li>
                {/* Le bloc téléphone n'apparaît que si le numéro est fourni. */}
                {contact.phone !== '' && (
                  <li>
                    <a
                      href={`tel:${contact.phone.replace(/\s/g, '')}`}
                      className="flex items-start gap-2.5 transition-colors duration-300 hover:text-white"
                    >
                      <Phone
                        size={15}
                        aria-hidden="true"
                        className="mt-[3px] shrink-0"
                      />
                      {contact.phone}
                    </a>
                  </li>
                )}
              </ul>

              {activeSocial.length > 0 && (
                <ul className="mt-6 flex list-none items-center gap-2">
                  {activeSocial.map((link) => {
                    const Icon =
                      SOCIAL_ICONS[link.id as keyof typeof SOCIAL_ICONS]
                    return (
                      <li key={link.id}>
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noreferrer noopener"
                          aria-label={link.label}
                          className="grid size-10 place-items-center rounded-[var(--radius-field)] border border-[var(--on-deep-line)] text-[var(--on-deep-secondary)] transition-colors duration-300 hover:border-[var(--accent)] hover:text-white"
                        >
                          <Icon size={16} />
                        </a>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* --- Mentions ---------------------------------------------------- */}
        <div className="flex flex-col-reverse gap-4 border-t border-[var(--on-deep-line)] pt-7 text-[13px] text-[var(--on-deep-muted)] sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.legalName}. Tous droits réservés.
          </p>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {activeLegal.map((link) => (
              <a
                key={link.id}
                href={link.href}
                className="transition-colors duration-300 hover:text-white"
              >
                {link.label}
              </a>
            ))}
            <StudioCredit />
          </div>
        </div>
      </div>
    </footer>
  )
}
