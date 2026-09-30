<template>
  <main
    class="relative isolate flex min-h-dvh flex-col overflow-hidden bg-linear-to-b from-indigo/35 via-lavender to-paper px-4 pt-24 pb-8 md:px-8 md:pt-28 standalone:pt-10"
  >
    <div
      class="mx-auto flex w-full max-w-sm flex-1 md:max-w-md 2xl:max-w-lg flex-col justify-center"
    >
      <NuxtLink
        to="/"
        class="mx-auto w-20 rounded-lg md:w-24 2xl:w-28 text-indigo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo focus-visible:ring-offset-4 focus-visible:ring-offset-paper"
      >
        <BrandLogoSecondary />
      </NuxtLink>

      <h1
        class="mt-5 text-center font-display text-2xl md:mt-6 md:text-3xl 2xl:text-4xl leading-[1.1] font-extrabold tracking-[-0.02em]"
      >
        {{ title }}
        <span
          class="block text-indigo"
        >
          {{ accent }}
        </span>
      </h1>

      <div
        v-if="error"
        role="alert"
        class="mt-5 flex gap-2.5 rounded-2xl bg-danger/10 px-4 py-3 text-sm 2xl:text-base text-danger"
      >
        <CircleAlert class="size-4.5 shrink-0" />
        <p>{{ error }}</p>
      </div>

      <div class="mt-5 space-y-4 md:mt-6 2xl:space-y-5">
        <template v-if="!hideGoogle">
          <AuthGoogleButton />

          <div class="flex items-center gap-3 text-xs text-ink/60 2xl:text-sm">
            <span class="h-px flex-1 bg-ink/15" />
            ou avec votre email
            <span class="h-px flex-1 bg-ink/15" />
          </div>
        </template>

        <slot />
      </div>

      <p class="mt-6 text-center text-sm text-ink/75 2xl:mt-8 2xl:text-base">
        <slot name="footer" />
      </p>
    </div>
  </main>
</template>

<script setup lang="ts">
import { CircleAlert } from "@lucide/vue";

defineProps<{
  title: string;
  accent: string;
  error?: string;
  hideGoogle?: boolean;
}>();
</script>
