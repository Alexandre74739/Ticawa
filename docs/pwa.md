# PWA

Ticawa s'installe sur l'écran d'accueil d'un téléphone et s'ouvre alors comme une app, sans barre de navigateur. La configuration est dans le bloc `pwa` de [nuxt.config.ts](../nuxt.config.ts) (module `@vite-pwa/nuxt`).

## Manifeste

| Réglage | Valeur |
|---|---|
| Page d'ouverture | `/dashboard` |
| Affichage | `standalone`, en portrait |
| Couleurs | barre d'état indigo, écran de lancement lavande |
| Icônes | `public/pwa/` : 192 px, 512 px et une version « maskable » pour Android |

Le manifeste n'est ajouté à la page que sur mobile ([pwa.client.ts](../app/plugins/pwa.client.ts)) : l'app n'est pas prévue pour ordinateur, seule la landing l'est.

Les icônes sont appelées avec `?v=2`. Pour changer une icône, augmenter ce numéro partout, sinon les téléphones gardent l'ancienne en cache.

## Installation

- **Android (Chrome)** : le navigateur envoie un événement `beforeinstallprompt`. Le plugin le garde de côté, et `usePwaInstall().install()` ouvre la vraie fenêtre d'installation.
- **iPhone, ou navigateur sans cet événement** : `install()` ouvre `PwaInstallGuide`, qui explique la marche à suivre.

`useDevice().isStandalone` indique si l'app tourne déjà en mode installé.

## Mises à jour

Le service worker met à jour l'app tout seul (`registerType: "autoUpdate"`). Il cherche une nouvelle version toutes les heures, et chaque fois que l'app revient au premier plan avec du réseau.

Il met en cache le JavaScript, le CSS, les images et les polices, mais pas les pages (`navigateFallback: null`). Sans réseau, l'app ne s'ouvre donc pas : aucun mode hors ligne pour l'instant.

**Annoncer une nouveauté** : ajouter une entrée en tête de [app/data/changelog.ts](../app/data/changelog.ts), avec un `id` qui n'a jamais servi. Au prochain passage d'un utilisateur connecté, la modale `WhatsNewModal` s'ouvre, sauf s'il a désactivé « Afficher les nouveautés » dans ses paramètres. Lors de la toute première visite, la version est retenue sans être annoncée.

Ce réglage et la dernière version vue sont gardés dans le `localStorage` de l'appareil (`ticawa:show-updates`, `ticawa:last-update-seen`) : ils ne suivent pas le compte d'un appareil à l'autre.

## Autorisations de l'appareil

[usePermissions](../app/composables/usePermissions.ts) suit trois autorisations. Leur état est `granted`, `prompt`, `denied` ou `unsupported`.

| Autorisation | Sert à | Particularité |
|---|---|---|
| `notifications` | alertes sur le téléphone | sur iPhone, disponible seulement une fois l'app installée |
| `camera` | photographier un ticket | Firefox ne donne pas l'état à l'avance : on le découvre à la demande |
| `storage` | empêcher le navigateur d'effacer les données locales | un refus n'est pas mémorisé par le navigateur, seulement jusqu'à la fermeture de l'app |

Les états sont relus chaque fois que l'app revient au premier plan, pour tenir compte d'un changement fait dans les réglages du téléphone.

Une app web ne peut pas retirer elle-même une autorisation. `RevokeModal` explique comment faire dans les réglages d'iPhone ou d'Android. Pour les notifications, `useStopPush` coupe tout de suite l'envoi de son côté.

## Capacitor

L'app doit rester empaquetable plus tard avec Capacitor pour les stores. Éviter tout ce qui suppose un navigateur classique sans alternative : les API web utilisées ici (notifications, caméra, stockage) ont des équivalents Capacitor.

## Scan des tickets

Le scan n'est proposé que dans l'app installée. La lecture se fait **sur l'appareil** :
- **photo** : [Tesseract.js](https://github.com/naptha/tesseract.js) (OCR open source, WebAssembly). Ses fichiers (moteur, modèle français) sont copiés dans `public/ocr/` par [scripts/ocr-assets.mjs](../scripts/ocr-assets.mjs) à chaque `npm install`, pour ne jamais passer par un CDN. Ils sont hors du pré-cache (~5 Mo) et mis en cache au premier scan ;
- **PDF** : [pdf.js](https://mozilla.github.io/pdf.js/) extrait le texte ; un PDF scanné (sans texte) passe par l'OCR.

Le texte est ensuite découpé en champs par [app/utils/receipt.ts](../app/utils/receipt.ts). Si la lecture échoue, le ticket est enregistré quand même, avec une fiche à compléter.

## Tester la version installée depuis un PC

Le mode installé dépend de `display-mode: standalone`, que le serveur de dev ne reproduit pas. Deux méthodes, sans toucher au code :

**Sur le PC (Chrome ou Edge)** : l'installation n'est pas proposée sur ordinateur. Pour installer une fois l'app de dev, activer **temporairement** :
- dans [pwa.client.ts](../app/plugins/pwa.client.ts), la condition `if (useDevice().isDesktop.value && !import.meta.dev) return;` ;
- dans [nuxt.config.ts](../nuxt.config.ts), `pwa.devOptions: { enabled: true, suppressWarnings: true, type: "module", navigateFallbackAllowlist: [/^$/] }` (l'allowlist vide empêche de servir une page depuis le cache).

Lancer `npm run dev`, ouvrir `http://localhost:3000`, installer via l'icône de la barre d'adresse (ou ⋮ → « Caster, enregistrer et partager » → « Installer la page en tant qu'application »), puis retirer les deux réglages. L'app reste installée : elle s'ouvre dans sa fenêtre, en mode installé, avec le rechargement à chaud ; `Ctrl+Maj+I` y ouvre les DevTools. Désinstaller : ⋮ dans la fenêtre de l'app → « Désinstaller ».

**Sur un vrai téléphone Android** : activer le débogage USB, brancher le téléphone, ouvrir `chrome://inspect/#devices` dans Chrome sur Windows, « Port forwarding » : `3000` → `localhost:3000`. Sur le téléphone, ouvrir `http://localhost:3000` dans Chrome (contexte sécurisé : caméra autorisée), installer l'app, puis l'inspecter depuis `chrome://inspect` (elle y apparaît avec sa console et son réseau).
