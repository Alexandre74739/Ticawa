<template>
  <div>
    <DashboardHeading title="Statistiques," accent="l'usage de Ticawa" />
    <DashboardSoon>
      Les chiffres d'usage de la plateforme, sans donnée personnelle.
    </DashboardSoon>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: "admin" });
useHead({ title: "Statistiques" });
</script>
