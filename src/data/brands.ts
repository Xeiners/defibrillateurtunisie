export type Brand = {
  id: string
  /** Nom du client : il sert aussi de texte alternatif au logo. */
  name: string
  /** Chemin du logo, servi depuis `public/marques/`. */
  logo: string
}

export type BrandGroup = {
  id: string
  /** Intitulé du secteur, en français : traduit par `t()` à l'affichage. */
  label: string
  brands: Brand[]
}

/**
 * Clients affichés dans la bande « Ils nous font confiance », rangés par
 * secteur : chaque groupe a sa propre colonne et son propre défilement.
 *
 * Ce sont des RÉFÉRENCES CLIENTS, pas des marques d'appareils : afficher un
 * logo ici affirme que l'établissement est équipé par nous. Ne garder que ceux
 * dont l'accord est acquis.
 *
 * Les fichiers sont recadrés au plus près du logo : sans cela, leurs marges
 * blanches les faisaient paraître de tailles différentes dans la bande. Pour en
 * ajouter un, déposer le fichier dans `public/marques/`, le recadrer de même et
 * l'inscrire dans le groupe de son secteur.
 */
export const brandGroups: BrandGroup[] = [
  {
    id: 'industrie',
    label: 'Industrie & services',
    brands: [
      { id: 'airbus', name: 'Airbus', logo: '/marques/airbus.svg' },
      { id: 'steg', name: 'STEG', logo: '/marques/steg1.png' },
      { id: 'eni-sergaz', name: 'ENI Sergaz', logo: '/marques/eni_sergaz.jpg' },
      { id: 'sagemcom', name: 'Sagemcom', logo: '/marques/sagemcom.png' },
      { id: 'teleperformance', name: 'Teleperformance', logo: '/marques/teleperformance.png' },
    ],
  },
  {
    id: 'banques-commerce',
    label: 'Banques & commerce',
    brands: [
      { id: 'amen-bank', name: 'Amen Bank', logo: '/marques/amen_bank.png' },
      { id: 'uib', name: 'UIB', logo: '/marques/uib.png' },
      { id: 'banque-de-tunisie', name: 'Banque de Tunisie', logo: '/marques/banque_de_tunisie.png' },
      { id: 'carrefour', name: 'Carrefour', logo: '/marques/carrefour.png' },
      { id: 'planetfoot', name: 'Planet Foot', logo: '/marques/planetfoot.png' },
    ],
  },
  {
    id: 'hotellerie',
    label: 'Hôtellerie & loisirs',
    brands: [
      { id: 'movenpick', name: 'Mövenpick', logo: '/marques/movenpick.png' },
      { id: 'sheraton', name: 'Sheraton', logo: '/marques/sheraton.png' },
      { id: 'elmouradi', name: 'El Mouradi', logo: '/marques/elmouradi.png' },
      { id: 'laico', name: 'Laico', logo: '/marques/laico.png' },
      { id: 'magic-hotel', name: 'Magic Hotels', logo: '/marques/magichotel.png' },
      { id: 'royal-garden', name: 'Royal Garden', logo: '/marques/royalgarden.png' },
      { id: 'ulysse', name: 'Ulysse', logo: '/marques/ulysse.png' },
      { id: 'iberos', name: 'Iberos', logo: '/marques/iberos.png' },
      { id: 'la-cigale', name: 'La Cigale', logo: '/marques/la-cigale.png' },
      { id: 'republique', name: 'La République', logo: '/marques/republique.png' },
    ],
  },
]
