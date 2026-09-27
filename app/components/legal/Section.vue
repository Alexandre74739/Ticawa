<template>
  <section class="scroll-mt-28 py-7 first:pt-0 md:scroll-mt-32">
    <h2 class="font-display text-xl font-bold tracking-[-0.01em] md:text-2xl">
      {{ title }}
    </h2>

    <div
      class="mt-4 space-y-4 leading-[1.7] text-ink/80 [&_a]:rounded [&_a]:font-medium [&_a]:text-indigo [&_a]:underline [&_a]:decoration-indigo/40 [&_a]:underline-offset-4 [&_a]:hover:decoration-indigo [&_a]:focus-visible:outline-none [&_a]:focus-visible:ring-2 [&_a]:focus-visible:ring-indigo [&_h3]:pt-2 [&_h3]:font-display [&_h3]:font-bold [&_h3]:text-ink [&_li]:relative [&_li]:pl-5 [&_li]:before:absolute [&_li]:before:top-[0.7em] [&_li]:before:left-0 [&_li]:before:size-1.5 [&_li]:before:rounded-full [&_li]:before:bg-indigo [&_strong]:font-semibold [&_strong]:text-ink [&_ul]:space-y-2"
    >
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{ title: string }>();
</script>
