import { useRef } from 'react'
import { useHeroTimeline } from '@/animations/useHeroTimeline'
import { Navbar } from '@/components/layout/Navbar'
import { HeroCopy } from './HeroCopy'
import { HeroModel } from './HeroModel'

/**
 * Hero.
 *
 * Le discours à gauche, l'armoire en trois dimensions à droite. Rien d'autre :
 * les formules ont quitté le hero pour la section qui le suit, où elles ont la
 * place d'être décrites au lieu d'être résumées.
 *
 * HAUTEUR : AUCUNE. Le hero a porté successivement `100dvh` puis `65vh` ; les
 * deux imposaient une boîte plus haute que son contenu, et `items-center` y
 * centrait le tout — d'où un vide symétrique en haut et en bas que ni la
 * grille ni la typographie ne pouvaient résorber. La hauteur est désormais
 * celle du contenu plus ses marges, et rien d'autre.
 *
 * `items-center` reste, mais il ne travaille plus que sur les DEUX COLONNES
 * entre elles : le discours et l'armoire s'alignent sur leur milieu commun,
 * ce qui est son rôle utile. Sans hauteur imposée, il n'a plus de vide à
 * répartir.
 */
export function Hero() {
  const heroRef = useRef<HTMLElement>(null)
  useHeroTimeline(heroRef)

  return (
    <section
      id="top"
      ref={heroRef}
      className="relative isolate overflow-hidden bg-[var(--surface)]"
    >
      <Navbar />

      {/* `pt-24` n'est pas de l'espacement décoratif : la barre de navigation
          est en `absolute` et ne pousse donc rien. Ces 96px sont ses 80px de
          hauteur plus l'air qui la sépare du titre — les boutons de la barre
          étant centrés dans ses 80px, l'écart visible est plutôt de 36px. */}
      <div className="relative z-10 mx-auto grid max-w-[1560px] grid-cols-1 items-center gap-x-8 px-5 pt-24 pb-4 sm:px-8 lg:grid-cols-12 lg:pb-6">
        {/* Huit colonnes sur douze. Il reste UNE colonne libre entre le texte
            et le modèle — c'est ce qui sépare un discours d'un objet ; les
            réunir par une simple gouttière les ferait lire comme un seul
            bloc. C'est cette colonne libre qui fixe la limite : au-delà de
            huit, le titre viendrait toucher l'armoire. */}
        <div className="lg:col-span-8">
          <HeroCopy />
        </div>

        {/* Trois colonnes, calées au bord droit. Le modèle est cadré sur sa
            HAUTEUR : lui reprendre de la largeur ne lui retire pas de
            présence, ça lui retire du vide — et ce vide est précisément ce
            que le titre récupère.

            Sous `lg`, il passe SOUS le discours : un objet à manipuler n'a de
            sens qu'une fois qu'on sait ce qu'il est. */}
        <div className="mt-12 lg:col-span-3 lg:col-start-10 lg:mt-0">
          <HeroModel />
        </div>
      </div>
    </section>
  )
}
