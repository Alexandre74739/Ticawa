# Ticawa — Contexte projet

## Le produit
Ticawa est une application mobile (PWA) grand public qui conserve les preuves 
d'achat et indique, pour chaque produit, quelles garanties et assurances le 
couvrent et jusqu'à quand, puis prévient avant expiration.
L'app INFORME et ALERTE — elle ne fait aucune démarche à la place de 
l'utilisateur et n'invente jamais un droit inexistant.
Slogan : « Perdez votre ticket, jamais vos droits ». Cible : 25-34 ans.

## Stack technique
- **Nuxt** (Vue 3, TypeScript) en **PWA** — mobile uniquement (pas de version desktop de l'app ; seule la landing est responsive PC/mobile).
- **Tailwind CSS** pour le style (tokens ci-dessous).
- **Baserow** comme base de données + back-office (hébergement UE).
- **Authentification** : couche dédiée EU/open-source (Baserow ne gère pas l'auth des utilisateurs finaux).
- **Polices** : @fontsource (self-hosted, pas de CDN externe).
- **Déploiement** : Vercel.
- **Analytics** : solution européenne (Plausible ou Matomo), jamais Google Analytics.

## Contraintes
- **Souveraineté FR/UE + RGPD by design** : données hébergées dans l'UE, aucun 
  appel externe qui fuite l'IP des visiteurs (polices self-hosted), export et 
  suppression du compte/données obligatoires.
- **Coût 0 €** : outils gratuits / open-source uniquement.
- **Mobile-first**, pensé pour un empaquetage futur vers les stores via 
  Capacitor (ne pas coder de façon qui l'empêche).
- Interface **en français**.

## Design system
Couleurs (Tailwind theme) :
- indigo (marque, boutons/actions) : #5A67B8
- encre (texte) : #2A2E3A
- papier (fond) : #FBF9F5
- lavande (surfaces/cartes) : #E8E7F6
- terracotta (accent) : #A15B42
États de couverture (toujours couleur + icône + libellé) :
- actif : #3F7A5E · bientôt expiré : #8A5E12 · expiré/erreur : #B04A4A
Règles : texte encre sur fond clair, texte papier (crème) sur aplats indigo.

Typo : **Bricolage Grotesque** (titres + boutons, `font-display`, 700/800), **Instrument Serif** italique (accent, `font-serif`), **DM Sans** (corps, `font-sans`).
Style : très arrondi, doux, ludique. Rayons d'arrondi généreux, boutons pleins.
Mascotte « Tico » : blob indigo à deux yeux, sur écrans vides et de succès.
Curseur Tico et ses easter eggs (humeurs, déclencheurs, réglages) : voir `docs/tico-easter-eggs.md`.
Icônes : outline arrondies (Lucide ou Phosphor).

## Modèle de données (Baserow)
- **Produits** : nom, marque, modèle, catégorie, date d'achat, prix, n° de