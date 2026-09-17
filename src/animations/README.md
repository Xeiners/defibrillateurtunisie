# Couche animation

Deux moteurs cohabitent. Ils ne se marchent jamais dessus parce que le partage
est fait **par élément du DOM**, pas par propriété.

| Moteur       | Rôle                                             | Éléments qu'il pilote                                                        |
| ------------ | ------------------------------------------------ | ---------------------------------------------------------------------------- |
| **GSAP**     | Chorégraphie d'entrée, boucle produit, scroll    | `[data-hero="…"]` (`panel`, `media`, `nav`, `line`, `sub`, `cta`, `spec`), la piste de la boucle, et `[data-reveal]` des sections |
| **anime.js** | Couche réactive au pointeur et retours d'état    | enfants de carte `[data-card="inner" \| "media" \| "action"]`, compteur du panier, pastille et panneaux d'onglets `[data-panel-item]` |

Dans la section des formules, la frontière est la même : GSAP révèle l'en-tête
et la barre d'onglets (`[data-reveal]`), anime.js anime le contenu du panneau
(`[data-panel-item]`). Aucun élément ne porte les deux attributs.

Règle absolue : **GSAP ne touche jamais aux enfants d'une carte, anime.js ne
touche jamais à la racine d'une carte ni à la piste.** L'étagère
`[data-hero="shelf"]` porte l'entrée et la parallaxe (GSAP), la piste interne
porte la boucle (GSAP), et l'enfant `[data-card="inner"]` porte le survol
(anime.js). Trois niveaux, trois propriétaires, aucun conflit de frame.

Corollaire : l'entrée du hero anime l'**étagère en bloc**, jamais carte par
carte. Les cartes appartiennent à la piste, qui possède déjà leur
transformation, et elles sont dupliquées pour la boucle.

## Justification de chaque animation

Aucune animation n'est décorative. Chacune répond à une intention :

- **Ouverture du panneau visuel** (`clipPath`) : un volet qui se lève dit « on
  découvre », là où un fondu ne dit rien. Il monte pendant que le titre
  descend : les deux gestes se croisent au lieu de se suivre.
- **Fondu-échelle du visuel** : la scène se pose au lieu d'apparaître d'un bloc.
- **Révélation ligne à ligne du titre** : hiérarchie, la promesse arrive en premier.
- **Arrivée latérale de l'étagère** : le catalogue entre après le message, jamais avant.
- **Boucle produit** : le catalogue est plus large que l'écran, le mouvement dit
  qu'il continue au-delà du bord.
- **Ralenti au survol de la piste** : rendre une carte cliquable sans la
  poursuivre à la souris.
- **Parallaxe au scroll** : profondeur, le hero se comporte comme un décor.
- **Survol de carte** : indique sans ambiguïté quelle carte est active.
- **Pulsation du compteur de panier** : confirme l'ajout, la carte cliquée
  pouvant déjà être sortie du champ au moment du clic.
- **Cascade des sections** : la révélation suit l'ordre de lecture.
- **Glissement des onglets de formules** : le contenu entre du côté d'où vient
  l'onglet choisi, ce qui rend le déplacement lisible plutôt que brutal.

Une exception assumée à la règle « transform et opacity seulement » : le cadre
des onglets anime sa **hauteur** (`usePanelTransition`). Un élément, 620ms,
déclenché par un clic. Aucune alternative en transform n'ouvre un conteneur
sans déformer son contenu.

## Mouvement réduit

`usePrefersReducedMotion` est branché sur `matchMedia` en direct
(`useSyncExternalStore`) : le réglage est pris en compte même s'il change en
cours de session. Toutes les timelines sont alors court-circuitées et les
éléments restent à leur état CSS naturel, qui est **déjà l'état final**.

Trois comportements dégradent au lieu de disparaître :

- la piste produit devient une liste défilable à la main, et la copie de
  bouclage n'est plus rendue (elle deviendrait un doublon de contenu) ;
- le survol de carte garde un retour visuel, porté par le CSS et devenu
  instantané ;
- la bande vidéo ne démarre plus seule et rend les commandes natives.

Un garde-fou CSS complète le dispositif dans `src/styles/index.css`.
