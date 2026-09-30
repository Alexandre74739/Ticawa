<template>
  <SettingsPanel :icon="ShoppingBag" title="Articles">
    <ul class="flex flex-col gap-3">
      <li
        v-for="(item, i) in items"
        :key="i"
        class="grid grid-cols-[1fr_4rem_5.5rem_auto] items-end gap-2 rounded-2xl bg-lavender p-3"
      >
        <UiInput optional v-model="item.label" label="Article" class="col-span-4" />
        <UiInput optional v-model="item.reference" label="Référence" />
        <UiInput optional v-model="item.quantity" label="Qté" inputmode="decimal" />
        <UiInput optional
          v-model="item.totalPrice"
          label="Prix (€)"
          inputmode="decimal"
        />
        <button
          type="button"
          class="grid size-11 place-items-center rounded-xl text-ink/60 transition-colors hover:bg-paper hover:text-ink focus-visible:ring-2 focus-visible:ring-indigo focus-visible:outline-none"
          @click="emit('remove', i)"
        >
          <Trash2 aria-hidden="true" class="size-5" />
          <span class="sr-only">Retirer {{ item.label || "cet article" }}</span>
        </button>
      </li>
    </ul>
    <UiButton variant="ghost" class="self-start" @click="emit('add')">
      <Plus aria-hidden="true" class="size-4" /> Ajouter un article
    </UiButton>
  </SettingsPanel>
</template>

<script setup lang="ts">
import { Plus, ShoppingBag, Trash2 } from "@lucide/vue";
import type { ItemDraft } from "~/composables/useTicketForm";

defineProps<{ items: ItemDraft[] }>();
const emit = defineEmits<{ add: []; remove: [index: number] }>();
</script>
