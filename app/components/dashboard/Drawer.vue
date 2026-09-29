<template>
  <div class="md:hidden">
    <button
      v-show="!drawer"
      type="button"
      class="fixed top-1/2 left-0 z-20 grid h-16 w-5 -translate-y-1/2 place-items-center rounded-r-2xl bg-indigo text-paper shadow-lg shadow-indigo/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo focus-visible:ring-offset-2"
      @click="open"
    >
      <ChevronRight aria-hidden="true" class="size-4" />
      <span class="sr-only">Ouvrir le menu du tableau de bord</span>
    </button>

    <Teleport to="body">
      <Transition enter-from-class="opacity-0" leave-to-class="opacity-0">
        <div
          v-if="drawer"
          aria-hidden="true"
          class="fixed inset-0 z-50 bg-ink/30 backdrop-blur-sm transition-opacity duration-300 md:hidden"
          @click="close"
        />
      </Transition>
      <Transition
        enter-from-class="-translate-x-full"
        leave-to-class="-translate-x-full"
      >
        <nav
          v-if="drawer"
          aria-label="Navigation du tableau de bord"
          class="fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col gap-4 overflow-y-auto rounded-r-3xl bg-lavender px-3 shadow-2xl shadow-ink/30 transition-transform duration-300 ease-out md:hidden"
          style="
            padding-block: calc(1rem + env(safe-area-inset-top))
              calc(1rem + env(safe-area-inset-bottom));
          "
        >
          <div class="flex items-center justify-between pl-4.5">
            <p class="font-display text-lg font-bold">Mon espace</p>
            <button
              ref="closeButton"
              type="button"
              class="rounded-full p-2 transition-colors hover:bg-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo"
              @click="close"
            >
              <X aria-hidden="true" class="size-5" />
              <span class="sr-only">Fermer le menu</span>
            </button>
          </div>
          <DashboardNavList label-class="" @click="close" />
        </nav>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ChevronRight, X } from "@lucide/vue";

const { drawer, isPhone, open, close } = useDashboardSidebar();
const closeButton = ref<HTMLButtonElement | null>(null);

useSwipe({
  right: (startX) => isPhone() && startX < 60 && open(),
  left: close,
});

watch(drawer, async (isOpen) => {
  document.documentElement.style.overflow = isOpen ? "hidden" : "";
  if (isOpen) (await nextTick(), closeButton.value?.focus());
});
onBeforeUnmount(
  () => (close(), (document.documentElement.style.overflow = "")),
);
</script>
