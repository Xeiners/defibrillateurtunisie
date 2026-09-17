import { CaretLeft, CaretRight } from '@phosphor-icons/react'
import { useAutoCarousel } from '@/animations/useAutoCarousel'
import { galleryImages } from '@/data/gallery'

/**
 * Voile au bas de la photo. Il ne décore pas : il donne un fond sombre aux
 * commandes, qui sinon tomberaient sur les zones claires de certaines photos.
 */
const CONTROLS_VEIL =
  'linear-gradient(to top, rgb(13 16 10 / 0.5) 0%, rgb(13 16 10 / 0) 100%)'

const NAV_CLASS =
  'grid size-9 cursor-pointer place-items-center rounded-full bg-[var(--surface-raised)]/90 text-[var(--text-primary)] shadow-[var(--shadow-panel)] transition-[background-color,scale] duration-300 hover:bg-[var(--surface-raised)] active:scale-95'

/**
 * Carrousel de photos, à droite des formules.
 *
 * FONDU ENCHAÎNÉ. Les photos sont superposées et seule l'opacité change : le
 * cadre ne bouge jamais, ce qui laisse le mouvement à la bande de cartes
 * voisine. Deux défilements latéraux côte à côte se disputeraient le regard.
 *
 * HAUTEUR. Sur grand écran, le cadre prend la hauteur des cartes (`h-full`) :
 * les deux colonnes s'arrêtent à la même ligne. Les photos sont posées en
 * absolu et n'imposent donc aucune hauteur à la rangée — ce sont les cartes
 * qui la fixent. Sous `lg`, le cadre passe sous les cartes avec un rapport 4:3.
 *
 * COMMANDES. Des traits pour choisir une photo, des flèches pour avancer ou
 * reculer. Survoler ou atteindre le carrousel au clavier suspend le défilement.
 */
export function PackGallery() {
  const carousel = useAutoCarousel(galleryImages.length)
  const count = galleryImages.length

  return (
    <div
      role="group"
      aria-roledescription="carrousel"
      aria-label="Défibrillateurs en situation"
      onPointerEnter={carousel.hold}
      onPointerLeave={carousel.release}
      onFocus={carousel.hold}
      onBlur={carousel.release}
      className="relative aspect-[4/3] w-full overflow-hidden rounded-[var(--radius-panel)] bg-[var(--surface-sunken)] lg:aspect-auto lg:h-full"
    >
      {galleryImages.map((image, index) =>
        carousel.mounted[index] ? (
          <img
            key={image.id}
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            decoding="async"
            // Seule la photo affichée est annoncée : les autres sont dans le
            // DOM pour le fondu, pas pour être lues.
            aria-hidden={index !== carousel.index}
            data-active={index === carousel.index}
            style={{ objectPosition: image.focus }}
            className="absolute inset-0 size-full object-cover opacity-0 transition-opacity duration-700 ease-[var(--ease-out-quint)] data-[active=true]:opacity-100"
          />
        ) : null,
      )}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-28"
        style={{ background: CONTROLS_VEIL }}
      />

      <div className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-3">
        <div className="flex items-center">
          {galleryImages.map((image, index) => {
            const isActive = index === carousel.index

            return (
              <button
                key={image.id}
                type="button"
                onClick={() => carousel.goTo(index)}
                aria-label={`Afficher la photo ${index + 1} sur ${count}`}
                aria-current={isActive}
                data-active={isActive}
                // Le trait fait 3px de haut, la cible 24px : le remplissage
                // est de la surface de clic, pas de l'espacement.
                className="group/dot flex h-6 cursor-pointer items-center px-1"
              >
                <span className="block h-[3px] w-4 rounded-full bg-white/50 transition-[width,background-color] duration-300 group-hover/dot:bg-white/80 group-data-[active=true]/dot:w-7 group-data-[active=true]/dot:bg-white" />
              </button>
            )
          })}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={carousel.showPrevious}
            aria-label="Photo précédente"
            className={NAV_CLASS}
          >
            <CaretLeft size={15} weight="bold" />
          </button>
          <button
            type="button"
            onClick={carousel.showNext}
            aria-label="Photo suivante"
            className={NAV_CLASS}
          >
            <CaretRight size={15} weight="bold" />
          </button>
        </div>
      </div>
    </div>
  )
}
