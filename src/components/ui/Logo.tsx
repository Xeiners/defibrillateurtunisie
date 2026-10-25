import { site } from '@/data/site'
import { cn } from '@/lib/cn'
import { useLocale } from '@/i18n/LocaleProvider'

type LogoProps = {
  /** `dark` = posé sur fond sombre, `light` = posé sur fond clair. */
  tone?: 'dark' | 'light'
  className?: string
}

/**
 * Le logo officiel, cœur et nom réunis dans un seul SVG.
 *
 * Deux fichiers, une seule source : la variante `-blanc` ne change que la
 * couleur du texte, noir sur fond clair, blanc sur fond sombre.
 */
export function Logo({ tone = 'light', className }: LogoProps) {
  const { locale } = useLocale()
  return (
    <a
      href="/#top"
      aria-label={`${site.name}, ${locale === 'en' ? 'back to home' : 'retour à l’accueil'}`}
      className={cn('inline-flex items-center transition-opacity duration-300 hover:opacity-80', className)}
    >
      <img
        src={tone === 'dark' ? '/logo-defibrillateur-tn-blanc.svg' : '/logo-defibrillateur-tn.svg'}
        alt=""
        aria-hidden="true"
        width={147}
        height={36}
        className="h-9 w-auto shrink-0 sm:h-10"
      />
    </a>
  )
}
