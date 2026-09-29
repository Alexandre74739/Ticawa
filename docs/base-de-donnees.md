# Base de données

PostgreSQL, interrogée avec le client [`postgres`](https://github.com/porsager/postgres) ([server/utils/db.ts](../server/utils/db.ts)). `useDb()` ouvre une seule connexion partagée (5 connexions au plus, sans requêtes préparées, pour rester compatible avec un pooler comme PgBouncer).

Les requêtes s'écrivent en gabarit SQL :

```ts
const [user] = await useDb()<UserRow[]>`select * from users where id = ${id}`;
```

Les valeurs `${…}` sont envoyées comme paramètres, pas collées dans le texte : pas d'injection SQL possible. Toutes les requêtes vivent dans `server/utils/`, une fonction par opération.

## Tables

Le dépôt ne contient pas encore de fichier de migration. Le schéma ci-dessous est **reconstitué à partir des requêtes du code** : à comparer avec la base réelle, puis à versionner dans le dépôt.

### `users`

| Colonne | Type | Rôle |
|---|---|---|
| `id` | uuid, clé primaire | identifiant du compte |
| `email` | texte, unique | toujours en minuscules |
| `prenom` | texte | |
| `nom` | texte, nullable | absent si Google ne le fournit pas |
| `password_hash` | texte, nullable | `null` pour un compte Google seul |
| `google_id` | texte, unique, nullable | identifiant `sub` de Google |
| `role` | `user` ou `admin` | `admin` donne accès aux pages Utilisateurs et Statistiques du tableau de bord |
| `email_verified` | booléen | vrai après Google ou après un lien reçu par mail |
| `session_version` | entier | augmente pour déconnecter tous les appareils |
| `created_at` | horodatage | date d'inscription |

### `user_settings`

Une ligne par compte, créée au premier enregistrement. Sans ligne, l'API renvoie les valeurs par défaut.

| Colonne | Type | Défaut appliqué par l'API |
|---|---|---|
| `user_id` | clé primaire, vers `users` | |
| `notifications` | booléen | `true` |
| `channel_push` | booléen | `false` |
| `channel_email` | booléen | `true` |
| `updated_at` | horodatage | |

### `password_resets`

| Colonne | Type | Rôle |
|---|---|---|
| `user_id` | vers `users` | |
| `token_hash` | texte | empreinte SHA-256 du jeton, jamais le jeton lui-même |
| `created_at` | horodatage | sert au plafond de 3 liens par heure |
| `expires_at` | horodatage | création + 60 minutes |
| `used_at` | horodatage, nullable | rempli à l'utilisation, ou à l'annulation quand un autre lien du compte sert |

### `rate_limits`

| Colonne | Type | Rôle |
|---|---|---|
| `key` | texte, clé primaire | par exemple `login:ip:1.2.3.4` ou `settings:<id>` |
| `count` | entier | nombre d'appels dans la fenêtre en cours |
| `reset_at` | horodatage | fin de la fenêtre |

Les lignes expirées sont nettoyées au hasard, lors d'environ 1 appel sur 100.

## Schéma SQL proposé

```sql
create table users (
  id               uuid primary key default gen_random_uuid(),
  email            text not null unique,
  prenom           text not null,
  nom              text,
  password_hash    text,
  google_id        text unique,
  role             text not null default 'user' check (role in ('user', 'admin')),
  email_verified   boolean not null default false,
  session_version  integer not null default 1,
  created_at       timestamptz not null default now()
);

create table user_settings (
  user_id        uuid primary key references users (id) on delete cascade,
  notifications  boolean not null default true,
  channel_push   boolean not null default false,
  channel_email  boolean not null default true,
  updated_at     timestamptz not null default now()
);

create table password_resets (
  id          bigint generated always as identity primary key,
  user_id     uuid not null references users (id) on delete cascade,
  token_hash  text not null unique,
  created_at  timestamptz not null default now(),
  expires_at  timestamptz not null,
  used_at     timestamptz
);
create index on password_resets (user_id, created_at);

create table rate_limits (
  key       text primary key,
  count     integer not null,
  reset_at  timestamptz not null
);
```

Le `on delete cascade` est indispensable : `DELETE /api/me` supprime seulement la ligne `users` et compte sur la cascade pour effacer les réglages et les jetons.
