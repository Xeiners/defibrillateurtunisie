/**
 * Avancement réel du chargement de la page d'accueil.
 *
 * Deux choses seulement sont attendues : les images qui s'affichent tout de
 * suite, et les polices. Les images DIFFÉRÉES (`loading="lazy"`) sont écartées —
 * elles ne partent qu'au défilement, les attendre retiendrait l'écran pour
 * toujours. Les polices, elles, comptent : elles décalent le texte en arrivant,
 * et on préfère que cela se passe derrière le volet.
 *
 * La mesure est relevée à chaque image plutôt que sur des événements : une
 * image peut être déjà complète au moment où on la découvre (cache), et son
 * `load` ne se déclenchera jamais.
 */
export function trackLoading(
  onProgress: (ratio: number) => void,
  onReady: () => void,
): () => void {
  let isStopped = false
  let areFontsReady = false

  document.fonts?.ready
    .then(() => {
      areFontsReady = true
    })
    .catch(() => {
      // Polices indisponibles : on n'attend pas ce qui n'arrivera pas.
      areFontsReady = true
    })

  const ratio = () => {
    const images = Array.from(document.images).filter((image) => image.loading !== 'lazy')
    const loaded = images.filter((image) => image.complete).length

    // Les polices pèsent comme une image de plus : sans cela, une page qui n'en
    // contient aucune afficherait 0 % jusqu'au bout.
    return (loaded + (areFontsReady ? 1 : 0)) / (images.length + 1)
  }

  const tick = () => {
    if (isStopped) return

    onProgress(ratio())

    // `complete` vaut l'événement `load` de la fenêtre : toutes les ressources
    // non différées sont arrivées, à bon port ou en erreur.
    if (document.readyState === 'complete' && areFontsReady) {
      onReady()
      return
    }

    window.requestAnimationFrame(tick)
  }

  // Jamais de façon synchrone : l'appelant doit avoir fini de se mettre en
  // place avant de recevoir quoi que ce soit.
  window.requestAnimationFrame(tick)

  return () => {
    isStopped = true
  }
}
