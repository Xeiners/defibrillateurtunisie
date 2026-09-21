import { useRef, useState, type FormEvent, type ReactNode, type Ref } from 'react'
import {
  ArrowRight,
  Buildings,
  CheckCircle,
  CircleNotch,
  ClipboardText,
  UserCircle,
  WarningCircle,
} from '@phosphor-icons/react'
import { sectors } from '@/data/landing'
import { CURRENCY, basePrice, packs } from '@/data/pricing'
import { contact } from '@/data/site'
import { cn } from '@/lib/cn'
import { sendQuote, type QuotePackLine } from '@/services/quoteMailer'
import { useQuote, type QuoteLine } from '@/store/quote-context'
import { useLocale } from '@/i18n/LocaleProvider'

const FIELD_CLASS =
  'h-11 w-full rounded-md border border-navy-200 bg-white px-3 text-[14px] text-navy-950 transition-colors duration-200 placeholder:text-navy-300 hover:border-navy-300 focus:border-urgent-600 focus:outline-none'

/** Échéances proposées : elles disent au commercial par quoi commencer. */
const DEADLINES = [
  { value: 'urgent', label: 'Dès que possible' },
  { value: 'mois', label: 'Dans le mois' },
  { value: 'trimestre', label: 'Dans les trois mois' },
  { value: 'renseignement', label: 'Je me renseigne' },
]

/**
 * Le formulaire de demande de devis.
 *
 * Il envoie à `@/services/quoteMailer`, qui poste vers le service de `server/`.
 * Le MAIL est composé côté serveur : le navigateur n'envoie que des données.
 *
 * La validation des champs est celle du navigateur (`required`,
 * `type="email"`) : elle est traduite, accessible, et ne demande aucun état
 * supplémentaire. Le seul état tenu ici est celui de l'envoi.
 */
