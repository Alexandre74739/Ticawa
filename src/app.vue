<template>
  <div>
    <NuxtLayout>
      <NuxtPage :page-key="(route) => route.path + pageKey" />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
const pageKey = ref(0);

onMounted(() => {
  document.addEventListener(
    "click",
    (event) => {
      const link = (event.target as Element).closest<HTMLAnchorElement>(
        'a[aria-current="page"]',
      );
      if (!link || link.hash || event.button || event.ctrlKey || event.metaKey)
        return;
      event.preventDefault();
      scrollTo(0, 0);
      pageKey.value++;
    },
    { capture: true },
  );
});
</script>
