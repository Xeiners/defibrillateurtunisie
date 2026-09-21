import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { flushSync } from 'react-dom'
import { ScrollTrigger } from '@/animations/gsap'
import { usePrefersReducedMotion } from '@/animations/usePrefersReducedMotion'
import { startPageTransition } from '@/lib/page-transition'
import { RouteContext, type RouteValue } from './route-context'

/** Hauteur de la barre collante : les ancres s'arrêtent dessous. */
const NAV_OFFSET = 72

type Navigation = {
  path: string
  hash: string
  /**
   * Compteur de navigations. Il change même quand on revient à l'adresse déjà
   * affichée : sans lui, un second clic sur « Nos packs » ne relancerait aucun
   * défilement.
   */
  nth: number
  /**
   * Vrai quand on reste sur la MÊME page — un simple saut d'ancre. Le document
   * ne change alors pas de hauteur, et le défilement peut s'animer.
   */
  samePage: boolean
}

function readLocation() {
  return { path: window.location.pathname, hash: window.location.hash }
}

/** Où doit s'arrêter une ancre : sa section, juste sous la barre collante. */
function anchorTop(hash: string) {
  const target = hash ? document.getElementById(hash.slice(1)) : null
  if (!target) return 0
  return Math.max(0, target.getBoundingClientRect().top + window.scrollY - NAV_OFFSET)
}

/**
 * Routeur maison, deux pages.
 *
 * Il n'y a pas de composant `<Link>` : un écouteur unique posé au document
 * intercepte TOUS les liens internes. Les quarante `<a href="…">` de la page
 * n'ont donc rien à savoir du routeur, et un clic milieu, un `Ctrl+clic` ou un
 * « ouvrir dans un nouvel onglet » continuent de se comporter normalement.
 *
 * L'adresse est un vrai chemin (`/devis`) et non une ancre : l'hébergeur doit
 * renvoyer `index.html` pour toute adresse inconnue (voir `public/_redirects`).
 *
 * DEUX gestes, à ne pas confondre :
 *   - changer de PAGE passe derrière le volet (`startPageTransition`), au clic
 *     comme au bouton « précédent » ;
 *   - sauter à une ANCRE ne change pas de page : cela défile, et rien d'autre.
 */
export function RouterProvider({ children }: { children: ReactNode }) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const [nav, setNav] = useState<Navigation>(() => ({ ...readLocation(), nth: 0, samePage: false }))

  // L'adresse d'où l'on vient. Indispensable à `popstate`, où
  // `window.location` porte DÉJÀ la nouvelle.
  const pathRef = useRef(nav.path)
  useEffect(() => {
    pathRef.current = nav.path
  }, [nav.path])

  /**
   * Remplacement d'une page par l'autre, à couvert.
   *
   * `flushSync` force React à écrire la nouvelle page IMMÉDIATEMENT : le volet
   * commence à se relever dès que ce bloc rend la main, il faut donc que la
   * page soit déjà en place ET déjà placée au bon endroit. Un `setState`
   * ordinaire ne serait traité qu'après, et le volet découvrirait l'ancienne.
   */
  const changePage = useCallback(
    (hash: string, apply: () => void) => {
      startPageTransition(() => {
        flushSync(apply)
        window.scrollTo(0, anchorTop(hash))
      }, !prefersReducedMotion)
    },
    [prefersReducedMotion],
  )

  const navigate = useCallback<RouteValue['navigate']>(
    (to, options) => {
      const url = new URL(to, window.location.origin)
      const previousPath = window.location.pathname
      const isSameEntry = url.pathname === previousPath && url.hash === window.location.hash

      const apply = () => {
        if (!isSameEntry) {
          const method = options?.replace ? 'replaceState' : 'pushState'
          window.history[method](null, '', url.pathname + url.search + url.hash)
        }

        setNav((current) => ({
          path: url.pathname,
          hash: url.hash,
          nth: current.nth + 1,
          samePage: url.pathname === current.path,
        }))
      }

      if (url.pathname === previousPath) {
        // Saut d'ancre : c'est l'effet de placement, plus bas, qui fait
        // défiler — en douceur, puisque la page ne change pas.
        apply()
        return
      }

      changePage(url.hash, apply)
    },
    [changePage],
  )

  useEffect(() => {
    const onPopState = () => {
      const next = readLocation()

      const apply = () =>
        setNav((current) => ({
          ...next,
          nth: current.nth + 1,
          samePage: next.path === current.path,
        }))

      if (next.path === pathRef.current) apply()
      else changePage(next.hash, apply)
    }

    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [changePage])

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      // On laisse passer les clics « ouvrir ailleurs ».
      if (event.defaultPrevented || event.button !== 0) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

      const link = (event.target as Element | null)?.closest?.('a')
      if (!link || link.target === '_blank' || link.hasAttribute('download')) return

      const href = link.getAttribute('href')
      if (href === null || href === '') return

      // `mailto:`, `tel:` et les domaines extérieurs restent des liens.
      const url = new URL(href, window.location.href)
      if (url.origin !== window.location.origin) return

      event.preventDefault()
      navigate(url.pathname + url.search + url.hash)
    }

    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [navigate])

  // Placement, après le rendu de la page demandée.
  useEffect(() => {
    // Au premier rendu on ne bouge que si l'adresse portait déjà une ancre.
    if (nav.nth === 0 && !nav.hash) return

    // Changement de PAGE : le document n'a plus la même hauteur, ScrollTrigger
    // doit recalculer ses repères. On le fait AVANT de se placer, jamais après :
    // `refresh()` relève la position de défilement en entrant et la RESTAURE en
    // sortant. Appelé derrière un défilement adouci, il ramenait la page d'où
    // elle venait — c'est ce qui rendait les liens de la barre inopérants.
    if (!nav.samePage) ScrollTrigger.refresh()

    window.scrollTo({
      top: anchorTop(nav.hash),
      // Un saut d'ancre s'anime ; un changement de page se pose d'un coup —
      // il a déjà été placé pendant la transition.
      behavior: nav.samePage && !prefersReducedMotion ? 'smooth' : 'auto',
    })
  }, [nav, prefersReducedMotion])

  const value = useMemo<RouteValue>(
    () => ({ path: nav.path, hash: nav.hash, navigate }),
    [nav.path, nav.hash, navigate],
  )

  return <RouteContext.Provider value={value}>{children}</RouteContext.Provider>
}
