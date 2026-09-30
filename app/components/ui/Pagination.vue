<template>
  <nav
    v-if="pages > 1"
    :aria-label="label"
    class="flex items-center justify-center gap-1 md:gap-2"
  >
    <button
      type="button"
      :disabled="page <= 1"
      aria-label="Page précédente"
      :class="[cell, 'hover:bg-lavender']"
      @click="go(page - 1)"
    >
      <ChevronLeft aria-hidden="true" class="size-5" />
    </button>

    <ul class="flex items-center gap-1 md:gap-2">
      <li v-for="(item, index) in items" :key="index">
        <span
          v-if="item === null"
          aria-hidden="true"
          class="grid size-9 place-items-center text-ink/50 md:size-10"
        >
          …
        </span>
        <button
          v-else
          type="button"
          :aria-current="item === page ? 'page' : undefined"
          :aria-label="`Page ${item}`"
          :class="[
            cell,
            item === page
              ? 'bg-indigo text-paper shadow-md shadow-indigo/25'
              : 'hover:bg-lavender',
          ]"
          @click="item !== page && go(item)"
        >
          {{ item }}
        </button>
      </li>
    </ul>

    <button
      type="button"
      :disabled="page >= pages"
      aria-label="Page suivante"
      :class="[cell, 'hover:bg-lavender']"
      @click="go(page + 1)"
    >
      <ChevronRight aria-hidden="true" class="size-5" />
    </button>
  </nav>
</template>

<script setup lang="ts">
import { ChevronLeft, ChevronRight } from "@lucide/vue";

const props = defineProps<{ page: number; pages: number; label: string }>();

const cell =
  "grid size-9 place-items-center rounded-xl font-display font-bold transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-indigo focus-visible:outline-none disabled:pointer-events-none disabled:opacity-40 md:size-10";

const items = computed<(number | null)[]>(() => {
  const { page, pages } = props;
  if (pages <= 5) return Array.from({ length: pages }, (_, i) => i + 1);
  const middle = Math.min(Math.max(page, 3), pages - 2);
  return [
    1,
    middle > 3 ? null : 2,
    middle,
    middle < pages - 2 ? null : pages - 1,
    pages,
  ];
});

const route = useRoute();

function go(target: number) {
  navigateTo({
    query: { ...route.query, page: target > 1 ? target : undefined },
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
}
</script>
