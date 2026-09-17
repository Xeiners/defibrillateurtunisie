import { site } from '@/data/site'
import { cn } from '@/lib/cn'

type LogoProps = {
  /** `deep` = posé sur fond profond, `light` = posé sur fond clair. */
  tone?: 'deep' | 'light'
  className?: string
}

/**
 * Wordmark en deux temps : le mot porte l'appui, l'extension le territoire.
 * Les deux gardent la même graisse — c'est un seul mot — et seule la couleur
 * détache le `.TN`, ce qui donne une silhouette à un nom autrement long pour
 * une barre de navigation.
 *
 * Le corps descend d'un cran en dessous de `sm` : à 375px, la ligne complète
 * doit cohabiter avec le panier et le bouton du menu.
 */
export function Logo({ tone = 'deep', className }: LogoProps) {
  const isDeep = tone === 'deep'

  return (
    <a
      href="#top"
      aria-label={`${site.name}, retour en haut de page`}
      className={cn(
        'group inline-flex items-center gap-2 transition-opacity duration-300 hover:opacity-80',
        isDeep ? 'text-white' : 'text-[var(--text-primary)]',
        className,
      )}
    >
      {/* La marque est servie DEPUIS `public/`, comme le modèle 3D et les
          photos : elle se remplace sans reconstruire le site.

          Affichée telle quelle, dégradé compris. Elle a un temps été passée en
          masque recoloré sur `--accent-ink` pour tenir le contraste sur fond
          clair ; le vert olive obtenu jurait avec l'aplat de marque des
          boutons, à trois centimètres de là. Choix du client : on garde le
          vert du fichier. Une marque figurative n'est pas du texte — les
          seuils de contraste ne la visent pas.

          Pas de plaque derrière : elle n'existait que pour donner une assise à
          une icône de bibliothèque, et l'enfermer rétrécirait encore un dessin
          qui porte déjà sa propre marge (il n'occupe que ~2/3 de son carré,
          d'où la boîte de 36px pour un sigle qui en fait 26). */}
      <img
        src="/favicon.svg"
        alt=""
        aria-hidden="true"
        width={36}
        height={36}
        className="size-9 shrink-0"
      />

      {/* Aucun espacement entre les deux moitiés : elles forment un nom de
          domaine, que le point suffit à articuler. Un `gap` le casserait en
          deux mots. */}
      <span className="flex items-baseline text-[15px] leading-none whitespace-nowrap sm:text-[17px]">
        <span className="font-semibold tracking-[-0.02em]">
          {site.wordmark.lead}
        </span>
        {/* Le `.TN` porte l'aplat de marque sur LES DEUX fonds, celui-là même
            que remplit le bouton « Demander un devis ». Arbitrage du client,
            en connaissance de cause : sur fond clair cet aplat ne tient que
            1,16:1, là où `--accent-ink` en tenait 4,9:1. L'extension y sera
            donc pâle.

            C'est la seule entorse consentie à la règle de couleur du projet,
            et elle s'arrête ici : deux mots verts sur blanc, et le nom entier
            devenait illisible. « Defibrillateur » reste donc en encre, et le
            reste du site continue de passer par `--accent-ink`. Ne pas se
            servir de cette exception comme d'un précédent. */}
        <span
          className="font-semibold tracking-[-0.02em]"
          style={{ color: 'var(--accent)' }}
        >
          {site.wordmark.trail}
        </span>
      </span>
    </a>
  )
}
