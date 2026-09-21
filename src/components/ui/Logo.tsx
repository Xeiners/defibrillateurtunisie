import { site } from '@/data/site'
import { cn } from '@/lib/cn'
import { useLocale } from '@/i18n/LocaleProvider'

type LogoProps = {
  /** `dark` = posé sur fond sombre, `light` = posé sur fond clair. */
  tone?: 'dark' | 'light'
  className?: string
}

/**
 * Sigle + nom de domaine. Le `.TN` prend le rouge d'action : il rattache le
 * nom au pays, qui est l'argument central de l'offre.
 */
export function Logo({ tone = 'light', className }: LogoProps) {
  const { locale } = useLocale()
  return (
    <a
      href="/#top"
      aria-label={`${site.name}, ${locale === 'en' ? 'back to home' : 'retour à l’accueil'}`}
      className={cn(
        'inline-flex items-center gap-2 transition-opacity duration-300 hover:opacity-80',
        tone === 'dark' ? 'text-white' : 'text-navy-950',
        className,
      )}
    >
      <img
        src="/favicon.svg"
        alt=""
        aria-hidden="true"
        width={30}
        height={30}
        className="size-7.5 shrink-0"
      />
      <span className="flex items-baseline text-[15px] leading-none font-bold tracking-[-0.02em] whitespace-nowrap sm:text-[16px]">
        {site.wordmark.lead}
        <span className={tone === 'dark' ? 'text-urgent-400' : 'text-urgent-600'}>
          {site.wordmark.trail}
        </span>
      </span>
    </a>
  )
}
