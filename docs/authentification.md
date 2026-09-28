# Authentification

Les sessions sont gérées par [nuxt-auth-utils](https://github.com/atinux/nuxt-auth-utils) : un cookie chiffré et scellé avec `NUXT_SESSION_PASSWORD`, sans table de sessions en base.

## Contenu de la session

Défini dans [shared/types/auth.d.ts](../shared/types/auth.d.ts) :

| Champ | Visible côté client | Contenu |
|---|---|---|
| `user` | oui, via `useUserSession()` | `id`, `email`, `prenom`, `role` (`user` ou `admin`) |
| `secure.sessionVersion` | non, serveur uniquement | numéro de version du compte au moment de la connexion |

Toutes les connexions passent par `startSession()` ([server/utils/session.ts](../server/utils/session.ts)), qui écrit ces deux champs.

## Trois façons de se connecter

**Email et mot de passe.** `POST /api/auth/register` crée le compte, `POST /api/auth/login` vérifie le mot de passe. Les mots de passe sont hachés par nuxt-auth-utils (scrypt) et re-hachés à la connexion si l'algorithme a évolué. Pour un email inconnu, la route vérifie quand même un faux hachage : la réponse prend le même temps, ce qui empêche de deviner quels emails ont un compte.

**Google.** Le bouton pointe vers `/auth/google?redirect=…` ([server/routes/auth/google.get.ts](../server/routes/auth/google.get.ts)). La page de retour est gardée dans un cookie de 10 minutes, le temps de l'aller-retour chez Google. Au retour :
1. Google doit confirmer que l'email est vérifié, sinon retour à `/connexion?erreur=google`.
2. Si un compte porte déjà cet identifiant Google, on le connecte.
3. Sinon, si un compte existe avec le même email, on lui rattache Google. Si cet email n'avait jamais été vérifié, son mot de passe est effacé et ses sessions sont coupées : quelqu'un a pu créer le compte avec l'adresse d'un autre.
4. Sinon, on crée un compte, sans mot de passe.

**Lien par mail.** Voir « Mot de passe oublié » plus bas. Définir un mot de passe via ce lien connecte aussi l'utilisateur.

## Déconnexion forcée

Chaque compte a un compteur `session_version`. Il augmente quand le mot de passe est réinitialisé, ou quand un rattachement Google efface un mot de passe non vérifié.

À chaque requête `/api/*`, [server/middleware/session.ts](../server/middleware/session.ts) compare la version de la session à celle en base. Si elles diffèrent, ou si le compte n'existe plus, la session est effacée. Les autres appareils sont donc déconnectés dès leur prochain appel API.

## Mot de passe oublié

1. `POST /api/auth/password/request` avec l'email. Un utilisateur connecté n'a pas besoin de le fournir : on prend celui de sa session.
2. Le serveur crée un jeton aléatoire de 32 octets et n'en stocke que l'empreinte SHA-256 ([server/utils/passwordResets.ts](../server/utils/passwordResets.ts)). Il envoie par Brevo un lien `/mot-de-passe?token=…`, valable 60 minutes. Au plus 3 liens par compte et par heure.
3. `POST /api/auth/password/reset` avec le jeton et le nouveau mot de passe. Le jeton est consommé, et tous les autres liens encore valides du compte sont annulés.

Pour un visiteur non connecté, la réponse est toujours `{ ok: true }`, que l'email existe ou non, et l'envoi part en arrière-plan en production. On ne peut donc pas s'en servir pour tester si un email a un compte.

La page `/mot-de-passe` est en `noindex` et `no-referrer`, pour que le jeton ne fuite ni vers les moteurs de recherche ni vers d'autres sites.

## Côté pages

| Middleware | Pages | Effet |
|---|---|---|
| `auth` | `/dashboard`, `/compte`, `/parametres` | sans session, renvoie vers `/connexion?redirect=<page demandée>` |
| `guest` | `/connexion`, `/inscription` | avec une session, renvoie vers `/dashboard` |

Après connexion, [useAuthForm](../app/composables/useAuthForm.ts) suit `redirect` seulement si `isSafeRedirect()` le valide ([shared/utils/redirect.ts](../shared/utils/redirect.ts)) : un chemin interne commençant par un seul `/`, sans espace ni antislash. Cela empêche un lien piégé d'envoyer l'utilisateur vers un site externe après la connexion.

Les routes API protégées appellent `requireUserSession(event)`, qui répond 401 sans session.
