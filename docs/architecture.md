# Architecture

Ticawa est une seule application Nuxt 4 : les pages Vue et l'API tournent dans le même projet et sont déployées ensemble sur Vercel. Le rendu serveur (SSR) est actif sur toutes les pages.

```
Navigateur / PWA installée
   │  pages rendues côté serveur, puis app Vue côté client
   ▼
Nuxt (Vercel) ─── app/      pages, composants, composables
   │          ─── server/   API /api/*, route OAuth /auth/google
   ├──► PostgreSQL          comptes, réglages, jetons, limites de débit
   ├──► Brevo               envoi des mails
   └──► Google OAuth        « Continuer avec Google »
```

## Arborescence

| Dossier | Contenu |
|---|---|
| `app/pages/` | une page par route : `index.vue` → `/`, `parametres.vue` → `/parametres` |
| `app/layouts/default.vue` | cadre commun : curseur Tico, en-tête, pied de page, barre d'onglets, modales globales |
| `app/components/` | composants, rangés par domaine (voir plus bas) |
| `app/composables/` | logique réutilisable `useXxx()` |
| `app/data/` | contenus statiques : textes de la landing, changelog, autorisations, visages de Tico |
| `app/middleware/` | gardes de navigation `auth` et `guest` |
| `app/plugins/` | `pwa.client.ts` : service worker et installation |
| `app/utils/` | fonctions sans état Vue : animations, effets du curseur |
| `app/assets/css/main.css` | Tailwind, polices, couleurs du thème |
| `server/api/` | routes JSON, voir [api.md](api.md) |
| `server/routes/auth/` | connexion Google (hors `/api`, car c'est une redirection) |
| `server/middleware/` | `session.ts` : ferme les sessions révoquées ou inactives depuis 90 jours, renouvelle les autres une fois par jour, voir [authentification.md](authentification.md#durée-de-la-session) |
| `server/utils/` | accès base, mails, validation, limitation de débit |
| `shared/` | code importable à la fois par `app/` et `server/` |
| `public/` | fichiers servis tels quels : mascottes, icônes PWA |

## Imports automatiques

Nuxt importe tout seul les composants, les composables et les utilitaires serveur : il n'y a pas d'`import` à écrire pour eux.

**Composants** : le nom vient du chemin. Un fichier dont le nom répète le dossier n'est pas dupliqué.

| Fichier | Balise |
|---|---|
| `components/ui/Button.vue` | `<UiButton>` |
| `components/ui/tico/TicoCard.vue` | `<UiTicoCard>` |
| `components/settings/Panel.vue` | `<SettingsPanel>` |
| `components/settings/notifications/NotificationsCard.vue` | `<SettingsNotificationsCard>` |
| `components/account/Card.vue` | `<AccountCard>` |

**Composables** (`app/composables/`) et **utilitaires serveur** (`server/utils/`) : toute fonction exportée est disponible partout de leur côté. `useDb()`, `rateLimit()` ou `findUserById()` s'utilisent donc directement dans les routes API.

**Types** : ils s'importent explicitement, avec `import type`, depuis `~/composables/...` ou `#shared/types/...`.

## Où ranger quoi

- **Un texte ou une liste qui ne dépend pas de l'utilisateur** : `app/data/`. Exemple : les questions de la FAQ dans `home.ts`, les nouveautés dans `changelog.ts`.
- **De la logique partagée entre plusieurs composants** : un composable. S'il garde un état commun à toute l'app, déclarer cet état hors de la fonction (`usePermissions`, `useDevice`) ou via `useState` (`useWhatsNew`).
- **Un composant trop long** : le découper dans le dossier du domaine. `NotificationsCard.vue` délègue ses données à `useNotificationSettings` et son panneau « Canal » à `ChannelsPanel.vue`.
- **Une requête SQL** : une fonction dans `server/utils/`, jamais directement dans une route.

## Rendu serveur et code navigateur

Les pages sont d'abord rendues sur le serveur, où `window`, `navigator` et `localStorage` n'existent pas. Le code qui en a besoin doit tourner :
- dans `onMounted` (`usePermissions`, `useWhatsNew().load`) ;
- dans un plugin `.client.ts` ;
- ou derrière `import.meta.client` (`useDevice`).

Si le HTML serveur et le premier rendu client diffèrent, Vue signale une erreur d'hydratation. Pour un contenu qui dépend de l'appareil, utiliser `<ClientOnly>` (voir [parametres.vue](../app/pages/parametres.vue)) ou n'afficher la version client qu'après le montage (voir [useDashboardMode.ts](../app/composables/useDashboardMode.ts)).

## Écarts avec le cahier des charges

[CLAUDE.md](../CLAUDE.md) prévoit Baserow comme base de données. Le code utilise aujourd'hui PostgreSQL directement, via le client `postgres` ([server/utils/db.ts](../server/utils/db.ts)). Le choix de l'hébergeur doit respecter la contrainte d'hébergement dans l'UE.

Les analytics européennes (Plausible ou Matomo) ne sont pas encore branchées.
