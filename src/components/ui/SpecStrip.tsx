import { heroSpecs } from '@/data/site'

/**
 * Bandeau de mesures du hero.
 *
 * Chaque cellule est un couple libellé/valeur séparé par un filet, comme la
 * lecture d'un appareil. C'est ce qui remplace la rangée de pastilles :
 * l'information est la même, le registre est celui de l'instrument.
 *
 * Disposé en `flex` et non en grille à colonnes fixes : les cellules se
 * calent sur leur contenu, donc retirer ou ajouter une mesure ne laisse ni
 * colonne vide ni cellule étirée. Le filet est porté par chaque cellule sauf
 * la première, ce qui évite un trait orphelin en fin de ligne.
 *
 * Chaque cellule porte `data-hero="spec"` : GSAP les fait entrer en cascade.
 */
export function SpecStrip() {
  return (
    <dl className="flex flex-wrap gap-y-6">
      {heroSpecs.map((spec, index) => (
        <div
          key={spec.id}
          data-hero="spec"
          className={
            index === 0
              ? 'pr-7 sm:pr-10'
              : 'border-l border-[var(--border-subtle)] pr-7 pl-7 sm:pr-10 sm:pl-10'
          }
        >
          {/* `text-secondary` et non `text-muted` : le gris clair du système
              tombe sous 3:1 sur blanc, et ces libellés sont déjà à 11px. */}
          <dt className="label-tech text-[var(--text-secondary)]">
            {spec.label}
          </dt>
          <dd className="mt-2.5 text-[13px] leading-snug font-medium text-[var(--text-primary)] sm:text-[15px]">
            {spec.value}
          </dd>
        </div>
      ))}
    </dl>
  )
}
