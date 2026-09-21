import { useLayoutEffect, type RefObject } from 'react'
import { afterPageTransition } from '@/lib/page-transition'
import { gsap, ScrollTrigger } from './gsap'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

/** Position de déclenchement, commune à tous les effets. */
const START = 'top 88%'

/**
 * Marque posée sur un élément dont l'apparition a été JOUÉE.
 *
 * Elle vit sur le nœud du DOM, pas dans le hook : elle survit donc à tout ce
 * qui reconstruit les animations sans recréer la page — un rechargement à chaud
 * en développement, un recalcul de ScrollTrigger, un effet React rejoué. Un
 * élément marqué n'est plus jamais remis à son état de départ.
 *
 * Une nouvelle page, elle, a de nouveaux nœuds : ses apparitions jouent.
 */
const REVEALED = 'revealed'

/**
 * Effets d'apparition de toute la page, déclarés dans le balisage.
 *
 *   data-anim="up"       se pose en fondu, en se resserrant très légèrement (défaut)
 *   data-anim="left"     glisse depuis la gauche
 *   data-anim="right"    glisse depuis la droite
 *   data-anim="pop"      grossit légèrement : ce qui doit capter l'oeil
 *   data-anim="clip"     se dévoile comme un volet (photos)
 *   data-anim="words"    titre révélé mot à mot (mots marqués `data-word`)
 *   data-anim="stagger"  enfants directs en cascade
 *   data-anim="grow"     barres qui poussent depuis le bas (`[data-bar]` si présents)
 *   data-delay="0.2"     retard en secondes
 *
 *   data-count="52"      nombre qui compte depuis 0 à l'apparition
 *   data-draw            tracé SVG dessiné à l'apparition
 *
 * CHAQUE APPARITION NE JOUE QU'UNE FOIS, et c'est garanti par construction :
 * l'animation est créée EN PAUSE, un déclencheur à usage unique la lance, et
 * l'élément est marqué à cet instant (`data-revealed`). Rien ne peut la
 * rejouer — ni un second passage, ni une reconstruction des animations, ni un
 * recalcul de ScrollTrigger. Auparavant, l'animation était pilotée
 * directement par ScrollTrigger avec `invalidateOnRefresh` : chaque recalcul
 * pouvait la remettre à zéro, et un élément déjà vu disparaissait pour se
 * rejouer.
 *
 * Aucun effet ne fait « monter » un bloc depuis le bas : la page n'est pas une
 * présentation. Le mouvement vient de l'échelle et de l'opacité.
 *
 * TROIS RÈGLES tiennent la fluidité, et il ne faut pas y revenir :
 *
 *   1. AUCUN `filter: blur()` animé. Un flou sur une carte de 400 px force le
 *      navigateur à repeindre la zone à chaque image ; c'était la cause des
 *      saccades. L'opacité et la transformation, elles, sont composées par le
 *      GPU et ne coûtent rien.
 *   2. La promotion GPU est LAISSÉE À GSAP (`force3D: 'auto'`, son réglage par
 *      défaut) : il pose la couche le temps du mouvement et la relâche à la
 *      fin. Un `will-change` écrit à la main resterait, et cinquante couches
 *      gardées en vie coûtent plus cher que les animations elles-mêmes.
 *   3. Les repères sont recalculés une fois les polices chargées, et JAMAIS
 *      pendant que la page défile. `ScrollTrigger.refresh()` relève la position
 *      de défilement en entrant et la RESTAURE en sortant : appelé au mauvais
 *      moment, il annule le mouvement en cours.
 *
 * Le hook est monté au-dessus des sections et reçoit une clé de page : tout est
 * reposé à neuf quand on change de page. Sous « mouvement réduit », rien n'est
 * posé, le contenu reste simplement visible.
 */
