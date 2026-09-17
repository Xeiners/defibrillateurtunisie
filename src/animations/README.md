# Couche animation

Tout passe par **GSAP + ScrollTrigger** (`gsap.ts` enregistre le plugin une
seule fois). Les effets sont déclarés dans le balisage et pilotés par des hooks.

| Hook                  | Où                  | Rôle                                                                 |
| --------------------- | ------------------- | -------------------------------------------------------------------- |
| `useScrollEffects`    | `App.tsx`           | Apparitions déclarées par `data-anim`, compteurs `data-count`, glissement `data-scrub-x`, tracés `data-draw` |
| `useMarquee`          | `BrandsBand`        | Boucle continue des logos                                            |

Valeurs de `data-anim` : `up` (défaut), `left`, `right`, `pop`, `clip`,
`words` (mots marqués `data-word`, voir `SplitWords`), `stagger`. Retard
optionnel avec `data-delay`.

Règles :

- `useScrollEffects` est monté AU-DESSUS des sections : leurs épinglages
  existent quand il calcule ses déclencheurs.
- Un conteneur qui porte un élément collant (`sticky`) utilise
  `overflow-x-clip`, jamais `overflow-hidden`, qui casserait le collage.
- Sous « mouvement réduit », aucun effet n'est posé et le contenu reste
  visible. Le repérage de l'étape active (`SaveLifeSection`) tourne quand
  même : ce n'est pas une animation.
