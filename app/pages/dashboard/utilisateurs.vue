<template>
  <div>
    <DashboardHeading
      title="Utilisateurs,"
      accent="les comptes de la plateforme."
    />
    <DashboardSoon>
      Consultez et gérez le profil des utilisateurs (les comptes admin ne sont
      pas listés).
    </DashboardSoon>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: "admin" });
useHead({ title: "Utilisateurs" });
</script>
