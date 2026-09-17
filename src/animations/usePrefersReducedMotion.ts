import { useSyncExternalStore } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

function subscribe(onStoreChange: () => void) {
  const query = window.matchMedia(QUERY)
  query.addEventListener('change', onStoreChange)
  return () => query.removeEventListener('change', onStoreChange)
}

function getSnapshot() {
  return window.matchMedia(QUERY).matches
}

/**
 * Réagit en direct au réglage système, sans le figer au montage.
 * Toute chorégraphie de ce projet est conditionnée par ce hook.
 */
export function usePrefersReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, () => false)
}

/** Vrai uniquement sur un pointeur de précision qui gère réellement le survol. */
export function supportsHover() {
  return window.matchMedia('(hover: hover) and (pointer: fine)').matches
}