export function useScrollEffects(scope: RefObject<HTMLElement | null>, routeKey: string) {
  const prefersReducedMotion = usePrefersReducedMotion()

  // `useLayoutEffect` et non `useEffect` : GSAP pose l'état de départ avant que
  // le navigateur ne peigne. En `useEffect`, l'élément s'affiche une image à sa
  // position finale avant de disparaître pour s'animer.
  useLayoutEffect(() => {
    const root = scope.current
    if (!root || prefersReducedMotion) return

    const counted: { el: HTMLElement; text: string }[] = []
    let context: gsap.Context | null = null
    let isMounted = true

    const build = () =>
      gsap.context(() => {
        gsap.utils.toArray<HTMLElement>('[data-anim]').forEach((el) => {
          if (el.dataset[REVEALED]) return

          const tween = revealTween(el)
          if (tween) revealOnce(el, tween)
        })

        gsap.utils.toArray<HTMLElement>('[data-count]').forEach((el) => {
          if (el.dataset[REVEALED]) return

          const target = Number(el.dataset.count)
          const counter = { value: 0 }
          counted.push({ el, text: el.textContent ?? '' })
          el.textContent = '0'

          const tween = gsap.to(counter, {
            value: target,
            duration: 1.4,
            ease: 'power3.out',
            paused: true,
            onUpdate: () => {
              el.textContent = String(Math.round(counter.value))
            },
          })
          revealOnce(el, tween)
        })

        gsap.utils.toArray<SVGPathElement>('[data-draw]').forEach((path) => {
          if (path.dataset[REVEALED]) return

          // Tracé une fois, à l'apparition. Il suivait la molette : il se
          // défaisait en remontant et se redessinait à chaque passage.
          const length = path.getTotalLength()
          const tween = gsap.fromTo(
            path,
            { strokeDasharray: length, strokeDashoffset: length },
            { strokeDashoffset: 0, duration: 1.4, ease: 'power2.inOut', paused: true },
          )
          revealOnce(path, tween, 'top 95%')
        })
      }, root)

    // On attend que le volet ait fini sa course. Lancées pendant qu'il couvre
    // encore, les apparitions seraient terminées avant d'avoir été vues, et la
    // nouvelle page se découvrirait déjà figée.
    // Hors transition, la promesse est déjà résolue : la mise en place a lieu
    // au micro-tour suivant, donc toujours avant le premier affichage.
    void afterPageTransition().then(() => {
      if (isMounted) context = build()
    })

    // ---- Un seul recalcul, quand les polices sont posées ------------------
    // Le texte change de hauteur en passant de la police de secours à la
    // vraie : c'est le seul décalage que ScrollTrigger ne voit pas de lui-même
    // (il se recale déjà au `load` de la fenêtre et à tout redimensionnement).
    document.fonts?.ready
      .then(() => {
        if (isMounted) ScrollTrigger.refresh()
      })
      .catch(() => {})

    return () => {
      isMounted = false
      context?.revert()
      // Les compteurs écrivent dans le texte, que `revert` ne restaure pas.
      counted.forEach(({ el, text }) => {
        el.textContent = text
      })
    }
  }, [scope, prefersReducedMotion, routeKey])
}

/**
 * Lance `tween` la première fois que `el` entre à l'écran, et plus jamais.
 *
 * Le déclencheur ne PILOTE pas l'animation — il se contente de la démarrer.
 * Un recalcul de ScrollTrigger ne peut donc ni la remettre à zéro ni la
 * rejouer : il n'a plus aucune prise sur elle une fois qu'elle est partie.
 */
function revealOnce(el: HTMLElement | SVGElement, tween: gsap.core.Animation, start = START) {
  ScrollTrigger.create({
    trigger: el,
    start,
    once: true,
    onEnter: () => {
      el.dataset[REVEALED] = 'true'
      tween.play()
    },
  })
}

/**
 * L'apparition propre à chaque `data-anim`, créée EN PAUSE.
 *
 * `gsap.from` pose l'état de départ dès sa création (`immediateRender`), même
 * en pause : l'élément est caché tout de suite, et n'attend plus que son
 * déclencheur.
 */
function revealTween(el: HTMLElement) {
  const base = {
    delay: Number(el.dataset.delay ?? 0),
    ease: 'power2.out',
    duration: 0.7,
    paused: true,
  }

  switch (el.dataset.anim) {
    case 'pop':
      return gsap.from(el, { ...base, scale: 0.96, opacity: 0, duration: 0.75, ease: 'power3.out' })
    case 'left':
      return gsap.from(el, { ...base, x: -26, opacity: 0 })
    case 'right':
      return gsap.from(el, { ...base, x: 26, opacity: 0 })
    case 'clip':
      return gsap.fromTo(
        el,
        { clipPath: 'inset(0 100% 0 0)' },
        { ...base, clipPath: 'inset(0 0% 0 0)', duration: 0.9, ease: 'power3.inOut' },
      )
    case 'words': {
      // Chaque mot glisse dans son masque : une transformation pure, c'est
      // l'effet le plus léger de la page malgré son nombre de cibles.
      const words = el.querySelectorAll('[data-word]')
      if (words.length === 0) return null
      return gsap.from(words, { ...base, yPercent: 108, duration: 0.8, ease: 'expo.out', stagger: 0.028 })
    }
    case 'grow': {
      // Sur un graphique, seules les BARRES poussent : mises à l'échelle, les
      // `<li>` écraseraient aussi les étiquettes qu'elles portent.
      const bars = el.querySelectorAll('[data-bar]')
      return gsap.from(bars.length > 0 ? bars : el.children, {
        ...base,
        scaleY: 0,
        transformOrigin: 'bottom center',
        stagger: 0.045,
        ease: 'power3.out',
      })
    }
    case 'stagger':
      if (el.children.length === 0) return null
      return gsap.from(el.children, {
        ...base,
        opacity: 0,
        scale: 0.97,
        stagger: 0.055,
        duration: 0.6,
        ease: 'power3.out',
      })
    default:
      return gsap.from(el, { ...base, opacity: 0, scale: 1.012, duration: 0.75 })
  }
}
