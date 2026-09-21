import { gsap } from '@/animations/gsap'
import { trackLoading } from './loading-progress'

/**
 * Les pièces du volet, confiées par `<PageCurtain>` au montage.
 *
 * `panel` est le volet blanc, `mark` le bloc logo posé en son centre, `trace`
 * la ligne ECG rouge qui se dessine et `percent` le chiffre sous elle.
 */
export type CurtainParts = {
  panel: HTMLElement
  mark: HTMLElement
  trace: SVGPathElement
  percent: HTMLElement
}

/**
 * Chorégraphie du volet, en secondes.
 *
 * La montée part VITE et se pose (`power3.out`) : elle répond au clic au lieu
 * de s'étirer. Une courbe `inOut` y mettait un temps de latence — sur les
 * cent premières millisecondes le volet n'avait parcouru que six pour cent de
 * sa course, et c'est ce qui donnait l'impression qu'il traînait.
 */
const COVER = 0.42
const HOLD = 0.12
const LIFT = 0.5
const LIFT_AT = COVER + HOLD

/** Le volet d'ouverture ne s'attarde pas, même si le réseau traîne. */
const MAX_LOADING = 6
/**
 * ... et ne clignote pas non plus quand tout est déjà en cache : le logo a le
 * temps de se poser (0,4 s) et de tenir un instant avant que le volet ne parte.
 */
const MIN_LOADING = 0.62

let curtain: CurtainParts | null = null
let timeline: gsap.core.Timeline | null = null
let hasIntroStarted = false

/**
 * Tant que cette promesse n'est pas résolue, l'écran est couvert.
 *
 * Elle démarre RETENUE : le volet couvre déjà la page au premier affichage,
 * les apparitions ne doivent donc pas se jouer derrière lui. C'est la fin de
 * l'ouverture du site qui la relâche.
 */
let settle: (() => void) | null = null
let pending: Promise<void> = new Promise<void>((resolve) => {
  settle = resolve
})

function holdScreen() {
  if (settle) return
  pending = new Promise<void>((resolve) => {
    settle = resolve
  })
}

/**
 * Rend l'écran aux apparitions, une image APRÈS l'arrêt du volet.
 *
 * Mettre en place les apparitions d'une page coûte une vingtaine de
 * millisecondes de fil principal bloqué, soit une image perdue. Relâchée dans
 * le `onComplete` du volet, cette mise en place tombe dans la même image que
 * son dernier pas : le volet s'accroche juste avant de disparaître. Une image
 * plus tard, l'écran est immobile — il ne se passe rien à l'instant où l'image
 * manque, donc rien ne se remarque.
 */
function releaseScreen() {
  if (!settle) return
  const resolve = settle
  settle = null
  window.requestAnimationFrame(() => {
    // Les deux gestes dans la MÊME image, et dans cet ordre : on retire le
    // masque, puis les apparitions posent leur état de départ (via la promesse,
    // au micro-tour qui suit). Le navigateur ne peint qu'ensuite — le contenu
    // passe donc de « caché par le masque » à « caché par GSAP » sans jamais
    // s'afficher entre les deux.
    //
    // L'ordre compte : GSAP lit l'opacité EN PLACE comme valeur d'arrivée. Lue
    // sous le masque, elle vaudrait 0, et l'élément s'animerait vers 0.
    uncoverReveals()
    resolve()
  })
}

/**
 * Masque des apparitions, porté par la classe `is-covered` de `<html>`.
 *
 * Tant que le volet couvre l'écran, tout ce qui porte `data-anim` est caché —
 * voir `index.css`. Sans cela, le contenu s'affichait dans son état FINAL
 * pendant que le volet se relevait, puis disparaissait d'un coup pour jouer
 * son apparition : on la voyait deux fois, la seconde comme si la première
 * n'avait jamais eu lieu.
 *
 * La classe est posée d'office dans `index.html`, pour l'ouverture du site ; à
 * chaque changement de page, elle est reposée au moment où la page change, à
 * couvert — jamais avant, où elle ferait disparaître l'ANCIENNE page sous les
 * yeux du visiteur, dans la partie que le volet ne couvre pas encore.
 */
function coverReveals() {
  document.documentElement.classList.add('is-covered')
}

function uncoverReveals() {
  document.documentElement.classList.remove('is-covered')
}

/** Déclarée par `<PageCurtain>`. Renvoie de quoi se retirer au démontage. */
export function registerCurtain(parts: CurtainParts) {
  prepareTrace(parts.trace)
  curtain = parts
  return () => {
    if (curtain === parts) curtain = null
  }
}

/**
 * Résolue dès que l'écran est dégagé — volet d'ouverture compris.
 *
 * Les apparitions au défilement s'y accrochent : lancées pendant que le volet
 * couvre encore, elles seraient terminées avant d'avoir été vues.
 */
export function afterPageTransition() {
  return pending
}

/**
 * Ouverture du site.
 *
 * Le volet est DÉJÀ en place au premier affichage — il ne monte pas, la page
 * se construit derrière lui. Le cœur bat, le filet se remplit au rythme réel
 * du chargement, puis le volet se relève et découvre l'accueil.
 *
 * Le volet blanc sur fond blanc : entre la page HTML vide et l'arrivée du
 * logo, il n'y a aucun changement de couleur, donc aucun clignotement.
 */
