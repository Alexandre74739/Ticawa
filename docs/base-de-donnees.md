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

## Tickets

| Table | Rôle |
|---|---|
| `tickets` | une ligne par ticket ou facture : nom donné par l'utilisateur (facultatif, remplace l'enseigne comme titre), magasin (enseigne, adresse, SIRET, TVA, téléphone), achat (date, heure, n° de ticket, caisse, total, moyen de paiement, 4 derniers chiffres de carte), mentions imprimées (délai d'échange en jours et texte, garantie), texte brut lu, `verified` (fiche relue par l'utilisateur) |
| `ticket_items` | articles du ticket, dans l'ordre (`position`) : libellé, référence, quantité, prix unitaire, prix total |
| `ticket_files` | la photo (JPEG) ou le PDF d'origine, en `bytea`, 4 Mo au plus. Table à part : la liste des tickets ne charge jamais les octets |

Tout est en `on delete cascade` depuis `users`. Requêtes : [server/utils/tickets.ts](../server/utils/tickets.ts).

### Recherche et pagination

La liste des tickets se charge par pages de 20, triées par date d'achat (les tickets sans date en dernier). La recherche porte sur le nom du ticket, l'enseigne et le nom des articles, sans tenir compte des majuscules ni des accents.

```sql
create extension if not exists pg_trgm;
create extension if not exists unaccent;

-- unaccent n'est pas « immutable » : l'enveloppe l'est, pour pouvoir l'indexer.
create or replace function f_unaccent(text) returns text
  language sql immutable parallel safe strict
  as $$ select public.unaccent('public.unaccent'::regdictionary, lower($1)) $$;

create index if not exists tickets_user_sort_idx
  on tickets (user_id, coalesce(purchase_date, '-infinity'::date) desc, id desc);
create index if not exists tickets_name_trgm
  on tickets using gin (f_unaccent(name) gin_trgm_ops);
create index if not exists tickets_merchant_trgm
  on tickets using gin (f_unaccent(merchant) gin_trgm_ops);
create index if not exists ticket_items_label_trgm
  on ticket_items using gin (f_unaccent(label) gin_trgm_ops);
```


### Page Utilisateurs (admin)

La liste des comptes se charge par pages de 20, les plus récents d'abord, sans les admins. La recherche porte sur le prénom, le nom et l'email, sans tenir compte des majuscules ni des accents. Requêtes : `listUsers` dans [server/utils/users.ts](../server/utils/users.ts).

```sql
create index if not exists users_role_created_idx
  on users (role, created_at desc, id);
create index if not exists users_prenom_trgm
  on users using gin (f_unaccent(prenom) gin_trgm_ops);
create index if not exists users_nom_trgm
  on users using gin (f_unaccent(nom) gin_trgm_ops);
create index if not exists users_email_trgm
  on users using gin (email gin_trgm_ops);
```

Comptes de test (pagination) : emails en `@exemple.test` et `google_id` en `seed-test-N`, donc impossibles à utiliser pour se connecter. Pour les retirer :

```sql
delete from users where email like '%@exemple.test' and google_id like 'seed-test-%';
```

### Historique des actions admin

Page Historique du tableau de bord (RGPD : traçabilité). Seules les actions d'un admin qui **modifient** les données d'un utilisateur sont notées : compte modifié, compte supprimé, ticket d'un autre compte modifié ou supprimé. `changes` garde chaque champ touché avec sa valeur avant et après (`[{ "field": "prenom", "before": "Léa", "after": "Lea" }]`) ; pour un ticket supprimé, son nom, son enseigne, sa date et son total, pour le reconnaître. Les emails sont copiés au moment de l'action pour rester lisibles après une suppression de compte. Aucune ligne ne peut être modifiée ni effacée depuis l'app ; les lignes de plus d'un an sont effacées au hasard, lors d'environ 1 écriture sur 100. Requêtes : [server/utils/adminLogs.ts](../server/utils/adminLogs.ts).

```sql
create table admin_logs (
  id              bigint generated always as identity primary key,
  admin_id        uuid references users (id) on delete set null,
  admin_email     text not null,
  action          text not null check (action in ('user.update', 'user.delete', 'ticket.update', 'ticket.delete')),
  target_user_id  uuid,  -- sans clé étrangère : la ligne survit au compte supprimé
  target_email    text not null,
  ticket_id       uuid,
  changes         jsonb not null default '[]',
  created_at      timestamptz not null default now()
);
-- Pagination : les plus récentes d'abord, avec ou sans le filtre Modifications / Suppressions.
create index admin_logs_created_idx on admin_logs (created_at desc, id desc);
create index admin_logs_action_created_idx on admin_logs (action, created_at desc, id desc);
-- Recherche par email de l'admin ou de l'utilisateur.
create index admin_logs_admin_email_trgm on admin_logs using gin (admin_email gin_trgm_ops);
create index admin_logs_target_email_trgm on admin_logs using gin (target_email gin_trgm_ops);
```
