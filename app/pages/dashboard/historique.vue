<template>
  <div>
    <DashboardHeading title="Historique," accent="les actions des admins" />
    <DashboardSoon>
      Qui a consulté, modifié ou supprimé quel compte, et quand : la trace
      demandée par le RGPD.
    </DashboardSoon>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: "admin" });
useHead({ title: "Historique" });
</script>
