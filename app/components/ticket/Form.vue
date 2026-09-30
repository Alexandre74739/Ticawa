<template>
  <form class="flex flex-col gap-4" @submit.prevent="execute">
    <SettingsPanel
      v-for="group in ticketGroups"
      :key="group.title"
      :icon="group.icon"
      :title="group.title"
    >
      <div class="grid gap-3 sm:grid-cols-2">
        <UiInput optional
          v-for="field in group.fields"
          :key="field.key"
          v-model="values[field.key]"
          :label="field.label"
          :type="field.type"
          :inputmode="field.inputmode"
          :placeholder="field.placeholder"
          :class="{ 'sm:col-span-2': field.type === 'textarea' || field.key === 'name' }"
        />
      </div>
    </SettingsPanel>

    <TicketFormItems :items="items" @add="addItem" @remove="removeItem" />

    <UiAlert v-if="error" tone="danger">{{ error }}</UiAlert>
    <div
      class="sticky bottom-24 z-10 flex gap-3 rounded-3xl bg-paper/90 p-2 backdrop-blur md:bottom-4"
    >
      <UiButton variant="ghost" class="flex-1" @click="emit('cancel')">
        Annuler
      </UiButton>
      <UiButton type="submit" class="flex-1" :disabled="pending">
        {{ pending ? "Enregistrement…" : "Valider la fiche" }}
      </UiButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import type { Ticket } from "#shared/types/ticket";
import { ticketGroups } from "~/data/ticketFields";

const props = defineProps<{ ticket: Ticket }>();
const emit = defineEmits<{ cancel: []; saved: [ticket: Ticket] }>();

const { values, items, toFields, addItem, removeItem } = useTicketForm(
  props.ticket,
);

const { pending, error, execute } = useAction(async () => {
  const saved = await $fetch<Ticket>(`/api/tickets/${props.ticket.id}`, {
    method: "PATCH",
    body: toFields(),
  });
  emit("saved", saved);
});
</script>
