# Couche animation

Tout passe par **GSAP + ScrollTrigger** (`gsap.ts` enregistre le plugin et pose
les réglages globaux, une seule fois). Les effets sont déclarés dans le balisage
et pilotés par des hooks.

| Hook                  | Où                  | Rôle                                                                 |
| --------------------- | ------------------- | -------------------------------------------------------------------- |
| `useScrollEffects`    | `App.tsx` (`Shell`) | Apparitions déclarées par `data-anim`, compteurs `data-count`, glissement `data-scrub-x`, tracés `data-draw` |
| `useMarquee`          | `BrandsBand`        | Boucle continue des logos                                            |
| `useMarqueeCopies`    | `BrandsBand`        | Nombre de copies à poser sur la piste                                |
| `useHorizontalScroll` | —                   | Piste horizontale liée au défilement (disponible, non utilisé)       |

Le volet blanc ne passe pas par un hook : `@/lib/page-transition` pilote
`<PageCurtain>` en GSAP. Il tient DEUX rôles avec le même élément —
l'ouverture du site (cœur qui bat, filet de progression nourri par
`@/lib/loading-progress`), puis les changements de page, que le routeur lui
confie.

Valeurs de `data-anim` : `up` (défaut), `left`, `right`, `pop`, `clip`,
`words` (mots marqués `data-word`, voir `SplitWords`), `stagger`, `grow`.
Retard optionnel avec `data-delay`.

## Règles

- `useScrollEffects` est monté AU-DESSUS des sections, dans `Shell`, et reçoit
  le chemin courant : tout est reposé à neuf à chaque changement de page.
- Il tourne en `useLayoutEffect` : l'état de départ est posé avant que le
  navigateur ne peigne. En `useEffect`, on voyait l'élément une image à sa
  position finale avant qu'il ne disparaisse pour s'animer.
- **Aucun `filter: blur()` animé.** Un flou sur une grande surface se repeint à
  chaque image et fait tomber le nombre d'images par seconde. Le mouvement vient
  de l'opacité, de l'échelle et du déplacement — tout ce que le GPU compose.
- La promotion GPU est laissée à GSAP (`force3D: 'auto'`) : la couche est posée
  le temps du mouvement, puis relâchée. Pas de `will-change` écrit à la main sur
  les éléments animés par GSAP ; il n'est posé, en CSS, que sur les bandes qui
  défilent en continu.
- **Pas de `scroll-behavior: smooth` en CSS.** Il fait trembler tout ce qui est
  lié au défilement (`scrub`). Le défilement doux des ancres est assuré par le
  routeur, ponctuellement.
- **La transformation d'un élément animé par GSAP lui appartient entièrement.**
  Une `transform` écrite en HTML ou en CSS lui revient en PIXELS, et il y ajoute
  la sienne : un volet posé à `translateY(100%)` puis animé en `yPercent` part
  de deux fois la hauteur de l'écran. L'état de repos se dit autrement
  (`visibility`), ou se pose par un `gsap.set`.
- **Le changement de page se fait à couvert.** Remplacer une page par l'autre
  coûte quelques dizaines de millisecondes de rendu, pendant lesquelles rien ne
  peut bouger à l'écran. Ce temps mort tombe au milieu du temps couvert par le
  volet, là où il n'y a rien à voir — d'où le volet plutôt qu'un fondu.
- **Un blocage se range là où rien ne bouge, pas sous le mouvement.** La mise en
  place des apparitions d'une page coûte une image ; relâchée dans le
  `onComplete` du volet, elle tombait dans la même image que son dernier pas et
  le volet s'accrochait. Une image plus tard (`requestAnimationFrame`), l'écran
  est immobile et la même image perdue ne se voit plus.
- **Une montée part vite, une sortie s'étire.** Le volet couvre en `power3.out`
  et se relève en `power2.inOut`. En `inOut` des deux côtés, il n'avait parcouru
  que six pour cent de sa course au bout de cent millisecondes : le clic
  semblait sans effet.
- **N'animer que `transform` et `opacity`.** `clip-path` n'est PAS composé par
  le GPU dans Chrome : une première version de la transition l'animait et
  tournait à 30-45 images par seconde. Le volet, lui, ne perd aucune image.
- **`ScrollTrigger.refresh()` ne s'appelle JAMAIS pendant que la page défile.**
  Il relève la position de défilement en entrant et la RESTAURE en sortant : au
  mauvais moment, il annule le mouvement en cours. Un seul recalcul est posé, à
  la fin du chargement des polices — le seul décalage que ScrollTrigger ne voit
  pas de lui-même. Les images, elles, n'en imposent aucun : toutes leurs cases
  ont une hauteur fixe dans le balisage.
- Un conteneur qui porte un élément collant (`sticky`) utilise
  `overflow-x-clip`, jamais `overflow-hidden`, qui casserait le collage.
- Sous « mouvement réduit », aucun effet n'est posé et le contenu reste
  visible. Le repérage de l'étape active (`SaveLifeSection`) tourne quand
  même : ce n'est pas une animation.

## Deux courbes, deux usages

- `--ease-out-expo` : entrées et révélations. Départ franc, arrivée très
  amortie.
- `--ease-smooth` (`ease-smooth` en classe) : interface — survols, dépliages,
  bascules. `out-expo` sur 300 ms donne l'impression que l'élément colle au
  doigt ; celle-ci démarre tout de suite.
