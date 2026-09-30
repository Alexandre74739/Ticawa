<template>
  <div class="mt-2 border-t border-indigo/10 pt-3">
    <p class="text-sm text-ink/75">
      Chaque Tico marque le
      <strong class="font-semibold text-ink">dernier jour pour échanger</strong>
      un achat. Touchez-le pour voir les tickets.
    </p>
    <ul
      class="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-ink/70 sm:grid-cols-4 md:grid-cols-2"
    >
      <li
        v-for="item in items"
        :key="item.label"
        class="flex items-center gap-2"
      >
        <span
          aria-hidden="true"
          class="relative grid size-7 shrink-0 place-items-center rounded-lg bg-paper"
        >
          <img
            v-if="item.mascot"
            :src="`/mascotte/${item.mascot}.svg`"
            alt=""
            class="w-4"
            :class="item.faded && 'opacity-35 grayscale'"
          />
          <span
            v-if="item.badge"
            class="absolute -top-1 -right-1 grid size-3.5 place-items-center rounded-full bg-indigo text-[0.55rem] font-bold text-paper"
          >
            2
          </span>
        </span>
        {{ item.label }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
const items = [
  { mascot: "Neutre", label: "Il reste du temps" },
  { mascot: "Surprised", label: "Moins de 15 jours" },
  { mascot: "Neutre", faded: true, label: "Délai dépassé" },
  { mascot: "Neutre", badge: true, label: "Plusieurs tickets" },
];
</script>
