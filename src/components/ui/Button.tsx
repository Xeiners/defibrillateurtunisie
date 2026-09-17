import { ArrowRight } from '@phosphor-icons/react'
import type { ReactNode, Ref } from 'react'
import { cn } from '@/lib/cn'

/**
 * `primary`      : aplat vert signal, libellé encre (11:1). L'accent étant
 *                  clair, c'est le texte qui fonce, pas l'inverse.
 * `outline`      : action secondaire sur fond clair. Au survol, le libellé
 *                  passe au cran `accent-ink` : l'aplat de marque ne se lit
 *                  pas à cette taille sur blanc.
 * `deep-outline` : action secondaire sur fond profond.
 */
export type ButtonVariant = 'primary' | 'outline' | 'deep-outline'
export type ButtonSize = 'sm' | 'md'

type ButtonProps = {
  href: string
  children: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  withArrow?: boolean
  className?: string
  ref?: Ref<HTMLAnchorElement>
}

const SIZE: Record<ButtonSize, string> = {
  sm: 'px-4 py-2.5 text-[13px]',
  md: 'px-6 py-4 text-[14px]',
}

const VARIANT: Record<ButtonVariant, string> = {
  primary:
    'bg-[var(--accent)] text-[var(--text-on-accent)] hover:bg-[var(--accent-hover)]',
  outline:
    'border border-[var(--border-strong)] text-[var(--text-primary)] hover:border-[var(--accent-ink)] hover:text-[var(--accent-ink)]',
  'deep-outline':
    'border border-[var(--on-deep-line-strong)] text-white hover:border-white hover:bg-white/8',
}

/**
 * Toutes les actions du site sont des liens : on rend un `<a>`, pas un
 * `<button>` déguisé.
 *
 * La flèche glisse au survol au lieu de tourner dans une pastille : le geste
 * dit « on avance », il est plus juste et plus discret que la rotation.
 */
export function Button({
  href,
  children,
  variant = 'primary',
  size = 'md',
  withArrow = false,
  className,
  ref,
}: ButtonProps) {
  return (
    <a
      ref={ref}
      href={href}
      className={cn(
        'group/btn inline-flex items-center justify-center gap-2.5',
        'rounded-[var(--radius-field)] leading-none font-medium whitespace-nowrap',
        'transition-[background-color,border-color,color] duration-300',
        'ease-[var(--ease-out-expo)] active:scale-[0.98]',
        SIZE[size],
        VARIANT[variant],
        className,
      )}
    >
      {children}
      {withArrow && (
        <ArrowRight
          size={size === 'sm' ? 14 : 16}
          aria-hidden="true"
          className="shrink-0 transition-transform duration-400 ease-[var(--ease-out-expo)] group-hover/btn:translate-x-1"
        />
      )}
    </a>
  )
}
