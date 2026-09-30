<template>
  <div
    class="relative isolate flex items-center gap-4 overflow-hidden rounded-[2.5rem] bg-indigo px-5 py-7 text-paper shadow-2xl shadow-indigo/35 sm:gap-6 sm:px-8 md:gap-8 md:px-10 md:py-9"
  >
    <AccountHeroDecor />

    <div
      class="relative hidden w-20 shrink-0 place-items-center sm:grid sm:w-24 md:w-32"
    >
      <MotionLoop
        v-for="(ring, i) in rings"
        :key="i"
        :keyframes="{ rotate: ring.rotate, scale: ring.scale }"
        :duration="ring.duration"
        class="absolute inset-0 rounded-full border-2 border-paper"
        :class="ring.style"
      />
      <MotionLoop
        :keyframes="{ y: [0, -9, 0], scaleY: [1, 1.04, 1] }"
        :duration="3.4"
        class="w-[78%] origin-bottom"
      >
        <UiTicoLive mood="happy" dark-bg class="h-auto w-full" />
      </MotionLoop>
    </div>

    <div class="min-w-0 shrink standalone:pr-12">
      <p
        class="truncate font-display text-xl font-extrabold sm:text-2xl md:text-3xl"
      >
        {{ prenom }} {{ nom }}
      </p>
      <p class="truncate text-sm text-paper/80 md:text-base">{{ email }}</p>
      <p
        class="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-paper/15 px-3 py-1 text-xs font-medium whitespace-nowrap md:text-sm"
      >
        <Sparkles aria-hidden="true" class="size-3.5" />
        Membre depuis {{ since }}
      </p>
    </div>

    <button
      type="button"
      aria-label="Se déconnecter"
      class="absolute top-4 right-4 hidden size-10 place-items-center rounded-full bg-paper/15 transition-colors duration-300 hover:bg-paper/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-paper standalone:grid"
      @click="logout"
    >
      <LogOut aria-hidden="true" class="size-4.5" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { LogOut, Sparkles } from "@lucide/vue";

const props = defineProps<{
  prenom: string;
  nom: string | null;
  email: string;
  createdAt: string;
}>();

const { clear } = useUserSession();

async function logout() {
  await clear();
  await navigateTo("/connexion");
}

const since = computed(() =>
  new Date(props.createdAt).toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
  }),
);

const rings = [
  {
    style: "opacity-45",
    rotate: [-4, 3, -4],
    scale: [1.06, 1.12, 1.06],
    duration: 7,
  },
  {
    style: "opacity-25",
    rotate: [6, -2, 6],
    scale: [1.18, 1.24, 1.18],
    duration: 9,
  },
  {
    style: "opacity-10",
    rotate: [-9, -4, -9],
    scale: [1.3, 1.35, 1.3],
    duration: 11,
  },
];
</script>