export function QuoteForm({ className }: { className?: string }) {
  const { locale, t } = useLocale()
  const { lines, monthlyTotal, clear } = useQuote()
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')
  const [error, setError] = useState<string | null>(null)
  // Ce qui a été envoyé, figé au moment de l'envoi : la sélection est vidée
  // juste après, mais l'écran de confirmation doit encore pouvoir la montrer.
  const [sent, setSent] = useState<{ lines: QuoteLine[]; monthlyTotal: number; email: string }>({
    lines: [],
    monthlyTotal: 0,
    email: '',
  })
  const confirmationRef = useRef<HTMLDivElement>(null)

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (status === 'sending') return

    const data = new FormData(event.currentTarget)
    const field = (name: string) => String(data.get(name) ?? '').trim()

    setStatus('sending')
    setError(null)

    try {
      await sendQuote({
        etablissement: field('etablissement'),
        secteur: labelOfSector(field('secteur'), t, locale),
        ville: field('ville'),
        nom: field('nom'),
        telephone: field('telephone'),
        email: field('email'),
        echeance: labelOfDeadline(field('echeance'), t),
        message: field('message'),
        piege: field('site-web'),
        packs: lines.map((line) => toPackLine(line, t)).filter((line) => line !== null),
        monthlyTotal,
      })

      setSent({ lines, monthlyTotal, email: field('email') })
      setStatus('sent')
      // La demande est partie : la sélection a fait son office. La garder, ce
      // serait retrouver les mêmes packs au prochain passage sur les offres, et
      // risquer de renvoyer deux fois la même demande.
      clear()
      // La confirmation remplace le formulaire : on y amène le regard.
      window.requestAnimationFrame(() =>
        confirmationRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' }),
      )
    } catch {
      setStatus('idle')
      setError(
        locale === 'en' ? 'Your request could not be sent. Please try again shortly or email us directly.' : 'L’envoi n’a pas abouti. Réessayez dans un instant, ou écrivez-nous directement.',
      )
    }
  }

  if (status === 'sent') {
    return (
      <Confirmation
        ref={confirmationRef}
        className={className}
        lines={sent.lines}
        monthlyTotal={sent.monthlyTotal}
        sentTo={sent.email}
      />
    )
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate={false}
      className={cn(
        'relative rounded-2xl border border-navy-100 bg-white p-5 shadow-(--shadow-card) sm:p-7',
        className,
      )}
    >
      {/* Champ piège, hors du champ de vision et hors du parcours clavier :
          un humain ne le voit pas, un robot le remplit. Le serveur répond
          « reçu » et jette, sans rien envoyer. */}
      <div aria-hidden="true" className="pointer-events-none absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          {locale === 'en' ? 'Do not fill in this field' : 'Ne remplissez pas ce champ'}
          <input type="text" name="site-web" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <FieldGroup
        icon={<Buildings size={17} weight="bold" aria-hidden="true" />}
        title={locale === 'en' ? 'Your organisation' : 'Votre établissement'}
        hint={locale === 'en' ? 'To determine the right installation.' : 'Pour dimensionner l’installation.'}
      >
        <Field label={locale === 'en' ? 'Organisation name' : 'Nom de l’établissement'} required className="sm:col-span-2">
          <input
            type="text"
            name="etablissement"
            required
            autoComplete="organization"
            placeholder={locale === 'en' ? 'El Manar Clinic, Bourguiba School…' : 'Clinique El Manar, Lycée Bourguiba…'}
            className={FIELD_CLASS}
          />
        </Field>

        <Field label={locale === 'en' ? 'Type of premises' : 'Type de lieu'} required>
          <select name="secteur" required className={FIELD_CLASS} defaultValue="">
            <option value="" disabled>
              {locale === 'en' ? 'Select…' : 'Choisir…'}
            </option>
            {sectors.map((sector) => (
              <option key={sector.id} value={sector.id}>
                {t(sector.label)}
              </option>
            ))}
            <option value="autre">{locale === 'en' ? 'Other' : 'Autre'}</option>
          </select>
        </Field>

        <Field label={locale === 'en' ? 'City' : 'Ville'} required>
          <input
            type="text"
            name="ville"
            required
            autoComplete="address-level2"
            placeholder="Tunis, Sousse, Sfax…"
            className={FIELD_CLASS}
          />
        </Field>
      </FieldGroup>

      <FieldGroup
        icon={<UserCircle size={17} weight="bold" aria-hidden="true" />}
        title={locale === 'en' ? 'Your contact details' : 'Vous joindre'}
        hint={locale === 'en' ? 'An adviser will call you within one business day.' : 'Un conseiller vous rappelle sous 24 h ouvrées.'}
      >
        <Field label={locale === 'en' ? 'Full name' : 'Nom et prénom'} required className="sm:col-span-2">
          <input
            type="text"
            name="nom"
            required
            autoComplete="name"
            placeholder={locale === 'en' ? 'Your name' : 'Votre nom'}
            className={FIELD_CLASS}
          />
        </Field>

        <Field label={locale === 'en' ? 'Phone' : 'Téléphone'} required>
          <input
            type="tel"
            name="telephone"
            required
            autoComplete="tel"
            placeholder="+216 …"
            className={FIELD_CLASS}
          />
        </Field>

        <Field label="E-mail" required>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder={locale === 'en' ? 'you@example.com' : 'vous@exemple.tn'}
            className={FIELD_CLASS}
          />
        </Field>
      </FieldGroup>

      <FieldGroup
        icon={<ClipboardText size={17} weight="bold" aria-hidden="true" />}
        title={locale === 'en' ? 'Your project' : 'Votre projet'}
        hint={locale === 'en' ? 'Optional, but it helps us prepare your quote faster.' : 'Facultatif, mais cela accélère le chiffrage.'}
      >
        <Field label={locale === 'en' ? 'Preferred timeframe' : 'Échéance souhaitée'} className="sm:col-span-2">
          <select name="echeance" className={FIELD_CLASS} defaultValue="mois">
            {DEADLINES.map((deadline) => (
              <option key={deadline.value} value={deadline.value}>
                {t(deadline.label)}
              </option>
            ))}
          </select>
        </Field>

        <Field label={locale === 'en' ? 'Additional details' : 'Précisions'} className="sm:col-span-2">
          <textarea
            name="message"
            rows={4}
            placeholder={locale === 'en' ? 'Site area, number of buildings, floors, access constraints…' : 'Surface du site, nombre de bâtiments, étages, contraintes d’accès…'}
            className={cn(FIELD_CLASS, 'h-auto min-h-26 resize-y py-2.5 leading-relaxed')}
          />
        </Field>
      </FieldGroup>

      {error !== null && (
        <p
          role="alert"
          className="animate-rise mt-6 flex items-start gap-2.5 rounded-md border border-urgent-200 bg-urgent-50 px-4 py-3 text-[13.5px] leading-snug text-urgent-800"
        >
          <WarningCircle size={17} weight="fill" className="mt-px shrink-0 text-urgent-600" aria-hidden="true" />
          <span>
            {error}{' '}
            <a href={`mailto:${contact.email}`} className="font-semibold underline underline-offset-2">
              {contact.email}
            </a>
          </span>
        </p>
      )}

      <div className="mt-7 flex flex-col gap-3 border-t border-navy-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={status === 'sending'}
          className="group inline-flex h-12 items-center justify-center gap-2 rounded-md bg-urgent-600 px-6 text-[15px] font-semibold text-white transition-[background-color,translate,scale] duration-300 hover:bg-urgent-700 active:scale-[0.98] disabled:cursor-wait disabled:bg-urgent-700"
        >
          {status === 'sending' ? (
            <>
              {locale === 'en' ? 'Sending…' : 'Envoi en cours…'}
              <CircleNotch size={16} weight="bold" className="animate-spin" aria-hidden="true" />
            </>
          ) : (
            <>
              {locale === 'en' ? 'Send my request' : 'Envoyer ma demande'}
              <ArrowRight
                size={16}
                weight="bold"
                className="transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </>
          )}
        </button>

        <p className="text-[12px] leading-snug text-navy-400">
          {locale === 'en' ? <>No commitment. Your details are used only<br className="hidden sm:block" /> to prepare this quote.</> : <>Sans engagement. Vos coordonnées servent uniquement<br className="hidden sm:block" /> à établir ce devis.</>}
        </p>
      </div>
    </form>
  )
}

