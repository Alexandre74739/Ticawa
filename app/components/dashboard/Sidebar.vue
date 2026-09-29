<template>
  <aside
    class="sticky top-26 hidden shrink-0 self-start transition-[width] duration-300 ease-out md:block standalone:top-6"
    :class="width"
  >
    <nav
      aria-label="Navigation du tableau de bord"
      class="flex max-h-[calc(100dvh-8.5rem)] flex-col gap-2 overflow-x-hidden overflow-y-auto rounded-3xl bg-lavender p-2 [scrollbar-width:thin] standalone:max-h-[calc(100dvh-7.5rem)]"
    >
      <DashboardNavList :label-class="label" />
      <DashboardSidebarToggle
        :open-class="openIcon"
        :close-class="closeIcon"
        @click="toggle"
      />
    </nav>
  </aside>
</template>

<script setup lang="ts">
const { collapsed, toggle } = useDashboardSidebar();

const auto = computed(() => collapsed.value === null);

const width = computed(() =>
  auto.value
    ? "w-18 lg:w-60 xl:w-70"
    : collapsed.value
      ? "w-18"
      : "w-60 xl:w-70",
);
const label = computed(() =>
  auto.value ? "sr-only lg:not-sr-only" : collapsed.value ? "sr-only" : "",
);
const openIcon = computed(() =>
  auto.value ? "lg:hidden" : collapsed.value ? "" : "hidden",
);
const closeIcon = computed(() =>
  auto.value ? "max-lg:hidden" : collapsed.value ? "hidden" : "",
);
</script>
