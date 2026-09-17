import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/**
 * Point d'entrée GSAP unique de l'application.
 *
 * L'enregistrement des plugins se fait ICI et nulle part ailleurs : importer
 * `gsap` depuis ce module garantit que ScrollTrigger est disponible, sans
 * risque de double enregistrement.
 */
gsap.registerPlugin(ScrollTrigger)

export { gsap, ScrollTrigger }
