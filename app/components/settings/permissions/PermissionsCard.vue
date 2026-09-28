<template>
  <AccountCard
    title="Autorisations"
    accent="ce que votre téléphone permet"
    description="Tico ne demande que le strict nécessaire. Voici ce que votre appareil lui autorise, et pourquoi il en a besoin."
    mascot="Interrogated.svg"
    :duration="4.8"
    :delay="delay"
  >
    <p
      v-if="!ready"
      role="status"
      class="rounded-2xl bg-paper p-4 text-sm text-ink/60 shadow-sm shadow-indigo/10"
    >
      Tico vérifie votre appareil…
    </p>

    <ul v-else class="grid gap-4 lg:grid-cols-3 lg:gap-6">
      <SettingsPermissionsItem
        v-for="info in permissions"
        :key="info.key"
        :info="info"
        :state="states[info.key]"
        @revoke="revoke(info)"
      />
    </ul>

    <SettingsPermissionsRevokeModal v-model="revokeOpen" :info="revoking" />
  </AccountCard>
</template>

<script setup lang="ts">
import { permissions, type PermissionInfo } from "~/data/permissions";

defineProps<{ delay?: number }>();

const { states, ready } = usePermissions();

const revoking = shallowRef<PermissionInfo | null>(null);
const revokeOpen = ref(false);

function revoke(info: PermissionInfo) {
  revoking.value = info;
  revokeOpen.value = true;
}
</script>
