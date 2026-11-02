<template>
  <div>
    <NuxtLayout>
      <NuxtPage
        :page-key="
          (route) =>
            (route.matched.length > 1 ? route.matched[0]!.path : route.path) +
            pageKey
        "
      />
    </NuxtLayout>
    <PwaInstallGuide />
  </div>
</template>

<script setup lang="ts">
const pageKey = ref(0);

const route = useRoute();
const { siteUrl } = useRuntimeConfig().public;
const origin = new URL(siteUrl).origin;
const canonical = computed(() => origin + route.path);

useHead({ link: [{ rel: "canonical", href: canonical }] });
useSeoMeta({ ogUrl: canonical, ogImage: `${origin}/pwa/icon-512.png` });

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
