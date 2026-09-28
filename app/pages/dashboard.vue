<template>
  <main class="px-4 pt-28 pb-24 md:px-8 md:pt-36 standalone:pt-8">
    <div class="mx-auto mt-4 max-w-3xl 2xl:max-w-4xl">
      <h1
        class="font-display text-3xl leading-[1.05] md:text-4xl 2xl:text-5xl font-extrabold tracking-[-0.02em]"
      >
        Bonjour {{ user?.prenom }},
        <span
          class="block font-serif text-[1.05em] font-normal tracking-normal text-indigo italic"
        >
          voici vos droits.
        </span>
      </h1>
    </div>
  </main>
</template>

<script setup lang="ts">

definePageMeta({ middleware: "auth" });
useHead({ title: "Mon espace" });

const { user } = useUserSession();
</script>
