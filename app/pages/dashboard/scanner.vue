<template>
  <div>
    <DashboardHeading title="Scanner," accent="un ticket en un instant" />

    <div class="hidden max-w-xl standalone:block">
      <ScanProgress v-if="step !== 'idle'" :step="step" :progress="progress" />
      <div v-else class="flex flex-col gap-5">
        <UiAlert v-if="error" tone="danger">{{ error }}</UiAlert>
        <ScanPicker @file="scan" />
        <UiLabelCard>
          <p class="font-display font-bold">Pour une lecture réussie</p>
          <ul class="list-disc space-y-1 pl-4 text-sm text-ink/75">
            <li>Posez le ticket à plat, sur un fond uni.</li>
            <li>Cadrez-le en entier, du nom du magasin jusqu'au total.</li>
            <li>Évitez les reflets et les ombres.</li>
          </ul>
        </UiLabelCard>
      </div>
    </div>

    <div class="standalone:hidden">
      <DashboardSoon
        title="Le scan est réservé à l'app installée"
        mascot="Interrogated.svg"
      >
        Dans le navigateur, vous pouvez consulter et modifier vos tickets.
        Installez Ticawa pour en ajouter de nouveaux avec la caméra.
        <template #actions>
          <UiButton arrow @click="install">Installer l'app</UiButton>
        </template>
      </DashboardSoon>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({ title: "Scanner" });

const { install } = usePwaInstall();
const { step, progress, error, scan } = useScan();
</script>
