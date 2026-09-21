import { cn } from '@/lib/cn'
import { useLocale } from '@/i18n/LocaleProvider'

/**
 * Drapeau tunisien dessiné en SVG : l'émoji 🇹🇳 ne s'affiche pas sous Windows,
 * où il retombe sur les lettres « TN ».
 */
export function TunisiaFlag({ className }: { className?: string }) {
  const { locale } = useLocale()
  return (
    <svg
      viewBox="0 0 30 20"
      role="img"
      aria-label={locale === 'en' ? 'Flag of Tunisia' : 'Drapeau de la Tunisie'}
      className={cn('shrink-0 overflow-hidden rounded-[2px] ring-1 ring-navy-950/10', className)}
    >
      <rect width="30" height="20" fill="#e70013" />
      <circle cx="15" cy="10" r="5" fill="#fff" />
      <circle cx="15" cy="10" r="3.75" fill="#e70013" />
      <circle cx="15.95" cy="10" r="3" fill="#fff" />
      <polygon
        points="16.30,7.90 16.80,9.31 18.30,9.35 17.11,10.26 17.53,11.70 16.30,10.85 15.07,11.70 15.49,10.26 14.30,9.35 15.80,9.31"
        fill="#e70013"
      />
    </svg>
  )
}
