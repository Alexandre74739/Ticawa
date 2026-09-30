<template>
  <div>
    <NuxtLink
      :to="back"
      class="mb-4 inline-flex items-center gap-1.5 rounded-xl py-1 font-display text-sm font-semibold text-indigo hover:underline focus-visible:ring-2 focus-visible:ring-indigo focus-visible:outline-none"
    >
      <ArrowLeft aria-hidden="true" class="size-4" />
      {{ fromUser ? "Fiche utilisateur" : "Mes tickets" }}
    </NuxtLink>

    <DashboardSoon
      v-if="!ticket"
      title="Ce ticket est introuvable"
      mascot="Brouille.svg"
    >
      Il a peut-être été supprimé.
    </DashboardSoon>

    <template v-else>
      <DashboardHeading :title="ticket.name ?? ticket.merchant ?? 'Ticket'" />

      <TicketForm
        v-if="editing"
        :ticket="ticket"
        @cancel="editing = false"
        @saved="onSaved"
      />
      <div v-else class="flex flex-col gap-4">
        <UiLabelCard v-if="fresh">
          <p>
            {{
              ticket.rawText
                ? "Ticket rangé ! Vérifiez ce que Tico a lu, puis validez la fiche."
                : "Ticket rangé, mais Tico n'a rien pu lire : la photo est gardée comme preuve, complétez la fiche."
            }}
          </p>
        </UiLabelCard>
        <div class="flex flex-wrap items-center gap-2">
          <UiBadge :status="reviewStatus(ticket.verified)" />
          <UiButton class="ml-auto" @click="editing = true">
            <PencilLine aria-hidden="true" class="size-4" />
            {{ ticket.verified ? "Modifier" : "Vérifier la fiche" }}
          </UiButton>
        </div>
        <TicketReturn :ticket="ticket" />
        <TicketCoverage :ticket="ticket" />
        <TicketDetails :ticket="ticket" />
        <TicketProof
          v-if="ticket.file"
          :id="ticket.id"
          :file="ticket.file"
          :raw-text="ticket.rawText"
        />
        <UiButton variant="ghost" class="self-center" @click="remove?.open()">
          <Trash2 aria-hidden="true" class="size-4" /> Supprimer ce ticket
        </UiButton>
      </div>
      <TicketDeleteDialog :id="ticket.id" ref="remove" :back="back" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeft, PencilLine, Trash2 } from "@lucide/vue";
import type { Ticket } from "#shared/types/ticket";
import { reviewStatus } from "~/data/ticketFields";

const route = useRoute();

// Ticket ouvert par un admin depuis une fiche utilisateur : on y retourne.
const previous = useRouter().options.history.state.back;
const fromUser =
  typeof previous === "string" &&
  previous.startsWith("/dashboard/utilisateurs/");
const back = fromUser ? (previous as string) : "/dashboard/tickets";
const { data: ticket } = await useFetch<Ticket>(
  `/api/tickets/${route.params.id}`,
);

useHead({
  title: () => ticket.value?.name ?? ticket.value?.merchant ?? "Ticket",
});

const fresh = ref(route.query.nouveau === "1");
const editing = ref(false);
const remove = ref<{ open: () => void } | null>(null);

function onSaved(saved: Ticket) {
  ticket.value = saved;
  editing.value = false;
  fresh.value = false;
  window.scrollTo({ top: 0, behavior: "smooth" });
}
</script>
