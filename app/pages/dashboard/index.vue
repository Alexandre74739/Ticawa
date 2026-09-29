<template>
  <div>
    <DashboardHeading
      :title="`Bonjour ${user?.prenom ?? ''},`"
      accent="voici vos droits."
    />
    <DashboardSoon>
      L'essentiel de vos données en un coup d'œil : tickets, couvertures actives
      et prochaines échéances.
    </DashboardSoon>
  </div>
</template>

<script setup lang="ts">
useHead({ title: "Mon espace" });

const { user } = useUserSession();
</script>
