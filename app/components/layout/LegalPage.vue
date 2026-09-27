<template>
  <main class="px-4 pt-28 pb-24 md:px-8 md:pt-36">
    <div class="mx-auto max-w-2xl">
      <p
        class="font-display text-sm font-bold tracking-wide text-indigo uppercase"
      >
        Informations légales
      </p>
      <h1
        class="mt-2 font-display text-4xl leading-[1.05] font-extrabold tracking-[-0.02em] md:text-5xl"
      >
        {{ title }}
        <span
          v-if="titleAccent"
          class="block font-serif text-[1.05em] font-normal tracking-normal text-indigo italic"
        >
          {{ titleAccent }}
        </span>
      </h1>
      <p class="mt-4 text-lg leading-relaxed text-ink/75">
        {{ intro }}
      </p>

      <nav aria-label="Pages légales" class="mt-6 flex flex-wrap gap-2">
        <NuxtLink
          v-for="page in pages"
          :key="page.to"
          :to="page.to"
          class="inline-block rounded-full border border-ink/15 px-4 py-1.5 text-sm font-medium transition-colors hover:bg-lavender/85 hover:border-indigo hover:text-indigo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo"
          exact-active-class="border-indigo! bg-indigo! text-paper! hover:text-paper!"
        >
          {{ page.label }}
        </NuxtLink>
      </nav>

      <div class="mt-10 divide-y divide-ink/10">
        <slot />
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  titleAccent?: string;
  intro: string;
}>();

const pages = [
  { label: "Mentions légales", to: "/mentions-legales" },
  { label: "Confidentialité", to: "/confidentialite" },
  { label: "CGU", to: "/cgu" },
];
</script>
