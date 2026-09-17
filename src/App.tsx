import { IconContext } from '@phosphor-icons/react'
import { Hero } from '@/components/sections/hero/Hero'
import { BrandsBand } from '@/components/sections/brands/BrandsBand'
import { PacksSection } from '@/components/sections/packs/PacksSection'
import { FaqSection } from '@/components/sections/faq/FaqSection'
import { ProductsBand } from '@/components/sections/products/ProductsBand'
import { AboutSection } from '@/components/sections/about/AboutSection'
import { VideoBand } from '@/components/sections/video/VideoBand'
import { PricingSection } from '@/components/sections/pricing/PricingSection'
import { Footer } from '@/components/layout/Footer'
import { CartPanel } from '@/components/cart/CartPanel'
import { CartProvider } from '@/store/CartProvider'

/**
 * Rythme de la page : clair en haut, encre en bas.
 *
 * Le hero ouvre sur le blanc, la pédagogie et le catalogue restent dans les
 * valeurs claires, puis la page bascule dans l'encre et n'en ressort plus :
 * « à propos » et la vidéo forment UN SEUL bloc sombre — d'où l'absence de
 * marge haute sur la vidéo, qui se poserait autrement comme une section de
 * plus — les tarifs remontent au clair le temps d'une comparaison, et le pied
 * de page referme sur l'encre.
 *
 * Les deux tons clairs (blanc et blanc cassé) alternent d'un demi-ton : assez
 * pour qu'on voie la couture entre deux sections, trop peu pour qu'on la lise
 * comme une rupture.
 *
 * TOUTE ancre visée par la navigation doit correspondre à un `id` posé ici ou
 * dans le pied de page, et être déclarée dans `liveAnchors` : c'est cette
 * liste qui empêche la barre et le pied de page de proposer des liens morts.
 *
 * Une seule famille d'icônes (Phosphor) et une seule graisse pour tout le
 * site : le réglage se fait ici, jamais au cas par cas dans les composants.
 */
export default function App() {
  return (
    <CartProvider>
      <IconContext.Provider value={{ weight: 'regular', mirrored: false }}>
        <main>
          <Hero />
          <BrandsBand />
          <PacksSection />
          <FaqSection />
          <ProductsBand />
          <AboutSection />
          <VideoBand />
          <PricingSection />
        </main>

        <Footer />

        {/* Hors flux : le panneau du panier se superpose à la page entière. */}
        <CartPanel />
      </IconContext.Provider>
    </CartProvider>
  )
}
