import { cn } from '@/lib/cn'

/**
 * Découpe un texte en mots masqués, pour `data-anim="words"`. Le masque déborde
 * d'une réserve en haut (accents des capitales) et en bas (jambages).
 *
 * Le découpage est fait au rendu et non par GSAP : React reste propriétaire du
 * DOM. Chaque mot glisse dans son propre masque ; l'espace est posée HORS du
 * masque pour que les mots se séparent normalement à la coupure de ligne.
 */
export function SplitWords({ text, className }: { text: string; className?: string }) {
  const words = text.split(' ')

  return words.map((word, index) => (
    <span key={`${word}-${index}`}>
      <span className="-my-[0.12em] inline-block overflow-hidden py-[0.12em] align-top">
        <span data-word className={cn('inline-block', className)}>
          {word}
        </span>
      </span>
      {index < words.length - 1 && ' '}
    </span>
  ))
}
