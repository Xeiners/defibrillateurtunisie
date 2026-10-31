import { site } from '@/data/site'
import { cn } from '@/lib/cn'
import { useLocale } from '@/i18n/LocaleProvider'

type LogoProps = {
  /** `dark` = posé sur fond sombre, `light` = posé sur fond clair. */
  tone?: 'dark' | 'light'
  /** `lg` = la version agrandie, celle de la barre de navigation. */
  size?: 'md' | 'lg'
  className?: string
}

/**
 * Le logo officiel, cœur et nom réunis dans un seul SVG.
 *
 * Deux fichiers, une seule source : la variante `-blanc` ne change que la
 * couleur du texte, noir sur fond clair, blanc sur fond sombre.
 */
export function Logo({ tone = 'light', size = 'md', className }: LogoProps) {
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
        width={103}
        height={19}
        // Le logo est très allongé (5,4:1) : sa hauteur suffit à fixer sa
        // largeur. En mobile, 32 px de haut en font déjà 175 de large, la place
        // laissée par le téléphone, la langue et le menu.
        className={cn('w-auto shrink-0', size === 'lg' ? 'h-8 sm:h-10 lg:h-11' : 'h-8 sm:h-9')}
      />
    </a>
  )
}
