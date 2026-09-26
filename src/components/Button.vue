<template>
  <component
    :is="tag"
    data-button
    :to="to"
    :href="href"
    :type="tag === 'button' ? type : undefined"
    :disabled="tag === 'button' ? disabled : undefined"
    :aria-disabled="disabled || undefined"
    :tabindex="disabled && tag !== 'button' ? -1 : undefined"
    class="group inline-flex items-center justify-center gap-2 rounded-xl font-display font-semibold transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-offset-2 focus-visible:ring-offset-transparent aria-disabled:pointer-events-none aria-disabled:opacity-50"
    :class="[variants[variant], sizes[size]]"
  >
    <slot />
    <ArrowRight
      v-if="arrow"
      class="size-[1.1em] transition-transform duration-300 group-hover:translate-x-1"
    />
  </component>
</template>

<script setup lang="ts">
import { NuxtLink } from "#components";
import { ArrowRight } from "@lucide/vue";

type Variant = "primary" | "light" | "ghost";
type Size = "md" | "lg";

const props = withDefaults(
  defineProps<{
    variant?: Variant;
    size?: Size;
    arrow?: boolean;
    to?: string;
    href?: string;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
  }>(),
  { variant: "primary", size: "md", type: "button" },
);

const tag = computed(() => (props.to ? NuxtLink : props.href ? "a" : "button"));

const variants: Record<Variant, string> = {
  primary: "bg-indigo text-paper hover:bg-indigo/90",
  light: "bg-paper text-indigo hover:bg-lavender",
  ghost: "text-ink hover:bg-lavender/80",
};

const sizes: Record<Size, string> = {
  md: "px-4 py-2.5 text-sm md:text-base",
  lg: "px-6 py-3.5 text-base md:text-lg",
};
</script>
