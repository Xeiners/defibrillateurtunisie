import { actions } from '@/data/site'
import { Button } from '@/components/ui/Button'
import { SpecStrip } from '@/components/ui/SpecStrip'

/**
 * Le titre est coupé ici, pas par le navigateur.
 *
 * DEUX LIGNES, DONT UNE PLEINE. La phrase est fixe et la colonne est bornée :
 * dans ces conditions, la largeur que prend le titre se gagne en allongeant
 * les lignes, jamais en grossissant le corps — un corps plus gros fait
 * simplement déborder plus tôt. La coupe est donc portée au maximum que la
 * colonne accepte, 43 signes, et le corps en découle.
 *
 * C'est le compromis à connaître si l'on veut revenir en arrière : des lignes
 * plus courtes redonnent du corps mais reprennent de la largeur.
 *
 * La seconde ligne est courte : c'est la chute, elle reste seule.
 *
 * EN DESSOUS DE `lg`, la colonne fait toute la largeur de l'écran et 43 signes
 * n'y tiennent plus : le navigateur reprend la main et replie les lignes. La
 * coupe écrite ici est celle du grand écran, là où elle compte.
 */
const HEADLINE = [
  'Un défibrillateur dans votre établissement,',
  'chez vous, sans l’acheter.',
] as const

/**
 * Colonne de gauche du hero : le titre, puis une seule rangée qui porte les
 * actions et les mesures.
 *
 * UNE RANGÉE ET NON DEUX BLOCS. Le titre occupe toute la largeur de la
 * colonne ; les boutons et les mesures, empilés dessous, n'en couvraient
 * chacun qu'un tiers et laissaient à leur droite un grand rectangle vide sur
 * près de 200px de haut. Côte à côte, ils remplissent la largeur que le titre
 * a ouverte et la colonne perd une rangée entière. En dessous de `lg`, la
 * place manque et ils se remettent l'un sous l'autre.
 *
 * Le paragraphe d'accroche qui suivait le titre reste retiré : il
 * paraphrasait un titre qui se suffit.
 */
export function HeroCopy() {
  return (
    <div>
      {/* Le coefficient `vw` est calé sur la LARGEUR DE COLONNE, pas sur le
          confort de lecture : la colonne vaut environ deux tiers de la page,
          et 2.7vw est la pente qui garde la ligne de 43 signes tout juste
          dedans à 1024px comme à 1560px. Le plafond prend le relais au-delà,
          la page cessant alors de s'élargir. Toucher à l'un sans l'autre fait
          replier la ligne. */}
      <h1 className="text-[clamp(1.5rem,2.7vw,2.875rem)] leading-[1.02] font-semibold tracking-[-0.035em] text-[var(--text-primary)]">
        {HEADLINE.map((line) => (
          <span key={line} className="line-mask">
            <span data-hero="line" className="block will-change-transform">
              {line}
            </span>
          </span>
        ))}
      </h1>

      <div className="mt-7 flex flex-col gap-7 border-t border-[var(--border-subtle)] pt-7 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          <span data-hero="cta" className="inline-flex">
            <Button href={actions.quote.href} withArrow>
              {actions.quote.label}
            </Button>
          </span>

          <span data-hero="cta" className="inline-flex">
            <Button href={actions.catalog.href} variant="outline">
              {actions.catalog.label}
            </Button>
          </span>
        </div>

        <SpecStrip />
      </div>
    </div>
  )
}
