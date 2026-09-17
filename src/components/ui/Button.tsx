import { ArrowRight } from '@phosphor-icons/react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

/**
 * `primary`  : rouge, l'action principale (devis).
 * `dark`     : bleu nuit, action secondaire sur fond clair.
 * `outline`  : action tertiaire sur fond clair.
 * `light`    : blanc, action principale sur fond sombre ou rouge.
 * `ghost`    : contour blanc, action secondaire sur fond sombre.
 */
export type ButtonVariant = 'primary' | 'dark' | 'outline' | 'light' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg'

type ButtonProps = {
  href: string
  children: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  withArrow?: boolean
  className?: string
  onClick?: () => void
}

const SIZE: Record<ButtonSize, string> = {
  sm: 'h-9 px-3.5 text-[13px]',
  md: 'h-11 px-5 text-[14px]',
  lg: 'h-12 px-6 text-[15px]',
}

const VARIANT: Record<ButtonVariant, string> = {
  primary: 'bg-urgent-600 text-white hover:bg-urgent-700',
  dark: 'bg-navy-900 text-white hover:bg-navy-800',
  outline:
    'border border-navy-200 bg-white text-navy-900 hover:border-navy-900',
  light: 'bg-white text-navy-950 hover:bg-navy-100',
  ghost: 'border border-white/25 text-white hover:border-white hover:bg-white/10',
}

/** Toutes les actions du site sont des liens : on rend un `<a>`. */
export function Button({
  href,
  children,
  variant = 'primary',
  size = 'md',
  withArrow = false,
  className,
  onClick,
}: ButtonProps) {
  return (
    <a
      href={href}
      onClick={onClick}
      className={cn(
        'group/btn inline-flex items-center justify-center gap-2 rounded-md font-semibold whitespace-nowrap',
        'transition-[background-color,border-color,color,transform] duration-300 active:scale-[0.98]',
        SIZE[size],
        VARIANT[variant],
        className,
      )}
    >
      {children}
      {withArrow && (
        <ArrowRight
          size={size === 'sm' ? 14 : 16}
          weight="bold"
          aria-hidden="true"
          className="shrink-0 transition-transform duration-300 group-hover/btn:translate-x-1"
        />
      )}
    </a>
  )
}
