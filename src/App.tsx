import { useRef } from 'react'
import { IconContext } from '@phosphor-icons/react'
import { useScrollEffects } from '@/animations/useScrollEffects'
import { QuoteProvider } from '@/components/quote/QuoteProvider'
import { RouterProvider } from '@/router/RouterProvider'
import { ROUTES, useRoute } from '@/router/route-context'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { PageCurtain } from '@/components/layout/PageCurtain'
import { LawNotice } from '@/components/sections/law/LawNotice'
import { HomePage } from '@/pages/HomePage'
import { QuotePage } from '@/pages/QuotePage'

/**
 * Deux pages : l'accueil, et le devis.
 *
 * `RouterProvider` est au-dessus de tout — il intercepte les liens internes.
 * `QuoteProvider` juste en dessous : la sélection de packs se constitue sur
 * l'accueil et se relit sur `/devis`, elle doit donc survivre au changement de
 * page.
 */
export default function App() {
  return (
    <RouterProvider>
      <QuoteProvider>
        <IconContext.Provider value={{ weight: 'regular', mirrored: false }}>
          <Shell />
        </IconContext.Provider>
      </QuoteProvider>
    </RouterProvider>
  )
}

/**
 * Cadre commun aux deux pages.
 *
 * `useScrollEffects` est monté ICI, au-dessus du contenu : les animations des
 * sections existent déjà quand il calcule ses déclencheurs. Il reçoit le chemin
 * courant, ce qui lui fait tout reposer à chaque changement de page — sans
 * quoi les déclencheurs de l'accueil resteraient accrochés à un DOM démonté.
 */
function Shell() {
  const { path } = useRoute()
  const rootRef = useRef<HTMLDivElement>(null)
  useScrollEffects(rootRef, path)

  const isQuotePage = path === ROUTES.quote

  return (
    <div ref={rootRef}>
      <Navbar />
      <main>{isQuotePage ? <QuotePage /> : <HomePage />}</main>
      <Footer />

      {/* Hors flux : la notification suit le visiteur en bas d'écran. Elle est
          retirée de la page de devis, où elle masquerait le bouton d'envoi. */}
      {!isQuotePage && <LawNotice />}

      {/* Par-dessus tout : le volet qui couvre le changement de page. */}
      <PageCurtain />
    </div>
  )
}
