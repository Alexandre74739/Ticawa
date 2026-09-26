<template>
  <header class="fixed inset-x-0 top-0 z-30 px-3 pt-3 md:px-6 md:pt-5">
    <div
      class="mx-auto flex max-w-6xl items-center justify-between rounded-2xl border border-ink/15 bg-paper py-2 pr-2 pl-5 shadow-xl shadow-ink/15"
    >
      <NuxtLink
        to="/"
        class="shrink-0 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo focus-visible:ring-offset-4 focus-visible:ring-offset-paper"
      >
        <BrandLogo class="h-7 w-auto md:h-8" />
      </NuxtLink>

      <nav class="flex items-center gap-2">
        <UiButton to="/connexion" variant="ghost">Connexion</UiButton>

        <div
          ref="floating"
          class="fixed right-4 z-30 sm:static"
          style="bottom: calc(1rem + env(safe-area-inset-bottom))"
        >
          <UiButton
            to="/"
            arrow
            :variant="onIndigo ? 'light' : 'primary'"
            class="shadow-xl shadow-ink/25 max-sm:px-8! max-sm:py-3.5! sm:shadow-none"
          >
            Installer l'app
          </UiButton>
        </div>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
const floating = ref<HTMLElement | null>(null);
const onIndigo = ref(false);

const update = () => {
  const el = floating.value;
  if (!el || getComputedStyle(el).position !== "fixed")
    return (onIndigo.value = false);
  const { left, top, height } = el.getBoundingClientRect();
  const below = document.elementFromPoint(left - 4, top + height / 2);
  onIndigo.value = !!below?.closest(".bg-indigo");
};

onMounted(() => {
  update();
  addEventListener("scroll", update, { passive: true });
});
onBeforeUnmount(() => removeEventListener("scroll", update));
</script>
