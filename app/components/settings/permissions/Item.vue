<template>
  <li
    class="flex flex-col gap-3 rounded-2xl bg-paper p-4 shadow-sm shadow-indigo/10 md:p-5"
  >
    <div class="flex items-center gap-3">
      <span
        aria-hidden="true"
        class="grid size-11 shrink-0 place-items-center rounded-xl bg-indigo text-paper"
      >
        <component :is="info.icon" :stroke-width="1.75" class="size-5.5" />
      </span>
      <div class="min-w-0">
        <h3 class="font-display text-lg leading-tight font-bold">
          {{ info.title }}
        </h3>
        <UiBadge :status="status" class="mt-1" />
      </div>
    </div>

    <p class="text-sm leading-relaxed text-ink/70">{{ info.why }}</p>

    <p
      v-if="hint"
      class="rounded-xl bg-lavender/60 px-3.5 py-3 text-xs leading-relaxed md:text-sm"
    >
      {{ hint }}
    </p>

    <UiButton
      v-if="state === 'prompt'"
      class="mt-auto self-start"
      @click="request(info.key)"
    >
      Autoriser
    </UiButton>
    <UiButton
      v-else-if="state === 'granted'"
      variant="ghost"
      class="mt-auto self-start bg-lavender/60"
      @click="emit('revoke')"
    >
      <ShieldOff aria-hidden="true" class="size-4.5" />
      Retirer
    </UiButton>
    <UiButton
      v-else-if="needsInstall"
      class="mt-auto self-start"
      @click="install"
    >
      <Download aria-hidden="true" class="size-4.5" />
      Installer l’app
    </UiButton>
  </li>
</template>

<script setup lang="ts">
import { Download, ShieldOff } from "@lucide/vue";
import type { PermissionState } from "~/composables/usePermissions";
import { permissionStatus, type PermissionInfo } from "~/data/permissions";

const props = defineProps<{ info: PermissionInfo; state: PermissionState }>();
const emit = defineEmits<{ revoke: [] }>();

const { request } = usePermissions();
const { platform } = useDevice();
const { installed, install } = usePwaInstall();

const status = computed(() => permissionStatus[props.state]);

const needsInstall = computed(
  () =>
    props.info.key === "notifications" &&
    props.state === "unsupported" &&
    platform.value === "ios" &&
    !installed.value,
);

const hint = computed(() =>
  needsInstall.value ? props.info.hints.install : props.info.hints[props.state],
);
</script>
