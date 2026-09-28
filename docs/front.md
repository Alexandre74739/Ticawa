# Front

## Pages

| Route | Fichier | Accès | Contenu |
|---|---|---|---|
| `/` | `index.vue` | public | landing : hero, produit, cas concrets, FAQ, appel à l'action |
| `/connexion` | `connexion.vue` | visiteur | email et mot de passe, ou Google |
| `/inscription` | `inscription.vue` | visiteur | sans `?token` : formulaire et acceptation des CGU, puis envoi du lien de confirmation. Avec : crée le compte et entre dans l'espace |
| `/mot-de-passe` | `mot-de-passe.vue` | tous | sans `?token` : demander un lien. Avec : choisir le mot de passe |
| `/dashboard` | `dashboard.vue` | connecté | espace personnel (encore vide) |
| `/compte` | `compte.vue` | connecté | profil (lecture seule), mot de passe, export des données, suppression du compte |
| `/parametres` | `parametres.vue` | connecté | notifications, nouveautés, autorisations de l'appareil |
| `/cgu`, `/confidentialite`, `/mentions-legales` | | public | pages légales, construites avec `LegalPage` et `LegalSection` |

Toute autre adresse affiche [error.vue](../app/error.vue), avec Tico en « Page introuvable » pour les 404.

Cliquer sur l'onglet de la page déjà ouverte remonte en haut et relance ses animations d'entrée ([app.vue](../app/app.vue)).

## Composants par domaine

| Dossier | Préfixe | Contenu |
|---|---|---|
| `ui/` | `Ui` | briques génériques, détaillées plus bas |
| `ui/tico/` | `UiTico` | la mascotte : SVG animé, carte, yeux qui suivent le pointeur |
| `landing/` | `Landing` | sections de la page d'accueil |
| `account/` | `Account` | cartes de `/compte`, et `AccountCard`, le cadre commun des cartes |
| `settings/` | `Settings` | cartes de `/parametres`, et `SettingsPanel`, un bloc titré dans une carte |
| `auth/` | `Auth` | cadre des pages de connexion, bouton Google |
| `layout/` | `Layout` | en-tête, pied de page, barre d'onglets mobile, menu utilisateur |
| `legal/` | `Legal` | mise en page des pages légales |
| `motion/` | `Motion` | apparitions animées (`FadeUp`, `Reveal`, `PopIn`…) |
| `cursor/` | | le curseur Tico, voir [tico-easter-eggs.md](tico-easter-eggs.md) |
| `pwa/` | `Pwa` | guide d'installation sur l'écran d'accueil |

## Composants `ui/`

| Composant | Props principales | Usage |
|---|---|---|
| `UiButton` | `variant` (`primary`, `light`, `ghost`, `danger`), `size` (`md`, `lg`), `to`, `href`, `arrow` | action. Devient `NuxtLink` avec `to`, `<a>` avec `href` |
| `UiInput` | `v-model`, `label`, `type`, `hint` | champ de formulaire. En `password`, un bouton affiche ou masque le texte |
| `UiToggle` | `v-model`, `label`, `description`, `disabled` | interrupteur on/off pour un réglage immédiat (`role="switch"`) |
| `UiAlert` | `tone` (`success`, `danger`) | message de retour après une action |
| `UiLabelCard` | `tone` (`info`, `trust`) | encadré d'information |
| `UiModal` | `v-model`, `labelledby` | fenêtre modale : bloque le reste de la page et rend le focus à la fermeture |
| `UiQrCode` | `value`, `label` | QR code en SVG, généré localement |
| `UiSourceLink` | `source` | lien vers une source officielle |

`UiButton` pose l'attribut `data-button`, qui déclenche l'humeur « Parfait » du curseur Tico.

## Composables

| Composable | Rôle |
|---|---|
| `useAction(fn)` | lance une action asynchrone et expose `pending`, `error` (message de l'API), `done` et `execute()` |
| `useAuthForm(url, { redirect })` | envoie un formulaire de connexion ou d'inscription, puis redirige. Avec `redirect: false`, s'arrête sur `done` sans rediriger (demande d'inscription) |
| `useNotificationSettings()` | charge et enregistre les réglages de notification. L'affichage change aussitôt et revient en arrière si l'enregistrement échoue |
| `useStopPush()` | désabonne ce téléphone des notifications et coupe le canal push |
| `usePermissions()` | état des autorisations notifications, caméra et stockage, relu quand l'app revient au premier plan |
| `useDevice()` | `platform` (`ios`, `android`, `desktop`) et `isStandalone` (app installée) |
| `useDashboardMode()` | `limited` sur ordinateur pour un non-admin, sinon `full`. Non utilisé pour l'instant |
| `usePwaInstall()` | propose l'installation, ou ouvre le guide quand le navigateur ne sait pas le faire |
| `useWhatsNew()` | réglage « Afficher les nouveautés » et ouverture de la modale après une mise à jour |
| `useCursor`, `useTicoEyes`, `useRace` | animations : curseur Tico, regard de la mascotte, course du bandeau de la landing |

Les réglages de notification sont mis en cache sous la clé `settings`. `useStopPush` y accède avec `useNuxtData("settings")` pour que la carte Notifications se mette à jour sans recharger.

## Design system

Les couleurs et les polices sont déclarées dans [main.css](../app/assets/css/main.css), bloc `@theme`, et s'utilisent comme classes Tailwind.

| Classe | Couleur | Usage |
|---|---|---|
| `indigo` | #5A67B8 | marque, boutons, actions |
| `ink` | #2A2E3A | texte |
| `paper` | #FBF9F5 | fond, texte sur aplat indigo |
| `lavender` | #E8E7F6 | surfaces, cartes |
| `terracotta` | #A15B42 | accent, action dangereuse |
| `success` / `warning` / `danger` | #3F7A5E / #8A5E12 / #B04A4A | états de couverture : actif, bientôt expiré, expiré |

Un état de couverture s'affiche toujours avec sa couleur, une icône et un libellé : la couleur seule ne suffit pas.

| Classe | Police | Usage |
|---|---|---|
| `font-display` | Bricolage Grotesque | titres et boutons |
| `font-serif` | Instrument Serif, en italique | mot d'accent dans un titre |
| `font-sans` | DM Sans | texte courant (par défaut) |

Les polices sont servies par le site lui-même (@fontsource) : aucun appel à Google Fonts.

La variante `standalone:` s'applique seulement quand l'app est lancée depuis l'écran d'accueil. Exemple : `pt-28 standalone:pt-6` réduit la marge du haut quand il n'y a pas de barre du navigateur.

Les icônes viennent de `@lucide/vue`. Les illustrations de Tico sont dans `public/mascotte/` et s'affichent avec `<UiTicoMascot mascot="Happy.svg" />`.

## Règles d'écriture

- Interface en français, avec l'apostrophe typographique `’` dans les textes affichés.
- Caractères réels dans les gabarits Vue, pas d'entités HTML.
- Les animations respectent `prefers-reduced-motion` : `MotionConfig reduced-motion="user"` dans le layout, et un test explicite dans les composables d'animation.
