<template>
  <div ref="root" class="relative" @keydown.esc="close(true)">
    <button
      ref="trigger"
      type="button"
      aria-haspopup="menu"
      :aria-expanded="open"
      :aria-controls="menuId"
      class="flex items-center gap-2 rounded-xl py-1.5 pr-2.5 pl-1.5 font-display font-semibold text-ink transition-colors duration-300 hover:bg-lavender focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo focus-visible:ring-offset-2"
      @click="open ? close() : show()"
      @keydown.down.prevent="show()"
    >
      <span
        aria-hidden="true"
        class="grid size-8 place-items-center rounded-full bg-indigo text-sm font-bold text-paper"
      >
        {{ initial }}
      </span>
      <span class="max-w-32 truncate text-sm max-sm:sr-only md:text-base">
        {{ user?.prenom }}
      </span>
      <ChevronDown
        aria-hidden="true"
        class="size-4 transition-transform duration-300"
        :class="{ 'rotate-180': open }"
      />
    </button>

    <Transition
      enter-from-class="[clip-path:inset(0_0_100%_0_round_1rem)]"
      enter-to-class="[clip-path:inset(0_0_0_0_round_1rem)]"
      leave-from-class="[clip-path:inset(0_0_0_0_round_1rem)]"
      leave-to-class="[clip-path:inset(0_0_100%_0_round_1rem)]"
      enter-active-class="transition-[clip-path] duration-300 ease-out motion-reduce:transition-none"
      leave-active-class="transition-[clip-path] duration-200 ease-in motion-reduce:transition-none"
    >
      <ul
        v-if="open"
        :id="menuId"
        ref="menu"
        role="menu"
        :aria-label="`Menu de ${user?.prenom}`"
        class="absolute mt-2 w-56 rounded-2xl max-sm:right-0 sm:left-0 border border-ink/10 bg-paper p-1.5 shadow-xl shadow-ink/15"
        @keydown.down.prevent="move(1)"
        @keydown.up.prevent="move(-1)"
        @keydown.tab="close()"
      >
        <li v-for="item in items" :key="item.label" role="none">
          <NuxtLink
            v-if="item.to"
            :to="item.to"
            role="menuitem"
            :class="itemClass"
            @click="close()"
          >
            <component :is="item.icon" class="size-4.5 text-indigo" />
            {{ item.label }}
          </NuxtLink>
          <button
            v-else
            type="button"
            role="menuitem"
            :class="[itemClass, 'mt-1 border-t border-ink/10 pt-3']"
            @click="logout"
          >
            <component :is="item.icon" class="size-4.5 text-indigo" />
            {{ item.label }}
          </button>
        </li>
      </ul>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Settings,
  UserRound,
} from "@lucide/vue";

const { user, clear } = useUserSession();
const menuId = useId();
const open = ref(false);
const root = ref<HTMLElement | null>(null);
const trigger = ref<HTMLButtonElement | null>(null);
const menu = ref<HTMLUListElement | null>(null);

const initial = computed(() => user.value?.prenom.charAt(0).toUpperCase());

const items = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Compte", to: "/compte", icon: UserRound },
  { label: "Paramètres", to: "/parametres", icon: Settings },
  { label: "Déconnexion", icon: LogOut },
];

const itemClass =
  "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-ink transition-colors hover:bg-lavender focus-visible:bg-lavender focus-visible:outline-none";

const entries = () => [
  ...(menu.value?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? []),
];

async function show() {
  open.value = true;
  await nextTick();
  entries()[0]?.focus();
}

function close(refocus = false) {
  open.value = false;
  if (refocus) trigger.value?.focus();
}

function move(step: number) {
  const list = entries();
  const i = list.indexOf(document.activeElement as HTMLElement);
  list[(i + step + list.length) % list.length]?.focus();
}

async function logout() {
  close();
  await clear();
  await navigateTo("/connexion");
}

const onOutside = (event: PointerEvent) => {
  if (!root.value?.contains(event.target as Node)) close();
};
onMounted(() => addEventListener("pointerdown", onOutside));
onBeforeUnmount(() => removeEventListener("pointerdown", onOutside));
</script>
