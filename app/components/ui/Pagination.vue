<template>
  <nav
    v-if="pages > 1"
    :aria-label="label"
    class="flex items-center justify-between gap-3"
  >
    <UiButton variant="ghost" :disabled="page <= 1" @click="go(page - 1)">
      <ChevronLeft aria-hidden="true" class="size-4" /> Précédent
    </UiButton>
    <p class="text-sm font-medium">Page {{ page }} sur {{ pages }}</p>
    <UiButton variant="ghost" :disabled="page >= pages" @click="go(page + 1)">
      Suivant <ChevronRight aria-hidden="true" class="size-4" />
    </UiButton>
  </nav>
</template>

<script setup lang="ts">
import { ChevronLeft, ChevronRight } from "@lucide/vue";

// La page courante vit dans l'URL (?page=), pour garder le retour arrière.
defineProps<{ page: number; pages: number; label: string }>();

const route = useRoute();

function go(target: number) {
  navigateTo({
    query: { ...route.query, page: target > 1 ? target : undefined },
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
}
</script>
