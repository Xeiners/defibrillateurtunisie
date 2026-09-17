import type { ReactNode } from 'react'

/**
 * Deux marques de mise en valeur dans un texte de données :
 *
 *   **texte**  — appuyé, en encre
 *   ==texte==  — surligné en rouge : ce qu'il faut retenir
 *
 * Les marques ne s'imbriquent PAS : `**a ==b==**` sortirait tel quel. Une
 * valeur par passage, jamais les deux.
 *
 * Le découpage est fait au rendu, à partir d'une seule expression : pas de HTML
 * dans les données, donc rien à injecter et rien à assainir.
 */
const PATTERN = /(\*\*[^*]+\*\*|==[^=]+==)/g

export function RichText({ text }: { text: string }) {
  const parts = text.split(PATTERN).filter((part) => part !== '')

  return parts.map((part, index): ReactNode => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={index} className="font-semibold text-navy-950">
          {part.slice(2, -2)}
        </strong>
      )
    }

    if (part.startsWith('==') && part.endsWith('==')) {
      return (
        <mark
          key={index}
          className="-mx-0.5 rounded-sm bg-urgent-50 px-1 font-semibold text-urgent-700"
        >
          {part.slice(2, -2)}
        </mark>
      )
    }

    return part
  })
}
