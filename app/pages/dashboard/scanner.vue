<template>
  <div>
    <DashboardHeading title="Scanner," accent="un ticket en un instant" />

    <div class="hidden standalone:block">
      <DashboardSoon>
        Cadrez votre ticket avec la caméra, Tico remplit la fiche pour vous.
      </DashboardSoon>
    </div>

    <div
      class="flex flex-col items-center gap-4 rounded-3xl bg-lavender px-6 py-12 text-center standalone:hidden"
    >
      <UiTicoMascot mascot="Interrogated.svg" />
      <p class="font-display text-lg font-bold">
        Le scan est réservé à l'app installée
      </p>
      <p class="max-w-sm text-ink/70">
        Dans le navigateur, vous pouvez consulter et modifier vos tickets.
        Installez Ticawa pour en ajouter de nouveaux avec la caméra.
      </p>
      <UiButton arrow @click="install">Installer l'app</UiButton>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({ title: "Scanner" });

const { install } = usePwaInstall();
</script>
