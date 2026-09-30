<template>
  <div>
    <LandingHero
      title="Perdez votre ticket,"
      title-accent="jamais vos droits"
      description="Ticawa garde vos preuves d'achat, suit la durée de vos garanties et assurances, et vous prévient avant qu'elles n'expirent."
      :cta="{ label: 'Commencer avec Ticawa', to: '/connexion' }"
    />
    <LandingAbout
      statement="Un ticket s'efface. Une facture se perd. Une date s'oublie. Ticawa garde tout au même endroit et vous prévient avant qu'il ne soit trop tard."
      highlight="Ticawa"
    />
    <LandingProduct :features="features" />
    <LandingBandeau
      title="Votre garantie expire bientôt ?"
      description="Ticawa vous envoie une notification avant la fin de chaque garantie et assurance. Assez tôt pour vérifier votre produit, retrouver la preuve d'achat et faire valoir vos droits si besoin. La démarche reste entre vos mains."
      :cta="{ label: 'Activer mes rappels', to: '/connexion' }"
    />
    <LandingCas
      title="La garantie courait encore"
      title-accent="Il fallait juste le savoir"
      description=" Garantie légale de conformité, garantie commerciale, assurance casse : trois situations du quotidien où la couverture court encore, et où la preuve d'achat fait la différence."
      :cases="cases"
    />
    <LandingFaq
      title="Tout savoir sur vos garanties"
      title-accent="et vos preuves d'achat"
      description="Comment Ticawa conserve vos tickets de caisse, calcule la durée de chaque garantie et protège vos données personnelles : les réponses aux questions les plus posées."
      :items="faq"
    />
    <LandingCta
      title="Une photo aujourd'hui, vos droits deux ans plus tard."
      description="Ticawa garde la preuve d'achat, calcule la fin de chaque garantie et vous prévient avant l'échéance."
      :cta="{ label: 'Commencer avec Ticawa', to: '/connexion' }"
    />
  </div>
</template>

<script setup lang="ts">
import { cases, faq, features } from "~/data/home";

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

useHead({
  script: [
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      }),
    },
  ],
});
</script>
