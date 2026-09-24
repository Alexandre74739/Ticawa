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
      :steps="steps"
    />
  </div>
</template>

<script setup lang="ts">
import { steps } from "~/data/home";

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
