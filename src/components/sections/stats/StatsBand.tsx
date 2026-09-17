import type { ComponentType } from 'react'
import { Brain, HeartBreak, Heartbeat, Skull, type IconProps } from '@phosphor-icons/react'
import { SplitWords } from '@/components/ui/SplitWords'
import { stats, survivalByMinute } from '@/data/landing'

const MAX_SURVIVAL = Math.max(...survivalByMinute.map((point) => point.survival))

/**
 * Hauteur de barre, en % du cadre.
 *
 * La plus haute plafonne à 88 % : les 12 % restants sont la place de son
 * étiquette, qui viendrait sinon chevaucher le titre du graphique.
 */
function barHeight(survival: number) {
  return (survival / MAX_SURVIVAL) * 88
}

/**
 * Les chiffres de l'arrêt cardiaque, juste avant les gestes qui sauvent.
 *
 * Le chiffre central n'est pas posé dans une carte : c'est une COURBE. Chaque
 * barre est une minute qui passe, et l'effondrement se lit d'un coup d'oeil —
 * bien mieux qu'un « −10 % » écrit en gros.
 *
 * Une seule teinte, de plus en plus sourde à mesure que la survie tombe : la
 * hauteur porte déjà l'information, la couleur ne fait que l'appuyer. Un rouge
 * opposé à un vert aurait été indistinguable pour un daltonien (ΔE 5,2).
 *
 * Les deux autres chiffres (4 min, 52 ans) restent en toutes lettres à côté :
 * ils disent ce que la courbe ne dit pas.
 */
const STAT_ICONS: Record<string, ComponentType<IconProps>> = {
  cerveau: Brain,
  age: HeartBreak,
}

export function StatsBand() {
  const otherStats = stats.filter((stat) => stat.id !== 'minute' && stat.id !== 'survie')

  return (
    <section aria-labelledby="chiffres-titre" className="on-dark bg-navy-950 py-14 sm:py-20">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[5fr_7fr] lg:items-end lg:gap-16">
        <div>
          <p data-anim="left" className="flex items-center gap-3 text-[12px] font-semibold tracking-[0.12em] text-navy-300 uppercase">
            <span aria-hidden="true" className="h-px w-6 bg-urgent-500" />
            Ce qui se joue
          </p>

          <h2
            id="chiffres-titre"
            data-anim="words"
            className="mt-4 text-[clamp(2rem,4vw,3rem)] leading-[1.05] font-bold tracking-[-0.03em] text-white"
          >
            <SplitWords text="Chaque minute sans défibrillateur :" />{' '}
            <SplitWords text="10 % de survie en moins." className="text-urgent-400" />
          </h2>

          {/* Ce que la courbe ne montre pas : le temps du cerveau, et qui est touché. */}
          <dl className="mt-8 flex flex-col divide-y divide-white/10 border-y border-white/10">
            {otherStats.map((stat) => (
              <div key={stat.id} data-anim="up" className="flex items-baseline gap-3 py-3.5">
                <StatIcon id={stat.id} />
<dd className="tabular shrink-0 text-[clamp(1.75rem,3vw,2.5rem)] leading-none font-bold tracking-[-0.03em] text-white">
                  <span data-count={stat.count}>{stat.count}</span>
                  <span className="text-[0.55em] text-urgent-400">{stat.suffix}</span>
                </dd>
                <dt className="text-[14px] leading-snug text-navy-300">{stat.label}</dt>
              </div>
            ))}
          </dl>
        </div>

        <SurvivalChart />
      </div>
    </section>
  )
}

/** Pastille d'icône d'un chiffre secondaire. */
function StatIcon({ id }: { id: string }) {
  const Icon = STAT_ICONS[id]
  if (!Icon) return null

  return (
    <span className="grid size-11 shrink-0 self-center place-items-center rounded-full bg-urgent-600/15 text-urgent-400">
      <Icon size={22} weight="duotone" aria-hidden="true" />
    </span>
  )
}

/**
 * Courbe de survie, barre par minute.
 *
 * Deux valeurs sont étiquetées en clair — la première et la dernière — plutôt
 * qu'un nombre sur chaque barre ; les autres apparaissent au survol et au
 * clavier. Le repère horizontal à 50 % donne l'échelle sans grille chargée.
 */
