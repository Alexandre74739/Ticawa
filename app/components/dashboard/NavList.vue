<template>
  <div class="flex flex-col gap-1">
    <ul class="flex flex-col gap-1">
      <DashboardNavItem
        v-for="link in dashboardLinks"
        :key="link.to"
        :link="link"
        :label-class="labelClass"
      />
    </ul>

    <template v-if="isAdmin">
      <p
        class="mt-2 flex h-8 items-end border-t border-ink/10 px-4.5 pb-1 font-display text-xs font-bold tracking-wide whitespace-nowrap text-ink/50 uppercase"
      >
        <span :class="labelClass">Administration</span>
      </p>
      <ul class="flex flex-col gap-1">
        <DashboardNavItem
          v-for="link in adminLinks"
          :key="link.to"
          :link="link"
          :label-class="labelClass"
        />
      </ul>
    </template>
  </div>
</template>

<script setup lang="ts">
import { adminLinks, dashboardLinks } from "~/data/dashboard";

defineProps<{ labelClass: string }>();

const { user } = useUserSession();
const isAdmin = computed(() => user.value?.role === "admin");
</script>
