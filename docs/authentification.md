# Authentification

Les sessions sont gérées par [nuxt-auth-utils](https://github.com/atinux/nuxt-auth-utils) : un cookie chiffré et scellé avec `NUXT_SESSION_PASSWORD`, sans table de sessions en base.

## Contenu de la session

Défini dans [shared/types/auth.d.ts](../shared/types/auth.d.ts) :

| Champ | Visible côté client | Contenu |
|---|---|---|
| `user` | oui, via `useUserSession()` | `id`, `email`, `prenom`, `role` (`user` ou `admin`) |
| `secure.sessionVersion` | non, serveur uniquement | numéro de version du compte au moment de la connexion |
| `secure.issuedAt` | non, serveur uniquement | date d'émission du cookie, en millisecondes. Absent des sessions ouvertes avant l'expiration à l'inactivité |

Toutes les connexions passent par `startSession()` ([server/utils/session.ts](../server/utils/session.ts)), qui écrit ces champs.

La session ne voyage que dans le cookie `nuxt-session`. h3 accepte par défaut aussi un en-tête `x-nuxt-session-session` : il est désactivé (`sessionHeader: false` dans [nuxt.config.ts](../nuxt.config.ts)), sinon un cookie volé glissé dans cet en-tête passerait à côté du middleware de session.

## Durée de la session

Objectif : un utilisateur qui revient n'est jamais déconnecté, sur autant d'appareils qu'il veut. Chaque appareil a son propre cookie, indépendant des autres.

- **90 jours sans visite** ferment la session. La durée est portée par l'attribut `Max-Age` du cookie (`session.cookie.maxAge` dans [nuxt.config.ts](../nuxt.config.ts)).
- **Chaque jour de visite repousse l'échéance.** Quand le cookie a plus de 24 heures, [server/middleware/session.ts](../server/middleware/session.ts) le réémet avec un `issuedAt` neuf, et le navigateur recompte ses 90 jours. Il y a au plus une réécriture par jour et par appareil.
- **Le serveur fait respecter la durée lui-même.** Un cookie dont `issuedAt` dépasse 90 jours est refusé, même si le navigateur, ou quelqu'un qui l'a copié, le renvoie encore.
- Une session ouverte avant ce mécanisme, donc sans `issuedAt`, est renouvelée à la première visite, pas éjectée.

Ne pas utiliser le `maxAge` de h3 à la place (`session.maxAge`) : il compte depuis la création de la session, et réémettre la session ne le remet pas à zéro. Un utilisateur actif serait déconnecté au 90ᵉ jour.

## Trois façons de se connecter

**Email et mot de passe.** L'inscription se fait en deux temps. `POST /api/auth/register` n'écrit rien en base : il envoie un lien de confirmation, qui porte le compte à créer, chiffré. Ouvrir ce lien (`/inscription?token=…`) appelle `POST /api/auth/register/confirm`, qui crée le compte avec l'email vérifié et ouvre la session. Personne ne peut donc réserver l'adresse d'un autre, et la réponse de l'inscription est la même que l'adresse soit libre ou non. Détails dans [api.md](api.md#post-apiauthregister).

`POST /api/auth/login` vérifie le mot de passe. Les mots de passe sont hachés par nuxt-auth-utils (scrypt) et re-hachés à la connexion si l'algorithme a évolué. Pour un email inconnu, la route vérifie quand même un faux hachage : la réponse prend le même temps, ce qui empêche de deviner quels emails ont un compte.

**Google.** Le bouton pointe vers `/auth/google?redirect=…` ([server/routes/auth/google.get.ts](../server/routes/auth/google.get.ts)). La page de retour est gardée dans un cookie de 10 minutes, le temps de l'aller-retour chez Google. Au retour :
1. Google doit confirmer que l'email est vérifié, sinon retour à `/connexion?erreur=google`.
2. Si un compte porte déjà cet identifiant Google, on le connecte.
3. Sinon, si un compte existe avec le même email, on lui rattache Google. Si cet email n'avait jamais été vérifié, son mot de passe est effacé et ses sessions sont coupées : quelqu'un a pu créer le compte avec l'adresse d'un autre. Ce cas ne concerne plus que les comptes créés avant la confirmation par mail.
4. Sinon, on crée un compte, sans mot de passe.

**Lien par mail.** Voir « Mot de passe oublié » plus bas. Définir un mot de passe via ce lien connecte aussi l'utilisateur.

## Déconnexion forcée

Chaque compte a un compteur `session_version`. Il augmente quand le mot de passe est réinitialisé, ou quand un rattachement Google efface un mot de passe non vérifié.

À chaque requête, [server/middleware/session.ts](../server/middleware/session.ts) compare la version de la session à celle en base : toutes les routes `/api/*`, et les pages. Les fichiers statiques et l'outillage Nuxt (`/_nuxt`…) sont ignorés, et un visiteur sans cookie ne déclenche aucune requête en base. Si les versions diffèrent, si le compte n'existe plus ou si la session a dépassé 90 jours, la session est fermée. Les autres appareils sont donc déconnectés dès leur prochaine requête.

**Révoquer avec `endSession()`, jamais avec `clearUserSession()`.** `clearUserSession()` vide la session, mais le `getUserSession()` suivant de la même requête, celui de la route appelée, relit le cookie reçu et la fait revenir. Un navigateur normal jette ensuite le cookie vidé qu'on lui renvoie ; celui qui a volé le cookie l'ignore, et garderait l'accès à chaque requête. `endSession()` ([server/utils/session.ts](../server/utils/session.ts)) remplace la session par une session sans utilisateur, qui reste en place jusqu'à la réponse. `clearUserSession()` reste valable pour une déconnexion volontaire (`DELETE /api/_auth/session`, suppression du compte), où rien ne relit la session ensuite.

La déconnexion d'un appareil ne révoque pas son cookie : les sessions ne sont pas stockées en base, un cookie copié avant la déconnexion reste valable, et se renouvelle tant qu'il sert. Seule une hausse de `session_version` coupe tous les cookies d'un compte.

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
