<template>
  <UiModal v-model="open" :labelledby="titleId">
    <template v-if="info">
      <div class="text-center">
        <UiTicoLive mood="sad" class="mx-auto h-auto w-24" />
        <h2
          :id="titleId"
          class="mt-4 font-display text-xl font-extrabold md:text-2xl"
        >
          Retirer l’accès
          <span
            class="block font-serif text-[1.1em] font-normal text-indigo italic"
          >
            {{ info.revoke.title }}
          </span>
        </h2>
      </div>

      <UiAlert v-if="stopped" tone="success" class="mt-5">
        {{ stopped }}
      </UiAlert>
      <UiAlert v-if="stopPush.error.value" tone="danger" class="mt-5">
        {{ stopPush.error.value }}
      </UiAlert>

      <p class="mt-5 text-sm leading-relaxed text-ink/70 md:text-base">
        {{ info.revoke.intro }}
      </p>
      <ol class="mt-3 space-y-2 text-sm leading-relaxed md:text-base">
        <li
          v-for="(step, index) in steps"
          :key="step"
          class="flex gap-3 rounded-xl bg-lavender/60 px-3.5 py-2.5"
        >
          <span
            aria-hidden="true"
            class="grid size-6 shrink-0 place-items-center rounded-full bg-indigo font-display text-xs font-bold text-paper"
          >
            {{ index + 1 }}
          </span>
          {{ step }}
        </li>
      </ol>
      <p class="mt-3 text-xs leading-relaxed text-ink/60 md:text-sm">
        Revenez ensuite dans Ticawa : l’état se met à jour tout seul.
      </p>

      <UiButton class="mt-6 w-full" @click="open = false">
        C’est compris
      </UiButton>
    </template>
  </UiModal>
</template>

<script setup lang="ts">
import type { PermissionInfo } from "~/data/permissions";

const props = defineProps<{ info: PermissionInfo | null }>();
const open = defineModel<boolean>({ required: true });

const titleId = useId();
const { platform } = useDevice();
const { installed } = usePwaInstall();
const { states } = usePermissions();
const stopPush = useStopPush();
const stopped = ref("");

const steps = computed(() => {
  if (!props.info) return [];
  const where = installed.value
    ? props.info.revoke.app
    : props.info.revoke.browser;
  return platform.value === "ios" ? where.ios : where.android;
});

watch(open, async (value) => {
  stopped.value = "";
  if (value && props.info?.key === "notifications")
    stopped.value = (await stopPush.execute()) ?? "";
});

watch(
  () => props.info && states[props.info.key],
  (state) => {
    if (open.value && state !== "granted") open.value = false;
  },
);
</script>
