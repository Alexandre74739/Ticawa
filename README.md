# Ticawa

> Perdez votre ticket, jamais vos droits.

Ticawa est une application mobile (PWA) qui conserve les preuves d'achat, indique quelles garanties et assurances couvrent chaque produit et jusqu'à quand, puis prévient avant l'expiration. L'app informe et alerte : elle ne fait aucune démarche à la place de l'utilisateur.

Stack : Nuxt 4 (Vue 3, TypeScript), Tailwind CSS 4, PostgreSQL, nuxt-auth-utils, @vite-pwa/nuxt, déploiement sur Vercel.

## Démarrer

Prérequis : Node.js 22.19 ou plus (exigé par Nuxt 4.5), et une base PostgreSQL avec le schéma décrit dans [docs/base-de-donnees.md](docs/base-de-donnees.md).

```bash
git clone https://github.com/Alexandre74739/Ticawa.git
cd Ticawa
npm install
cp .env.example .env   # puis remplir les variables ci-dessous
npm run dev            # http://localhost:3000
```

| Script | Rôle |
|---|---|
| `npm run dev` | serveur de développement avec rechargement à chaud |
| `npm run build` | build de production |
| `npm run preview` | sert le build de production en local |
| `npm run generate` | pré-rendu statique (non utilisé : l'app a besoin de son serveur) |

## Variables d'environnement

Nuxt lit les variables préfixées `NUXT_` et les range dans `runtimeConfig` ([nuxt.config.ts](nuxt.config.ts)).

| Variable | Obligatoire | Rôle |
|---|---|---|
| `NUXT_DATABASE_URL` | oui | chaîne de connexion PostgreSQL |
| `NUXT_SESSION_PASSWORD` | oui en prod | clé de chiffrement des cookies de session et des liens d'inscription, 32 caractères minimum. La changer déconnecte tout le monde et invalide les liens d'inscription en attente. En dev, nuxt-auth-utils la génère dans `.env` si elle manque |
| `NUXT_OAUTH_GOOGLE_CLIENT_ID` | pour Google | identifiant OAuth de « Continuer avec Google » |
| `NUXT_OAUTH_GOOGLE_CLIENT_SECRET` | pour Google | secret OAuth associé |
| `NUXT_BREVO_API_KEY` | pour les mails | clé API Brevo (mails d'inscription et de mot de passe) |
| `NUXT_MAIL_FROM_EMAIL` | pour les mails | adresse d'expédition, validée dans Brevo |
| `NUXT_MAIL_FROM_NAME` | non | nom d'expéditeur, `Ticawa` par défaut |
| `NUXT_SITE_URL` | oui en prod | URL publique, utilisée dans les liens des mails et autorisée par la protection CSRF. `http://localhost:3000` en dev si vide |
| `NUXT_PUBLIC_VAPID_PUBLIC_KEY` | pour le push | clé publique des notifications push, générée par `node scripts/vapid-keys.mjs` |
| `NUXT_VAPID_PRIVATE_KEY` | pour le push | clé privée associée. Ne jamais la changer après la mise en ligne : les abonnements existants deviendraient inutilisables |
| `CRON_SECRET` | oui en prod | secret de la tâche quotidienne des rappels ([vercel.json](vercel.json)). Nom imposé par Vercel, qui l'envoie seul à `/api/cron/reminders` |
| `NUXT_CRON_SECRET` | oui en prod | même valeur que `CRON_SECRET` : c'est celle que l'app compare |
| `NUXT_TRUSTED_ORIGINS` | non | origines supplémentaires autorisées à écrire sur l'API, séparées par des virgules. Prévu pour Capacitor (`capacitor://localhost`) |

## Documentation

| Document | Contenu |
|---|---|
| [Architecture](docs/architecture.md) | arborescence, conventions de nommage, rendu serveur, où ranger quoi |
| [Authentification](docs/authentification.md) | sessions, Google, mot de passe oublié, déconnexion forcée |
| [API](docs/api.md) | chaque route serveur : entrée, sortie, erreurs, limites |
| [Base de données](docs/base-de-donnees.md) | tables, colonnes, schéma SQL |
| [Front](docs/front.md) | pages, middlewares, composables, composants UI, design system |
| [PWA](docs/pwa.md) | installation, mises à jour, autorisations de l'appareil |
| [Sécurité et RGPD](docs/securite-rgpd.md) | en-têtes, limitation de débit, export et suppression des données |
| [Easter eggs de Tico](docs/tico-easter-eggs.md) | humeurs du curseur et leurs réglages |

Le contexte produit et le design system sont aussi résumés dans [CLAUDE.md](CLAUDE.md).

## Licence

Distribué sous licence MIT : code, design system, mascotte Tico, logos et illustrations compris. Voir [LICENSE](LICENSE) (version officielle, en anglais) et [LICENSE.fr.md](LICENSE.fr.md) (traduction française).
