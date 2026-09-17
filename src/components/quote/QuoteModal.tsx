import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { ArrowRight, Check, CheckCircle, X } from '@phosphor-icons/react'
import { TunisiaFlag } from '@/components/ui/TunisiaFlag'
import { sectors } from '@/data/landing'
import { CURRENCY, HEADLINE_PRICE, packs } from '@/data/pricing'
import { contact } from '@/data/site'
import { cn } from '@/lib/cn'

const ARGUMENTS = [
  'Sans engagement, devis gratuit',
  'Installation partout en Tunisie',
  'Maintenance et consommables inclus',
  'Formation de vos équipes',
]

/**
 * Demande de devis, en fenêtre.
 *
 * TODO client : le formulaire N'ENVOIE RIEN. Il est là pour la démonstration —
 * l'écran de confirmation s'affiche sans qu'aucune donnée ne parte. Brancher
 * l'envoi (API ou service de formulaire) avant mise en ligne.
 *
 * Elle reste MONTÉE en permanence et se cache par opacité : on obtient ainsi
 * l'animation d'entrée comme de sortie sans machine d'états. `inert` retire le
 * contenu du clavier et des lecteurs d'écran quand elle est fermée.
 */
export function QuoteModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [isSent, setIsSent] = useState(false)
  const closeRef = useRef<HTMLButtonElement>(null)
  const firstFieldRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!isOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeyDown)
    // Le premier champ plutôt que la croix : on ouvre pour remplir.
    window.setTimeout(() => firstFieldRef.current?.focus(), 80)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [isOpen, onClose])

  // La confirmation se réarme à la fermeture, pour la prochaine ouverture.
  useEffect(() => {
    if (isOpen) return
    const timer = window.setTimeout(() => setIsSent(false), 300)
    return () => window.clearTimeout(timer)
  }, [isOpen])

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    setIsSent(true)
  }

  return (
    <div
      data-open={isOpen}
      inert={!isOpen}
      className="fixed inset-0 z-70 flex items-end justify-center opacity-0 transition-opacity duration-300 data-[open=false]:pointer-events-none data-[open=true]:opacity-100 sm:items-center sm:p-6"
    >
      <button
        type="button"
        tabIndex={-1}
        aria-hidden="true"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-navy-950/70 backdrop-blur-sm"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="devis-titre"
        data-open={isOpen}
        className="relative flex max-h-[92svh] w-full max-w-4xl translate-y-6 flex-col overflow-hidden rounded-t-2xl bg-white shadow-(--shadow-float) transition-transform duration-400 ease-out-expo data-[open=true]:translate-y-0 sm:rounded-2xl lg:flex-row"
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Fermer la demande de devis"
          className="absolute top-3 right-3 z-10 grid size-9 place-items-center rounded-md text-navy-400 transition-colors hover:bg-navy-50 hover:text-navy-950 lg:text-white lg:hover:bg-white/15 lg:hover:text-white"
        >
          <X size={16} weight="bold" />
        </button>

        {/* Colonne d'arguments : pourquoi remplir ce formulaire. */}
        <aside className="on-dark hidden shrink-0 flex-col justify-between bg-navy-950 p-8 text-white lg:flex lg:w-[300px]">
          <div>
            <p className="flex items-center gap-2 text-[11px] font-bold tracking-[0.14em] text-urgent-400 uppercase">
              <TunisiaFlag className="h-3 w-auto" />
              Devis gratuit
            </p>
            <p className="mt-4 text-[24px] leading-tight font-bold">
              Un défibrillateur chez vous, dès{' '}
              <span className="text-urgent-400">
                {HEADLINE_PRICE} {CURRENCY}
              </span>
              /mois.
            </p>

            <ul className="mt-6 flex list-none flex-col gap-2.5">
              {ARGUMENTS.map((item) => (
                <li key={item} className="flex items-start gap-2 text-[13px] leading-snug text-navy-200">
                  <Check size={14} weight="bold" className="mt-0.5 shrink-0 text-brand-400" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-8 text-[12px] leading-relaxed text-navy-400">
            Une question avant ?{' '}
            <a href={`mailto:${contact.email}`} className="text-white underline underline-offset-2">
              {contact.email}
            </a>
          </p>
        </aside>

        {/* Formulaire, ou confirmation une fois envoyé. */}
        <div className="min-h-0 flex-1 overflow-y-auto p-6 sm:p-8">
          {isSent ? (
            <div className="flex h-full min-h-[340px] flex-col items-center justify-center text-center">
              <span className="animate-pop grid size-14 place-items-center rounded-full bg-brand-50 text-brand-700">
                <CheckCircle size={30} weight="fill" aria-hidden="true" />
              </span>
              <p className="mt-5 text-[22px] font-bold text-navy-950">Demande enregistrée</p>
              <p className="mt-2 max-w-sm text-[14px] leading-relaxed text-navy-500">
                Un conseiller vous recontacte avec une proposition chiffrée pour
                votre établissement.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-6 inline-flex h-11 items-center rounded-md bg-navy-950 px-5 text-[14px] font-semibold text-white transition-colors hover:bg-navy-800"
              >
                Fermer
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit}>
              <h2 id="devis-titre" className="text-[22px] leading-tight font-bold text-navy-950 sm:text-[26px]">
                Demander un devis
              </h2>
              <p className="mt-1.5 text-[14px] text-navy-500">
                Deux minutes suffisent. Nous revenons vers vous avec une
                proposition adaptée à votre site.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <Field label="Établissement" className="sm:col-span-2">
                  <input
                    ref={firstFieldRef}
                    type="text"
                    name="etablissement"
                    autoComplete="organization"
                    placeholder="Nom de votre établissement"
                    className={FIELD_CLASS}
                  />
                </Field>

                <Field label="Nom et prénom">
                  <input type="text" name="nom" autoComplete="name" placeholder="Votre nom" className={FIELD_CLASS} />
                </Field>

                <Field label="Téléphone">
                  <input type="tel" name="telephone" autoComplete="tel" placeholder="+216 …" className={FIELD_CLASS} />
                </Field>

                <Field label="E-mail">
                  <input type="email" name="email" autoComplete="email" placeholder="vous@exemple.tn" className={FIELD_CLASS} />
                </Field>

                <Field label="Ville">
                  <input type="text" name="ville" autoComplete="address-level2" placeholder="Tunis, Sousse…" className={FIELD_CLASS} />
                </Field>

                <Field label="Type de lieu">
                  <select name="secteur" className={FIELD_CLASS} defaultValue="">
                    <option value="" disabled>
                      Choisir…
                    </option>
                    {sectors.map((sector) => (
                      <option key={sector.id} value={sector.id}>
                        {sector.label}
                      </option>
                    ))}
                    <option value="autre">Autre</option>
                  </select>
                </Field>

                <Field label="Pack souhaité">
                  <select name="pack" className={FIELD_CLASS} defaultValue="">
                    <option value="" disabled>
                      Choisir…
                    </option>
                    {packs.map((pack) => (
                      <option key={pack.id} value={pack.id}>
                        {pack.name} · {pack.device}
                      </option>
                    ))}
                    <option value="conseil">Je ne sais pas encore</option>
                  </select>
                </Field>

                <Field label="Nombre d’appareils">
                  <input type="number" name="appareils" min={1} defaultValue={1} className={FIELD_CLASS} />
                </Field>

                <Field label="Précisions (facultatif)" className="sm:col-span-2">
                  <textarea
                    name="message"
                    rows={3}
                    placeholder="Surface du site, nombre de bâtiments, délai souhaité…"
                    className={cn(FIELD_CLASS, 'h-auto min-h-22 resize-none py-2.5')}
                  />
                </Field>
              </div>

              <button
                type="submit"
                className="group mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-urgent-600 px-6 text-[15px] font-semibold text-white transition-colors hover:bg-urgent-700 sm:w-auto"
              >
                Envoyer ma demande
                <ArrowRight size={16} weight="bold" className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </button>

              <p className="mt-3 text-[12px] text-navy-400">
                Vos coordonnées servent uniquement à établir ce devis.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

const FIELD_CLASS =
  'h-11 w-full rounded-md border border-navy-200 bg-white px-3 text-[14px] text-navy-950 transition-colors placeholder:text-navy-300 focus:border-urgent-600 focus:outline-none'

function Field({
  label,
  className,
  children,
}: {
  label: string
  className?: string
  children: ReactNode
}) {
  return (
    <label className={cn('flex flex-col gap-1.5', className)}>
      <span className="text-[12px] font-semibold text-navy-600">{label}</span>
      {children}
    </label>
  )
}