/**
 * Une ligne de sélection, prête pour le mail.
 *
 * Les libellés et les prix sont relus dans la grille : ce qui part est ce que
 * le site affiche, pas ce qui traînait dans le stockage du navigateur.
 */
function toPackLine(line: QuoteLine, t: (text: string) => string): QuotePackLine | null {
  const pack = packs.find((item) => item.id === line.packId)
  if (!pack) return null

  const term = pack.terms.find((option) => option.months === line.months)
  return {
    name: t(pack.name),
    device: pack.device,
    months: line.months,
    quantity: line.quantity,
    monthly: term ? term.monthly : basePrice(pack),
  }
}

/** Le commercial lit « Cliniques », pas « sante ». */
function labelOfSector(id: string, t: (text: string) => string, locale: 'fr' | 'en') {
  const label = sectors.find((sector) => sector.id === id)?.label
  return label ? t(label) : (id === 'autre' ? (locale === 'en' ? 'Other' : 'Autre') : id)
}

function labelOfDeadline(value: string, t: (text: string) => string) {
  const label = DEADLINES.find((deadline) => deadline.value === value)?.label
  return label ? t(label) : value
}

type ConfirmationProps = {
  ref: Ref<HTMLDivElement>
  className?: string
  lines: QuoteLine[]
  monthlyTotal: number
  /** Adresse à laquelle le récapitulatif vient de partir. */
  sentTo: string
}

