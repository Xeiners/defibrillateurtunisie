import { useState } from 'react'
import { ArrowRight, Lightning } from '@phosphor-icons/react'
import { SplitWords } from '@/components/ui/SplitWords'
import { actions } from '@/data/site'
import { useLocale } from '@/i18n/LocaleProvider'

/** Illustration du sauveteur : `public/hero/sauveteur.webp` (ou .png / .jpg). */
const HERO_IMAGES = ['/hero/sauveteur.webp', '/hero/sauveteur.png', '/hero/sauveteur.jpg']

/**
 * L'appel : « devenez celui qui sauve ».
 *
 * Section charnière entre les gestes et les packs, tenue courte : le sauveteur
 * sur sa plaque blanche, et à sa droite un panneau rouge arrondi qui glisse
 * depuis le bord — le seul bloc de la page traité comme une affiche.
 *
 * Une seule action, formulée à la première personne : « je veux m'équiper ».
 * Elle ouvre la même fenêtre de devis que le reste de la page.
 *
 * Si le fichier manque, l'éclair prend sa place et la section tient debout.
 */
export function HeroCallSection() {
  const { locale } = useLocale()
  const [attempt, setAttempt] = useState(0)
  const image = HERO_IMAGES[attempt]

  return (
    <section className="overflow-x-clip bg-navy-50 py-10 sm:py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-stretch gap-4 px-4 sm:px-6 lg:flex-row lg:gap-6">
        <div
          data-anim="pop"
          className="grid shrink-0 place-items-center rounded-2xl bg-white p-4 lg:w-55"
        >
          {image ? (
            <img
              src={image}
              alt={locale === 'en' ? 'Hero silhouette with a red cape and a lightning-bolt heart on the chest' : 'Silhouette d’un héros, cape rouge et cœur avec un éclair sur la poitrine'}
              onError={() => setAttempt((current) => current + 1)}
              className="h-32 w-auto object-contain sm:h-40 lg:h-44"
            />
          ) : (
            <Lightning size={72} weight="fill" className="text-urgent-500" aria-hidden="true" />
          )}
        </div>

        <div
          data-anim="right"
          className="flex flex-1 flex-col justify-center gap-4 rounded-2xl bg-urgent-600 p-6 text-white sm:p-8 lg:flex-row lg:items-center lg:justify-between lg:gap-8"
        >
          <div className="max-w-xl">
            <h2
              data-anim="words"
              className="text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.08] font-bold tracking-[-0.03em]"
            >
              <span className="block">
                <SplitWords text={locale === 'en' ? 'Do not wait.' : 'N’attendez plus.'} />
              </span>
              <span className="block">
                <SplitWords text={locale === 'en' ? 'Be the one who saves a life.' : 'Devenez celui qui sauve.'} className="text-urgent-100" />
              </span>
            </h2>
            <p data-anim="up" className="mt-2.5 text-[14px] leading-relaxed text-urgent-50 sm:text-[15px]">
              {locale === 'en' ? 'There are no heroes: only people who had the right device, in the right place, at the right time.' : 'Il n’y a pas de héros : seulement des gens qui avaient le bon appareil, au bon endroit, au bon moment.'}
            </p>
          </div>

          <a
            href={actions.quote.href}
            className="group inline-flex h-11 shrink-0 items-center justify-center gap-2 self-start rounded-md bg-white px-5 text-[14px] font-semibold text-urgent-700 transition-colors hover:bg-urgent-50 lg:self-auto"
          >
            {locale === 'en' ? 'I want to get equipped' : 'Je veux m’équiper'}
            <ArrowRight size={15} weight="bold" className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  )
}
