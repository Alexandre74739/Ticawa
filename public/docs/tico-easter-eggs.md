# Easter eggs de Tico (curseur)

Sur la landing, avec une souris uniquement (rien sur tactile), Tico suit le curseur et change de tête selon ce que fait l'utilisateur. Chaque humeur reprend une mascotte de `public/mascotte/`.

| Humeur | Déclencheur | Ce qui bouge |
|---|---|---|
| Neutre | par défaut | les pupilles suivent le curseur |
| Énervé | 3 clics rapides au même endroit | les paupières tombent, les symboles de rage ondulent |
| Brouillé | tracer au moins 3 cercles avec la souris en moins de 2 s | les pupilles en spirale tournent chacune dans un sens, le gribouillis tournoie |
| Surpris | un geste très brusque depuis une souris immobile (550 px en 130 ms) | les traits de vitesse s'étirent, les pupilles restent figées |
| Content | caresser Tico : quelques allers-retours sur lui | les « !! » ondulent |
| Perplexe | ne plus bouger la souris pendant 8 s | les « ?? » ondulent |
| Triste | sortir la souris de la fenêtre : Tico reste sur place | les pupilles bougent peu |
| Parfait | survoler n'importe quel `Button` | l'étincelle scintille, les yeux sont étoilés |

Brouillé, Surpris et Content durent 2,5 s. Si plusieurs humeurs sont possibles en même temps, la priorité est : Énervé > humeur de geste (Brouillé, Surpris, Content) > Parfait > Triste > Perplexe > Neutre.

## Où régler

- Seuils des gestes : `SPIN`, `FLICK`, `PET` dans `src/utils/moodTriggers.ts`
- Clics d'Énervé, durées, délai de Perplexe : `RAGE`, `FLASH_LASTS`, `IDLE_AFTER` dans `src/composables/useCursor.ts`
- Visages et déplacement des pupilles par humeur (`look`) : `src/data/ticoFaces.ts`
- Animations des décors : `src/components/ui/CursorTico.vue`
- Parfait détecte les boutons grâce à l'attribut `data-button` posé par `src/components/Button.vue`
