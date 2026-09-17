import { SplitWords } from '@/components/ui/SplitWords'
import { cn } from '@/lib/cn'

type SectionTitleProps = {
  label: string
  title: string
  /** Fin du titre, passée en rouge. */
  accent?: string
  intro?: string
  tone?: 'light' | 'dark'
  className?: string
}

/** Titre de section : surtitre, titre révélé mot à mot, une phrase au plus. */
export function SectionTitle({
  label,
  title,
  accent,
  intro,
  tone = 'light',
  className,
}: SectionTitleProps) {
  const isDark = tone === 'dark'

  return (
    <div className={cn('max-w-2xl', className)}>
      <p
        data-anim="left"
        className={cn(
          'flex items-center gap-3 text-[12px] font-semibold tracking-[0.12em] uppercase',
          isDark ? 'text-navy-300' : 'text-navy-400',
        )}
      >
        <span aria-hidden="true" className="h-px w-6 bg-urgent-500" />
        {label}
      </p>
      <h2
        data-anim="words"
        className={cn(
          'mt-3 text-[clamp(1.5rem,2.8vw,2.125rem)] leading-[1.15] font-bold tracking-[-0.02em]',
          isDark ? 'text-white' : 'text-navy-950',
        )}
      >
        <SplitWords text={title} />
        {accent && (
          <>
            {' '}
            <SplitWords text={accent} className={isDark ? 'text-urgent-400' : 'text-urgent-600'} />
          </>
        )}
      </h2>
      {intro && (
        <p
          data-anim="up"
          data-delay="0.15"
          className={cn('mt-3 text-[15px] leading-relaxed', isDark ? 'text-navy-200' : 'text-navy-500')}
        >
          {intro}
        </p>
      )}
    </div>
  )
}