/** Accusé de réception : ce qui a été demandé, et ce qui se passe ensuite. */
function Confirmation({ ref, className, lines, monthlyTotal, sentTo }: ConfirmationProps) {
  const { locale, t } = useLocale()
  return (
    <div
      ref={ref}
      className={cn(
        'rounded-2xl border border-navy-100 bg-white p-6 text-center shadow-(--shadow-card) sm:p-10',
        className,
      )}
    >
      <span className="animate-pop mx-auto grid size-16 place-items-center rounded-full bg-brand-50 text-brand-700">
        <CheckCircle size={34} weight="fill" aria-hidden="true" />
      </span>

      <h2 className="mt-5 text-[24px] leading-tight font-bold text-navy-950">
        {locale === 'en' ? 'Request received' : 'Demande enregistrée'}
      </h2>
      <p className="mx-auto mt-2 max-w-md text-[14.5px] leading-relaxed text-navy-500">
        {locale === 'en' ? 'An adviser will contact you within one business day with a tailored quote for your organisation.' : 'Un conseiller vous recontacte sous 24 h ouvrées avec une proposition chiffrée pour votre établissement.'}
      </p>
      {/* Dire OÙ part le récapitulatif : une faute de frappe dans l'adresse se
          voit ici, avant que le visiteur n'attende un mail qui ne viendra pas. */}
      {sentTo !== '' && (
        <p className="mx-auto mt-3 max-w-md text-[13.5px] leading-relaxed text-navy-500">
          {locale === 'en' ? 'A summary has just been sent to' : 'Un récapitulatif vient de partir à'}{' '}
          <strong className="font-semibold break-all text-navy-900">{sentTo}</strong>.
        </p>
      )}

      {lines.length > 0 && (
        <div className="mx-auto mt-6 max-w-md rounded-xl border border-navy-100 bg-navy-50 p-4 text-left">
          <p className="text-[12px] font-bold tracking-[0.12em] text-navy-500 uppercase">
            {locale === 'en' ? 'Your request' : 'Votre demande'}
          </p>
          <ul className="mt-2.5 flex list-none flex-col gap-1.5">
            {lines.map((line) => {
              const pack = packs.find((item) => item.id === line.packId)
              if (!pack) return null
              return (
                <li key={line.packId} className="flex justify-between gap-3 text-[13.5px]">
                  <span className="text-navy-700">
                    {line.quantity} × {locale === 'en' ? 'Package' : 'Pack'} {t(pack.name)}
                  </span>
                  <span className="shrink-0 text-navy-400">{line.months} {locale === 'en' ? 'months' : 'mois'}</span>
                </li>
              )
            })}
          </ul>
          <p className="mt-3 flex items-baseline justify-between gap-3 border-t border-navy-200 pt-2.5">
            <span className="text-[13px] font-semibold text-navy-600">{locale === 'en' ? 'Estimate' : 'Estimation'}</span>
            <span className="tabular text-[17px] font-bold text-navy-950">
              {monthlyTotal} {CURRENCY}/{locale === 'en' ? 'month' : 'mois'}
            </span>
          </p>
        </div>
      )}

      <div className="mt-6 flex flex-wrap justify-center gap-2.5">
        <a
          href="/"
          className="inline-flex h-11 items-center rounded-md bg-navy-950 px-5 text-[14px] font-semibold text-white transition-colors duration-300 hover:bg-navy-800"
        >
          {locale === 'en' ? 'Back to home' : 'Retour à l’accueil'}
        </a>
        <a
          href={`mailto:${contact.email}`}
          className="inline-flex h-11 items-center rounded-md border border-navy-200 px-5 text-[14px] font-semibold text-navy-900 transition-colors duration-300 hover:border-navy-900"
        >
          {contact.email}
        </a>
      </div>
    </div>
  )
}

type FieldGroupProps = {
  icon: ReactNode
  title: string
  hint: string
  children: ReactNode
}

/** Un bloc de champs, annoncé par son titre : le formulaire se lit en trois temps. */
function FieldGroup({ icon, title, hint, children }: FieldGroupProps) {
  return (
    <fieldset className="mt-7 border-0 p-0 first:mt-0">
      <legend className="flex items-center gap-2.5 p-0">
        <span className="grid size-8 shrink-0 place-items-center rounded-md bg-navy-950 text-white">
          {icon}
        </span>
        <span>
          <span className="block text-[15px] font-bold text-navy-950">{title}</span>
          <span className="block text-[12.5px] text-navy-400">{hint}</span>
        </span>
      </legend>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">{children}</div>
    </fieldset>
  )
}

type FieldProps = {
  label: string
  required?: boolean
  className?: string
  children: ReactNode
}

function Field({ label, required, className, children }: FieldProps) {
  return (
    <label className={cn('flex flex-col gap-1.5', className)}>
      <span className="text-[12px] font-semibold text-navy-600">
        {label}
        {required && (
          <span className="text-urgent-600" aria-hidden="true">
            {' '}
            *
          </span>
        )}
      </span>
      {children}
    </label>
  )
}
