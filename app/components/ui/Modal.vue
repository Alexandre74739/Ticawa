<template>
  <Teleport to="body">
    <Transition
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
      enter-active-class="transition-opacity duration-200"
      leave-active-class="transition-opacity duration-150"
    >
      <div
        v-if="open"
        class="fixed inset-0 z-90 grid place-items-center overflow-y-auto bg-ink/50 p-4 backdrop-blur-sm"
        @click.self="open = false"
        @keydown.esc="open = false"
      >
        <MotionPopIn class="w-full max-w-md">
          <div
            ref="panel"
            role="dialog"
            aria-modal="true"
            :aria-labelledby="labelledby"
            class="relative rounded-4xl bg-paper px-6 pt-10 pb-7 text-ink shadow-2xl shadow-ink/25 md:px-8"
          >
            <button
              type="button"
              data-close
              class="absolute top-4 right-4 grid size-10 place-items-center rounded-full text-ink/60 transition-colors hover:bg-lavender hover:text-ink focus-visible:ring-2 focus-visible:ring-indigo focus-visible:outline-none"
              @click="open = false"
            >
              <X aria-hidden="true" class="size-5" />
              <span class="sr-only">Fermer</span>
            </button>
            <slot />
          </div>
        </MotionPopIn>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { X } from "@lucide/vue";

defineProps<{ labelledby: string }>();
const open = defineModel<boolean>({ required: true });

const panel = ref<HTMLElement | null>(null);
let lastFocus: HTMLElement | null = null;

function lock(value: boolean) {
  const app = document.getElementById("__nuxt");
  if (app) app.inert = value;
  document.documentElement.style.overflow = value ? "hidden" : "";
}

watch(open, async (value) => {
  lock(value);
  if (!value) return lastFocus?.focus();
  lastFocus = document.activeElement as HTMLElement | null;
  await nextTick();
  panel.value
    ?.querySelector<HTMLElement>("input, button:not([data-close])")
    ?.focus();
});

onBeforeUnmount(() => {
  if (open.value) lock(false);
});
</script>
