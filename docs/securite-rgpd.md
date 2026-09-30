# Sécurité et RGPD

## En-têtes HTTP

Définis dans [nuxt.config.ts](../nuxt.config.ts) et envoyés sur toutes les pages.

| En-tête | Effet |
|---|---|
| `X-Content-Type-Options: nosniff` | le navigateur respecte le type annoncé des fichiers |
| `X-Frame-Options: DENY` | le site ne peut pas être affiché dans une iframe |
| `Referrer-Policy: strict-origin-when-cross-origin` | les autres sites ne voient que le domaine d'origine, pas l'adresse complète |
| `Permissions-Policy` | caméra autorisée pour le site lui-même, micro et géolocalisation bloqués |

En production seulement, parce que le serveur de dev n'est pas en HTTPS :
- **Content-Security-Policy** : scripts, styles, images, polices et appels réseau limités au domaine du site. Aucune ressource tierce ne peut se charger, ce qui garantit qu'aucun visiteur n'envoie son IP à un autre service en ouvrant une page. `'unsafe-inline'` reste nécessaire pour les scripts que Nuxt insère dans la page.
- **Strict-Transport-Security** : HTTPS obligatoire pendant un an.

Ajouter un service externe côté navigateur (analytics, carte, vidéo…) demande de l'ajouter à la CSP. Il faut d'abord vérifier qu'il respecte les contraintes de souveraineté.

## Limitation de débit

[rateLimit(clé, max, fenêtre)](../server/utils/rateLimit.ts) compte les appels en base, dans la table `rate_limits`, et répond **429** au-delà du maximum. Le compteur tient donc entre les instances Vercel. `consumeQuota()` compte de la même façon mais ne répond rien : c'est l'appelant qui décide, par exemple ne pas envoyer un mail sans le signaler.

| Clé | Maximum |
|---|---|
| `login:ip:*` | 20 / 15 min |
| `login:email:*` | 10 / 15 min |
| `register:ip:*` | 10 / heure |
| `register:email:*` | 3 mails / heure, sans erreur visible (`consumeQuota`) |
| `register-confirm:ip:*` | 10 / 15 min |
| `reset-request:ip:*` | 5 / 15 min |
| `reset:ip:*` | 10 / 15 min |
| `delete:<id>` | 5 / 15 min |
| `settings:<id>` | 60 / min |

[clientIp](../server/utils/rateLimit.ts) lit l'IP dans `x-vercel-forwarded-for`, sinon dans le **dernier** élément de `x-forwarded-for`, le seul ajouté par le proxy. Le premier élément vient du client et peut être inventé : s'y fier permettrait de repartir à zéro sur tous les compteurs à chaque requête. En dev, sans proxy, c'est l'IP de la connexion.

## Requêtes venues d'un autre site (CSRF)

Le cookie de session est en `SameSite=Lax` : il ne part pas avec un `PATCH` ou un `DELETE` lancé depuis un autre site, mais il part avec un formulaire `POST` posé sur un autre site. Sans protection, une page piégée pourrait connecter le visiteur dans un compte choisi par l'attaquant, ou déclencher des mails.

[server/middleware/csrf.ts](../server/middleware/csrf.ts) refuse en **403** toute requête `POST`, `PATCH` ou `DELETE` vers `/api/*` dont l'en-tête `Origin` n'est pas autorisé. Sont autorisés :
- l'adresse par laquelle le site a été appelé, ce qui couvre les déploiements de préversion ;
- `NUXT_SITE_URL` ;
- les origines de `NUXT_TRUSTED_ORIGINS`, séparées par des virgules. Prévu pour l'empaquetage Capacitor (`capacitor://localhost`).

Un navigateur pose toujours `Origin` sur ces requêtes, et aucun site ne peut le falsifier. Une requête sans `Origin` est refusée.

## Autres protections

- Mots de passe hachés en scrypt, jetons de réinitialisation stockés sous forme d'empreinte SHA-256 : voir [authentification.md](authentification.md).
- Messages de connexion, d'inscription et de mot de passe oublié identiques que l'email existe ou non.
- Adresse email prouvée avant toute création de compte par mot de passe : voir [api.md](api.md#post-apiauthregister).
- Sessions fermées après 90 jours d'inactivité, et révocables sur tous les appareils : voir [authentification.md](authentification.md#durée-de-la-session).
- Redirections après connexion limitées aux chemins internes (`isSafeRedirect`).
- Les données saisies par l'utilisateur sont échappées avant d'être insérées dans un mail HTML.
- Requêtes SQL paramétrées, voir [base-de-donnees.md](base-de-donnees.md).
- Push : envoi seulement vers un service de push connu ([push.ts](../server/utils/push.ts)) ; la route des rappels exige `CRON_SECRET`.

## Droits RGPD

| Droit | Où | Comment |
|---|---|---|
| Accès et portabilité | `/compte`, carte Données | `GET /api/me/export` télécharge un JSON lisible avec tout ce qui concerne le compte |
| Rectification | `/compte`, carte Profil | **incomplet** : le profil s'affiche en lecture seule, seul le mot de passe se change. Il manque une route pour corriger le prénom et le nom |
| Effacement | `/compte`, zone de danger | l'utilisateur tape « SUPPRIMER », puis `DELETE /api/me` efface le compte et, par cascade, ses réglages et ses jetons |

Règle pour toute nouvelle donnée stockée : l'ajouter à l'export ([export.get.ts](../server/api/me/export.get.ts)), et vérifier qu'elle disparaît à la suppression du compte (clé étrangère `on delete cascade` vers `users`).

## Services tiers

| Service | Rôle | Données transmises |
|---|---|---|
| Neon (US, serveurs à Francfort `eu-central-1`) | stockage PostgreSQL | toutes les données du compte |
| Vercel (US, fonctions à Paris `cdg1`) | hébergement de l'app | requêtes HTTP. Région réglée dans le tableau de bord Vercel (Settings → Functions) |
| Brevo (France) | mails | email, prénom, lien de confirmation d'inscription ou de réinitialisation ; pour un rappel, nom de l'achat et date de fin |
| Service de push du navigateur (Google FCM, Apple, Mozilla, Microsoft) | notifications sur téléphone | seulement si l'utilisateur les active : un message chiffré de bout en bout (RFC 8291), illisible par le service |
| Google | connexion facultative | seulement si l'utilisateur choisit « Continuer avec Google » |