export function playSiteIntro(animate: boolean) {
  if (hasIntroStarted) return
  hasIntroStarted = true

  if (!curtain || !animate) {
    if (curtain) gsap.set(curtain.panel, { visibility: 'hidden' })
    releaseScreen()
    return
  }

  const { panel, mark, trace, percent } = curtain

  gsap.set(panel, { visibility: 'visible', y: 0, yPercent: 0 })
  gsap.set(mark, { opacity: 0, scale: 0.94, y: 10 })
  gsap.set(percent, { opacity: 1 })
  setTraceProgress(trace, 0)
  gsap.to(mark, { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'power3.out' })

  // La valeur affichée suit la valeur réelle SANS la copier : elle la rejoint
  // en glissant. Le chargement avance par à-coups — une grosse image d'un
  // coup, puis rien —, et un filet qui saute donne l'impression d'un blocage.
  const shown = { value: 0 }
  const paint = () => {
    setTraceProgress(trace, shown.value)
    percent.textContent = `${Math.round(shown.value * 100)} %`
  }
  paint()

  let stopTracking: (() => void) | null = null
  let guard: gsap.core.Tween | null = null
  let isDone = false

  const finish = () => {
    if (isDone) return
    isDone = true
    stopTracking?.()
    guard?.kill()

    // Le filet va au bout avant que le volet ne parte : on ne se relève pas
    // sur un chargement affiché à 87 %.
    gsap.to(shown, {
      value: 1,
      duration: 0.22,
      ease: 'power2.out',
      overwrite: true,
      onUpdate: paint,
      onComplete: () => {
        gsap
          .timeline({
            onComplete: () => {
              gsap.set(panel, { visibility: 'hidden' })
              releaseScreen()
            },
          })
          .to(mark, { opacity: 0, y: -10, duration: 0.2, ease: 'power2.in' })
          .to(panel, { yPercent: -100, duration: LIFT, ease: 'power2.inOut' }, 0.1)
      },
    })
  }

  const startedAt = performance.now()

  stopTracking = trackLoading(
    (ratio) => {
      gsap.to(shown, {
        value: ratio,
        duration: 0.45,
        ease: 'power2.out',
        overwrite: true,
        onUpdate: paint,
      })
    },
    () => {
      const elapsed = (performance.now() - startedAt) / 1000
      gsap.delayedCall(Math.max(0, MIN_LOADING - elapsed), finish)
    },
  )

  guard = gsap.delayedCall(MAX_LOADING, finish)
}

/**
 * Passage d'une page à l'autre, derrière le volet.
 *
 * Le volet monte et couvre l'écran, la page est remplacée À COUVERT, puis il
 * poursuit sa course vers le haut et découvre la nouvelle page. Le mouvement
 * ne s'inverse jamais : on traverse le volet, on ne le rouvre pas.
 *
 * C'est aussi ce qui rend le changement instantané à l'oeil. Remplacer une page
 * par l'autre coûte quelques dizaines de millisecondes de rendu, pendant
 * lesquelles rien ne peut bouger à l'écran ; ici ce temps mort tombe au milieu
 * du temps couvert, là où il n'y a rien à voir.
 *
 * Tout est animé en `transform` et en `opacity` : le volet est composé par le
 * GPU, et le blocage du rendu ne le fait pas sauter d'une image.
 *
 * `update` doit remplacer la page de façon SYNCHRONE — à son retour, le volet
 * commence déjà à se relever.
 */
export function startPageTransition(update: () => void, animate = true) {
  if (!animate || !curtain) {
    update()
    return
  }

  const { panel, mark, trace, percent } = curtain
  const traceLength = prepareTrace(trace)

  // Un second clic pendant la traversée : on reprend du début plutôt que de
  // laisser deux volets se croiser.
  timeline?.kill()
  holdScreen()

  timeline = gsap
    .timeline({
      defaults: { overwrite: 'auto' },
      onComplete: () => {
        gsap.set(panel, { visibility: 'hidden' })
        timeline = null
        releaseScreen()
      },
    })
    // `y: 0` explicite : il efface tout reliquat d'une traversée précédente,
    // que `yPercent` seul laisserait en place.
    .set(panel, { visibility: 'visible', y: 0, yPercent: 100 })
    .set(mark, { opacity: 0, scale: 0.94, y: 12 })
    // Le chiffre n'a de sens qu'à l'ouverture : ici, rien ne se charge.
    .set(percent, { opacity: 0 })
    .set(trace, { strokeDashoffset: traceLength })

    // Le volet couvre.
    .to(panel, { yPercent: 0, duration: COVER, ease: 'power3.out' }, 0)
    .to(mark, { opacity: 1, scale: 1, y: 0, duration: 0.28, ease: 'power3.out' }, 0.16)
    .to(trace, { strokeDashoffset: 0, duration: 0.42, ease: 'power2.inOut' }, 0.18)

    // À couvert : la page change.
    .call(
      () => {
        coverReveals()
        update()
      },
      undefined,
      COVER,
    )

    // Le volet poursuit sa course et découvre.
    .to(mark, { opacity: 0, y: -10, duration: 0.18, ease: 'power2.in' }, LIFT_AT - 0.06)
    .to(panel, { yPercent: -100, duration: LIFT, ease: 'power2.inOut' }, LIFT_AT)
}

/** Dessine la trace de gauche à droite sans recalculer sa géométrie. */
function setTraceProgress(trace: SVGPathElement, ratio: number) {
  const length = prepareTrace(trace)
  const progress = Math.min(1, Math.max(0, ratio))
  gsap.set(trace, { strokeDashoffset: length * (1 - progress) })
}

/**
 * Les longueurs SVG normalisées ne sont pas animées de façon identique selon
 * les navigateurs. On mesure donc la trace une fois et on travaille en pixels.
 */
function prepareTrace(trace: SVGPathElement) {
  const cached = Number(trace.dataset.traceLength)
  const length = cached > 0 ? cached : trace.getTotalLength()

  if (!(cached > 0)) {
    trace.dataset.traceLength = String(length)
    gsap.set(trace, { strokeDasharray: length, strokeDashoffset: length })
  }

  return length
}
