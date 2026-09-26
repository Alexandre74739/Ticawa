<template>
  <div>
    <SectionsHero
      title="Perdez votre ticket,"
      title-accent="jamais vos droits."
      description="Ticawa garde vos preuves d'achat, suit la durée de vos garanties et assurances, et vous prévient avant qu'elles n'expirent."
      :cta="{ label: 'Commencer avec Ticawa', to: '/connexion' }"
    />
    <SectionsAbout
      statement="Un ticket s'efface. Une facture se perd. Une date s'oublie. Ticawa garde tout au même endroit et vous prévient avant qu'il ne soit trop tard."
      highlight="Ticawa"
    />
    <SectionsProduct :features="features" />
    <SectionsBandeau
      title="Votre garantie expire bientôt ?"
      title-accent="Vous le saurez avant."
      description="Ticawa vous envoie une notification avant la fin de chaque garantie et assurance. Assez tôt pour vérifier votre produit, retrouver la preuve d'achat et faire valoir vos droits si besoin. La démarche reste entre vos mains."
      :cta="{ label: 'Activer mes rappels', to: '/connexion' }"
    />
    <SectionsCas
      title="La garantie courait encore"
      title-accent="Il fallait juste le savoir"
      description="Garantie légale de conformité, extension de garantie, assurance casse : trois situations du quotidien où la couverture était toujours valable et où la preuve d'achat a fait la différence."
      :cases="cases"
    />
  </div>
</template>

<script setup lang="ts">
import { cases, features } from "~/data/home";

useSeoMeta({
  title: "Ticawa",
  titleTemplate: null,
  description:
    "Ticawa conserve vos tickets de caisse et preuves d'achat, suit la durée de vos garanties et assurances, et vous alerte avant chaque date d'expiration.",
  ogTitle: "Ticawa — Perdez votre ticket, jamais vos droits",
  ogDescription:
    "L'application qui garde vos preuves d'achat et vous prévient avant l'expiration de vos garanties et assurances.",
  ogType: "website",
});
</script>