function SurvivalChart() {
  return (
    <figure className="min-w-0">
      <figcaption className="text-[15px] font-semibold text-white">
        Chances de survie, minute par minute
      </figcaption>

      {/* Légende : ce que disent les deux bouts de la courbe. */}
      <ul className="mt-3 flex list-none flex-wrap gap-x-5 gap-y-2">
        <li className="flex items-center gap-2 text-[13px] text-navy-200">
          <Heartbeat size={18} weight="fill" className="text-urgent-400" aria-hidden="true" />
          1 à 3 min : le cœur peut repartir
        </li>
        <li className="flex items-center gap-2 text-[13px] text-navy-400">
          <Skull size={18} weight="fill" aria-hidden="true" />
          Après 8 min : quasi aucune chance
        </li>
      </ul>

      <div className="relative mt-4 h-55 sm:h-70">
        {/* Repère à 50 % : une seule ligne, en retrait. */}
        <div aria-hidden="true" className="absolute inset-x-0 border-t border-dashed border-white/15"
          style={{ bottom: `${barHeight(50)}%` }}>
          <span className="absolute -top-2 right-0 bg-navy-950 pl-2 text-[11px] text-navy-400">50 %</span>
        </div>

        <ul data-anim="grow" className="flex h-full list-none items-end gap-1.5 sm:gap-2">
          {survivalByMinute.map((point, index) => {
            const isFirst = index === 0
            const isLast = index === survivalByMinute.length - 1
            return (
              <li
                key={point.minute}
                tabIndex={0}
                className="group relative flex h-full flex-1 items-end rounded-t-sm focus-visible:outline-offset-4"
                style={{ opacity: 1 - index * 0.07 }}
              >
                <span
                  className="w-full rounded-t-sm bg-urgent-500 transition-colors duration-300 group-hover:bg-urgent-400 group-focus-visible:bg-urgent-400"
                  style={{ height: `${barHeight(point.survival)}%` }}
                />

                {/* Aux deux bouts, une icône dit ce que le chiffre implique. */}
                {(isFirst || isLast) && (
                  <span
                    aria-hidden="true"
                    className={
                      'pointer-events-none absolute inset-x-0 flex justify-center ' +
                      (isFirst ? 'text-white' : 'text-navy-400')
                    }
                    /* La première barre est haute : son icône se loge DEDANS,
                       sinon elle passerait par-dessus l'étiquette et la légende. */
                    style={{
                      bottom: isFirst
                        ? `calc(${barHeight(point.survival)}% - 34px)`
                        : `calc(${barHeight(point.survival)}% + 30px)`,
                    }}
                  >
                    {isFirst ? (
                      <Heartbeat size={22} weight="fill" />
                    ) : (
                      <Skull size={22} weight="fill" />
                    )}
                  </span>
                )}

                {/* Valeur : toujours visible aux deux bouts, au survol ailleurs. */}
                <span
                  className={
                    'tabular pointer-events-none absolute inset-x-0 text-center text-[12px] font-bold text-white transition-opacity duration-200 ' +
                    (isFirst || isLast
                      ? 'opacity-100'
                      : 'opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100')
                  }
                  style={{ bottom: `calc(${barHeight(point.survival)}% + 8px)` }}
                >
                  {point.survival} %
                </span>
              </li>
            )
          })}
        </ul>
      </div>

      {/* Axe des minutes, sous les barres. */}
      <div className="mt-2 border-t border-white/10 pt-2">
        <ul className="flex list-none gap-1.5 sm:gap-2">
          {survivalByMinute.map((point) => (
            <li key={point.minute} className="tabular flex-1 text-center text-[11px] text-navy-400 sm:text-[12px]">
              {point.minute}
            </li>
          ))}
        </ul>
        <p className="mt-1 text-right text-[11px] text-navy-500">minutes après l’arrêt</p>
      </div>

      <p className="mt-3 text-[12px] leading-snug text-navy-500">
        Estimation d’après la règle des −10 points par minute (European
        Resuscitation Council).
      </p>
    </figure>
  )
}
