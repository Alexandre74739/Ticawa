<template>
  <section id="faq" class="bg-paper px-4 pb-24 md:px-8 md:pb-36">
    <div class="mx-auto max-w-6xl">
      <MotionReveal class="max-w-3xl">
        <h2
          class="font-display text-3xl leading-[1.05] font-bold tracking-[-0.02em] text-ink md:text-5xl"
        >
          {{ title }}
          <span
            class="block text-indigo"
          >
            {{ titleAccent }}
          </span>
        </h2>
        <p class="mt-5 text-base leading-relaxed text-ink/75 md:text-lg">
          {{ description }}
        </p>
      </MotionReveal>

      <div ref="list" class="mt-12 flex flex-col gap-4 md:mt-20 md:gap-5">
        <LandingFaqItem
          v-for="(item, i) in items"
          :key="item.question"
          :item="item"
          :index="i"
          :open="opened === i"
          :show="started"
          @toggle="toggle(i)"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useInView } from "motion-v";
import type { FaqItem } from "#shared/types/sections";

defineProps<{
  title: string;
  titleAccent: string;
  description: string;
  items: FaqItem[];
}>();

const list = ref<HTMLElement | null>(null);

// Une seule entrée en vue déclenche la cascade de toute la liste.
const started = useInView(list, {
  once: true,
  margin: "0px 0px -15% 0px",
});

const opened = ref(-1);

const toggle = (i: number) => (opened.value = opened.value === i ? -1 : i);
</script>
