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

[rateLimit(clé, max, fenêtre)](../server/utils/rateLimit.ts) compte les appels en base, dans la table `rate_limits`, et répond **429** au-delà du maximum. Le compteur tient donc entre les instances Vercel.

| Clé | Maximum |
|---|---|
| `login:ip:*` | 20 / 15 min |
| `login:email:*` | 10 / 15 min |
| `register:ip:*` | 10 / heure |
| `reset-request:ip:*` | 5 / 15 min |
| `reset:ip:*` | 10 / 15 min |
| `delete:<id>` | 5 / 15 min |
| `settings:<id>` | 60 / min |

L'IP vient de `X-Forwarded-For`, fourni par Vercel ([clientIp](../server/utils/rateLimit.ts)).

## Autres protections

- Mots de passe hachés en scrypt, jetons de réinitialisation stockés sous forme d'empreinte SHA-256 : voir [authentification.md](authentification.md).
- Messages de connexion et de mot de passe oublié identiques que l'email existe ou non.
- Redirections après connexion limitées aux chemins internes (`isSafeRedirect`).
- Les données saisies par l'utilisateur sont échappées avant d'être insérées dans un mail HTML.
- Requêtes SQL paramétrées, voir [base-de-donnees.md](base-de-donnees.md).

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
| Hébergeur PostgreSQL | stockage | toutes les données du compte. À héberger dans l'UE |
| Vercel | hébergement de l'app | requêtes HTTP. Choisir une région UE pour les fonctions |
| Brevo (France) | mails | email, prénom, lien de réinitialisation |
| Google | connexion facultative | seulement si l'utilisateur choisit « Continuer avec Google » |
