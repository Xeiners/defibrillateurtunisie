export type NavItem = {
  id: string
  label: string
  href: string
}

/**
 * Une entrée par section de l'accueil, dans l'ordre de lecture.
 *
 * Les ancres sont préfixées par `/` : depuis la page de devis, le lien ramène
 * à l'accueil ET s'arrête à la bonne section, au lieu de ne rien faire.
 */
export const primaryNav: NavItem[] = [
  { id: 'pourquoi', label: 'Pourquoi s’équiper', href: '/#pourquoi' },
  { id: 'sauver', label: 'Sauver une vie', href: '/#sauver-une-vie' },
  { id: 'offres', label: 'Nos packs', href: '/#offres' },
  { id: 'faq', label: 'FAQ', href: '/#faq' },
]

/**
 * TODO client : brancher les vraies pages légales avant mise en ligne.
 * Le footer n'affiche que les liens qui ont une destination.
 */
export const legalLinks: NavItem[] = [
  { id: 'mentions', label: 'Mentions légales', href: '' },
  { id: 'cgv', label: 'CGV', href: '' },
  { id: 'confidentialite', label: 'Confidentialité', href: '' },
]
