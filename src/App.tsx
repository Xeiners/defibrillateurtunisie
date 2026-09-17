import { useRef } from 'react'
import { IconContext } from '@phosphor-icons/react'
import { useScrollEffects } from '@/animations/useScrollEffects'
import { QuoteProvider } from '@/components/quote/QuoteProvider'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Hero } from '@/components/sections/hero/Hero'
import { BrandsBand } from '@/components/sections/brands/BrandsBand'
import { SectorsSection } from '@/components/sections/sectors/SectorsSection'
import { LawNotice } from '@/components/sections/law/LawNotice'
import { StatsBand } from '@/components/sections/stats/StatsBand'
import { SaveLifeSection } from '@/components/sections/save-life/SaveLifeSection'
import { HeroCallSection } from '@/components/sections/hero-call/HeroCallSection'
import { OffersSection } from '@/components/sections/offers/OffersSection'
import { FaqSection } from '@/components/sections/faq/FaqSection'

/**
 * Parcours de la page, dans l'ordre de la décision :
 *   1. l'offre et le prix d'appel (hero), la confiance (marques) ;
 *   2. suis-je concerné (secteurs) ; le projet de loi suit en notification ;
 *   3. ce qui est en jeu (chiffres), les gestes qui sauvent, puis l'appel ;
 *   4. ce qu'on propose (packs), les dernières objections (FAQ), l'appel final.
 *
 * `useScrollEffects` est monté ICI, au-dessus des sections : leurs animations
 * existent déjà quand il calcule ses déclencheurs. `QuoteProvider` enveloppe le
 * tout : c'est lui qui ouvre la fenêtre de devis, d'où qu'on la demande.
 */
export default function App() {
  const rootRef = useRef<HTMLDivElement>(null)
  useScrollEffects(rootRef)

  return (
    <QuoteProvider>
      <IconContext.Provider value={{ weight: 'regular', mirrored: false }}>
        <div ref={rootRef}>
          <Navbar />
          <main>
            <Hero />
            <BrandsBand />
            <SectorsSection />
            <StatsBand />
            <SaveLifeSection />
            <HeroCallSection />
            <OffersSection />
            <FaqSection />
          </main>
          <Footer />

          {/* Hors flux : la notification suit le visiteur en bas d'écran. */}
          <LawNotice />
        </div>
      </IconContext.Provider>
    </QuoteProvider>
  )
}
