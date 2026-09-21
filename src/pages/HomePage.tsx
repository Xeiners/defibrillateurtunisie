import { Hero } from '@/components/sections/hero/Hero'
import { BrandsBand } from '@/components/sections/brands/BrandsBand'
import { SectorsSection } from '@/components/sections/sectors/SectorsSection'
import { StatsBand } from '@/components/sections/stats/StatsBand'
import { SaveLifeSection } from '@/components/sections/save-life/SaveLifeSection'
import { HeroCallSection } from '@/components/sections/hero-call/HeroCallSection'
import { OffersSection } from '@/components/sections/offers/OffersSection'
import { FaqSection } from '@/components/sections/faq/FaqSection'

/**
 * Parcours de la page d'accueil, dans l'ordre de la décision :
 *   1. l'offre et le prix d'appel (hero), la confiance (marques) ;
 *   2. suis-je concerné (secteurs) ;
 *   3. ce qui est en jeu (chiffres), les gestes qui sauvent, puis l'appel ;
 *   4. ce qu'on propose (packs), les dernières objections (FAQ).
 *
 * L'appel final et le pied de page sont posés par `App` : ils suivent les deux
 * pages du site.
 */
export function HomePage() {
  return (
    <>
      <Hero />
      <BrandsBand />
      <SectorsSection />
      <StatsBand />
      <SaveLifeSection />
      <HeroCallSection />
      <OffersSection />
      <FaqSection />
    </>
  )
}
