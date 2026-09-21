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

/**
 * `ignoreMobileResize` : sur mobile, la barre d'adresse qui se rétracte au
 * défilement change la hauteur de la fenêtre. Sans ce réglage, ScrollTrigger
 * recalcule tous ses repères en plein défilement — la page se fige une demi-
 * seconde, puis les éléments sautent à une nouvelle position.
 */
ScrollTrigger.config({ ignoreMobileResize: true })

/**
 * Au-delà de 500 ms de retard (onglet en arrière-plan, gros calcul), GSAP
 * considère que le temps ne s'est pas écoulé plutôt que de rattraper d'un bond.
 * C'est ce qui évite qu'une page laissée de côté rejoue toutes ses animations
 * en accéléré au retour.
 */
gsap.ticker.lagSmoothing(500, 24)

export { gsap, ScrollTrigger }
