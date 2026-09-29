<template>
  <main class="min-h-dvh px-3 pt-28 pb-24 md:px-6 md:pt-36 standalone:pt-6">
    <div class="mx-auto mt-4 flex max-w-6xl gap-6 standalone:mt-0 lg:gap-8">
      <DashboardSidebar />
      <div class="min-w-0 flex-1">
        <NuxtPage />
      </div>
    </div>
    <DashboardDrawer />
  </main>
</template>

<script setup lang="ts">
definePageMeta({ middleware: "auth" });
</script>
