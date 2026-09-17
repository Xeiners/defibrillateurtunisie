export type Brand = {
  id: string
  /** Nom du client : il sert aussi de texte alternatif au logo. */
  name: string
  /** Chemin du logo, servi depuis `public/marques/`. */
  logo: string
}

/**
 * Clients affichés dans la bande « Ils nous font confiance ».
 *
 * Ce sont des RÉFÉRENCES CLIENTS, pas des marques d'appareils : afficher un
 * logo ici affirme que l'établissement est équipé par nous. Ne garder que ceux
 * dont l'accord est acquis.
 *
 * Les fichiers sont recadrés au plus près du logo : sans cela, leurs marges
 * blanches les faisaient paraître de tailles différentes dans la bande. Pour en
 * ajouter un, déposer le fichier dans `public/marques/`, le recadrer de même et
 * l'inscrire ici.
 */
export const brands: Brand[] = [
  { id: 'carrefour', name: 'Carrefour', logo: '/marques/carrefour.png' },
  { id: 'steg', name: 'STEG', logo: '/marques/steg1.png' },
  { id: 'amen-bank', name: 'Amen Bank', logo: '/marques/amen_bank.png' },
  { id: 'banque-de-tunisie', name: 'Banque de Tunisie', logo: '/marques/banque_de_tunisie.png' },
  { id: 'uib', name: 'UIB', logo: '/marques/uib.png' },
  { id: 'sagemcom', name: 'Sagemcom', logo: '/marques/sagemcom.png' },
  { id: 'teleperformance', name: 'Teleperformance', logo: '/marques/teleperformance.png' },
  { id: 'eni-sergaz', name: 'ENI Sergaz', logo: '/marques/eni_sergaz.jpg' },
  { id: 'movenpick', name: 'Mövenpick', logo: '/marques/movenpick.png' },
  { id: 'sheraton', name: 'Sheraton', logo: '/marques/sheraton.png' },
  { id: 'elmouradi', name: 'El Mouradi', logo: '/marques/elmouradi.png' },
  { id: 'laico', name: 'Laico', logo: '/marques/laico.png' },
  { id: 'magic-hotel', name: 'Magic Hotels', logo: '/marques/magichotel.png' },
  { id: 'royal-garden', name: 'Royal Garden', logo: '/marques/royalgarden.png' },
  { id: 'ulysse', name: 'Ulysse', logo: '/marques/ulysse.png' },
  { id: 'iberos', name: 'Iberos', logo: '/marques/iberos.png' },
  { id: 'la-cigale', name: 'La Cigale', logo: '/marques/la-cigale.png' },
  { id: 'planetfoot', name: 'Planet Foot', logo: '/marques/planetfoot.png' },
  { id: 'republique', name: 'La République', logo: '/marques/republique.png' },
]
