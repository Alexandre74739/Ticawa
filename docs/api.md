# API

Toutes les routes sont dans `server/`. Le nom du fichier donne l'URL et la méthode : `server/api/me/settings.patch.ts` répond à `PATCH /api/me/settings`.

Les corps de requête et de réponse sont en JSON. En cas d'erreur, la réponse porte un `statusCode` et un `message` en français, prêt à afficher. Côté client, `useAction` et `useAuthForm` le lisent dans `error.data.message`.

« Session » signifie que la route appelle `requireUserSession` et répond **401** sans utilisateur connecté.

## Authentification

### `POST /api/auth/register`

Crée un compte avec mot de passe et ouvre la session.

| Champ | Règle |
|---|---|
| `prenom`, `nom` | obligatoires, 100 caractères maximum |
| `email` | format valide, 254 caractères maximum |
| `password` | 10 à 200 caractères |
| `cgu` | doit valoir `true` |

Réponse : `{ ok: true }`. Erreurs : **400** champ invalide, **409** email déjà pris (le message indique s'il s'agit d'un compte Google), **429** plus de 10 inscriptions par heure depuis la même IP.

### `POST /api/auth/login`

Corps : `{ email, password }`. Réponse : `{ ok: true }` et la session est ouverte.

Erreurs : **401** « Email ou mot de passe incorrect. », quelle que soit la cause. **429** au-delà de 20 essais par IP ou de 10 essais par email en 15 minutes.

### `POST /api/auth/password/request`

Envoie un lien pour définir ou changer le mot de passe.
- **Connecté** : pas de corps. **429** si le compte a déjà reçu 3 liens dans l'heure, **500** si l'envoi du mail échoue.
- **Non connecté** : `{ email }`. Répond toujours `{ ok: true }`, même si l'email est inconnu. **400** email invalide, **429** plus de 5 demandes par IP en 15 minutes.

### `POST /api/auth/password/reset`

Corps : `{ token, password }`. Enregistre le mot de passe, déconnecte les autres appareils et ouvre une session.

Erreurs : **400** mot de passe trop court, ou lien expiré ou déjà utilisé. **429** plus de 10 essais par IP en 15 minutes.

### `GET /auth/google`

Redirection vers Google, puis retour vers `?redirect=` (ou `/dashboard`). En cas d'échec, retour vers `/connexion?erreur=google`. Détails dans [authentification.md](authentification.md).

## Compte (`/api/me`)

### `GET /api/me` — session

```json
{ "prenom": "Léa", "nom": "Martin", "email": "lea@exemple.fr", "password": true, "createdAt": "2026-09-01T10:00:00.000Z" }
```

`password` indique si le compte a un mot de passe (un compte créé avec Google n'en a pas).

### `DELETE /api/me` — session

Corps : `{ confirmation: "SUPPRIMER" }`, sans tenir compte de la casse. Supprime le compte et ferme la session.

Erreurs : **400** mot de confirmation absent ou faux, **429** plus de 5 essais en 15 minutes.

### `GET /api/me/export` — session

Télécharge `ticawa-export-AAAA-MM-JJ.json` avec tout ce que Ticawa garde sur l'utilisateur : le compte, les réglages avec leur date de modification, et l'historique des demandes de mot de passe. Les empreintes de mot de passe et de jetons ne sont jamais incluses.

### `GET /api/me/settings` — session

```json
{ "notifications": true, "channelPush": false, "channelEmail": true }
```

Sans réglage enregistré, renvoie ces valeurs par défaut.

### `PATCH /api/me/settings` — session

Corps : une partie des trois champs, en booléens. Les champs absents gardent leur valeur. Réponse : les réglages complets après enregistrement.

Erreurs : **400** « Réglage invalide. » si une valeur n'est pas un booléen, **400** « Gardez au moins un canal… » si les alertes sont actives sans aucun canal, **429** plus de 60 modifications par minute.
