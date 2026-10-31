import { useState } from 'react'
import { ArrowRight, CaretRight, EnvelopeSimple } from '@phosphor-icons/react'
import { FaqItem } from '@/components/sections/faq/FaqSection'
import { Button } from '@/components/ui/Button'
import { SplitWords } from '@/components/ui/SplitWords'
import { faqCategories } from '@/data/faq'
import { actions, contact } from '@/data/site'
import { useLocale } from '@/i18n/LocaleProvider'

/**
 * La page FAQ, `/faq`.
 *
 * Même composition que la section de l'accueil — colonne de titre à gauche,
 * questions dépliables à droite — mais rangée par thème. La colonne de gauche
 * devient un sommaire collé en vue : on saute au thème qui nous concerne au
 * lieu de dérouler trente réponses.
 *
 * Une seule réponse ouverte à la fois sur TOUTE la page, comme sur l'accueil.
 */
export function FaqPage() {
  const { locale, t } = useLocale()
  const [openId, setOpenId] = useState<string | null>(faqCategories[0].entries[0].id)
  const questionCount = faqCategories.reduce((total, category) => total + category.entries.length, 0)

  return (
    <section className="bg-navy-50 pt-7 pb-14 sm:pt-9 sm:pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <nav aria-label={locale === 'en' ? 'Breadcrumb' : 'Fil d’Ariane'}>
          <ol className="flex list-none items-center gap-1.5 text-[12.5px] text-navy-400">
            <li>
              <a href="/" className="transition-colors duration-200 hover:text-navy-900">
                {locale === 'en' ? 'Home' : 'Accueil'}
              </a>
            </li>
            <li aria-hidden="true" className="flex items-center">
              <CaretRight size={11} weight="bold" />
            </li>
            <li aria-current="page" className="font-semibold text-navy-900">
              FAQ
            </li>
          </ol>
        </nav>

        <h1
          data-anim="words"
          className="mt-4 text-[clamp(1.875rem,3.6vw,2.75rem)] leading-[1.1] font-bold tracking-[-0.03em] text-navy-950"
        >
          <SplitWords text={locale === 'en' ? 'Frequently asked' : 'Questions'} />{' '}
          <SplitWords text={locale === 'en' ? 'questions.' : 'fréquentes.'} className="text-urgent-600" />
        </h1>

        <p data-anim="up" data-delay="0.15" className="mt-3 max-w-2xl text-[16px] leading-relaxed text-navy-500 sm:text-[17px]">
          {locale === 'en'
            ? `Everything you need to know before getting equipped: ${questionCount} answers, sorted by topic.`
            : `Tout ce qu’il faut savoir avant de vous équiper : ${questionCount} réponses, rangées par thème.`}
        </p>
      </div>

      {/*
        La colonne de gauche est l'élément de grille LUI-MÊME, aligné en haut :
        c'est ce qui lui laisse une course pour rester collée sous la barre.
        Elle reste étroite et discrète : ce sont les réponses, à droite, sur
        leurs cartes blanches, qui portent la page.
      */}
      <div className="mx-auto mt-8 grid max-w-7xl gap-8 px-4 sm:px-6 lg:mt-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.6fr)] lg:gap-10">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <nav aria-label={locale === 'en' ? 'Topics' : 'Thèmes'}>
            <p
              data-anim="left"
              className="flex items-center gap-3 text-[12px] font-semibold tracking-[0.12em] text-navy-400 uppercase"
            >
              <span aria-hidden="true" className="h-px w-6 bg-urgent-500" />
              {locale === 'en' ? 'Topics' : 'Thèmes'}
            </p>
            <ol data-anim="stagger" className="mt-3 flex list-none flex-wrap gap-2 lg:flex-col lg:gap-0">
              {faqCategories.map((category, index) => (
                <li key={category.id}>
                  <a
                    href={`#${category.id}`}
                    className="group flex items-center gap-3 rounded-md border border-navy-200 bg-white px-3.5 py-2 text-[15px] font-semibold text-navy-800 transition-colors hover:text-urgent-700 lg:border-0 lg:bg-transparent lg:px-0 lg:py-2.5 lg:text-[16px]"
                  >
                    <span aria-hidden="true" className="hidden w-6 text-[13px] font-bold text-navy-400 tabular-nums lg:inline">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    {t(category.title)}
                    <span aria-hidden="true" className="text-[13px] font-medium text-navy-400">
                      {category.entries.length}
                    </span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div data-anim="up" className="mt-6 hidden rounded-lg border border-navy-200 bg-white p-5 lg:block">
            <p className="text-[16px] font-bold text-navy-950">
              {locale === 'en' ? 'Another question?' : 'Une autre question ?'}
            </p>
            <p className="mt-1 text-[14.5px] leading-relaxed text-navy-500">
              {locale === 'en'
                ? 'An adviser answers you within one business day.'
                : 'Un conseiller vous répond sous 24 h ouvrées.'}
            </p>
            <a
              href={`mailto:${contact.email}`}
              className="mt-3 flex items-center gap-2 text-[14px] font-semibold text-navy-800 transition-colors hover:text-urgent-700"
            >
              <EnvelopeSimple size={16} aria-hidden="true" className="shrink-0" />
              {contact.email}
            </a>
            <Button href={actions.quote.href} size="sm" withArrow className="mt-4 w-full">
              {t(actions.quote.label)}
            </Button>
          </div>
        </aside>

        <div className="flex flex-col gap-6 sm:gap-8">
          {faqCategories.map((category, index) => (
            <section
              key={category.id}
              id={category.id}
              aria-labelledby={`theme-${category.id}`}
              className="rounded-xl border border-navy-100 bg-white px-5 pt-6 pb-2 shadow-[0_18px_40px_-28px_rgb(7_18_36/0.35)] sm:px-8 sm:pt-8"
            >
              <p
                aria-hidden="true"
                className="text-[12px] font-bold tracking-[0.12em] text-urgent-600 tabular-nums uppercase"
              >
                {String(index + 1).padStart(2, '0')}
              </p>
              <h2
                id={`theme-${category.id}`}
                data-anim="up"
                className="mt-1 text-[clamp(1.375rem,2.4vw,1.875rem)] leading-tight font-bold tracking-[-0.02em] text-navy-950"
              >
                {t(category.title)}
              </h2>
              <p data-anim="up" className="mt-2 text-[15.5px] leading-relaxed text-navy-500 sm:text-[16.5px]">
                {t(category.intro)}
              </p>

              <div data-anim="stagger" className="mt-4 border-t border-navy-100">
                {category.entries.map((entry) => (
                  <FaqItem
                    key={entry.id}
                    entry={entry}
                    size="lg"
                    isOpen={openId === entry.id}
                    onToggle={() => setOpenId((current) => (current === entry.id ? null : entry.id))}
                  />
                ))}
              </div>
            </section>
          ))}

          {/* Sous `lg`, l'encart de contact n'est plus collé à gauche : il clôt la liste. */}
          <a
            href={actions.quote.href}
            className="group inline-flex items-center gap-1.5 text-[15px] font-semibold text-urgent-600 lg:hidden"
          >
            {locale === 'en' ? 'Another question? Contact us' : 'Une autre question ? Écrivez-nous'}
            <ArrowRight size={14} weight="bold" className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  )
}
