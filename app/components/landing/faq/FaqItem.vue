<template>
  <motion.div
    :initial="{ opacity: 0, y: 32 }"
    :animate="show ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }"
    :transition="{ duration: 0.8, delay: index * 0.15, ease: EASE_OUT }"
  >
    <div
      class="overflow-hidden rounded-3xl ring-1 transition duration-300"
      :class="
        open
          ? 'bg-lavender shadow-xl shadow-indigo/15 ring-indigo/20'
          : 'bg-paper ring-ink/10 hover:ring-indigo/25'
      "
    >
      <h3>
        <button
          :id="`${uid}-question`"
          type="button"
          :aria-expanded="open"
          :aria-controls="`${uid}-answer`"
          class="group flex w-full items-start gap-4 px-5 py-5 text-left focus-visible:ring-2 focus-visible:ring-indigo focus-visible:ring-inset focus-visible:outline-none md:gap-5 md:px-7 md:py-6"
          @click="emit('toggle')"
        >
          <span
            class="mt-1 shrink-0 font-display text-xs font-bold tabular-nums transition-colors duration-300"
            :class="open ? 'text-indigo' : 'text-ink/30'"
          >
            {{ String(index + 1).padStart(2, "0") }}
          </span>

          <span
            class="grow font-display text-base leading-snug font-bold tracking-[-0.01em] transition-colors duration-300 md:text-lg"
            :class="open ? 'text-indigo' : 'text-ink group-hover:text-indigo'"
          >
            {{ item.question }}
          </span>

          <span
            class="relative mt-0.5 grid size-7 shrink-0 place-items-center rounded-full transition-colors duration-300"
            :class="
              open
                ? 'bg-indigo text-paper'
                : 'bg-lavender text-indigo group-hover:bg-indigo group-hover:text-paper'
            "
          >
            <span class="absolute h-0.5 w-3 rounded-full bg-current" />
            <span
              class="absolute h-0.5 w-3 rounded-full bg-current transition-transform duration-300 motion-reduce:transition-none"
              :class="open ? 'rotate-0' : 'rotate-90'"
            />
          </span>
        </button>
      </h3>

      <div
        :id="`${uid}-answer`"
        role="region"
        :aria-labelledby="`${uid}-question`"
        class="grid transition-[grid-template-rows] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
        :class="open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
      >
        <div
          class="overflow-hidden transition-[visibility] duration-400 motion-reduce:transition-none"
          :class="open ? 'visible' : 'invisible'"
        >
          <p
            class="max-w-3xl px-5 pb-6 text-[15px] leading-relaxed text-ink/75 md:pb-7 md:pl-14 md:text-base"
          >
            {{ item.answer }}
          </p>
        </div>
      </div>
    </div>
  </motion.div>
</template>

<script setup lang="ts">
import { motion } from "motion-v";
import type { FaqItem } from "#shared/types/sections";
import { EASE_OUT } from "~/utils/motion";

defineProps<{
  item: FaqItem;
  index: number;
  open: boolean;
  show: boolean;
}>();

const emit = defineEmits<{ toggle: [] }>();

const uid = useId();
</script>
