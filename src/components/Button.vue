<template>
  <component
    :is="tag"
    :to="to"
    :href="href"
    :type="tag === 'button' ? type : undefined"
    :disabled="tag === 'button' ? disabled : undefined"
    :aria-disabled="disabled || undefined"
    :tabindex="disabled && tag !== 'button' ? -1 : undefined"
    class="group inline-flex items-center justify-center rounded-2xl font-nunito font-semibold transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo/40 focus-visible:ring-offset-2 focus-visible:ring-offset-paper aria-disabled:opacity-50 aria-disabled:pointer-events-none"
    :class="[variants[variant], sizes[size]]"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
import { NuxtLink } from "#components";

type Variant = "primary" | "secondary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

const props = withDefaults(
  defineProps<{
    variant?: Variant;
    size?: Size;
    to?: string;
    href?: string;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
  }>(),
  { variant: "primary", size: "md", type: "button" },
);

const tag = computed(() => (props.to ? NuxtLink : props.href ? "a" : "button"));

const variants: Record<Variant, string> = {
  primary: "bg-indigo text-paper hover:bg-indigo/80",
  secondary: "bg-lavender text-indigo hover:bg-indigo/80 hover:text-paper",
  outline: "border-2 border-indigo text-indigo hover:bg-lavender",
  ghost: "text-ink hover:bg-lavender/80",
};

const sizes: Record<Size, string> = {
  sm: "text-sm px-3 py-2 gap-1.5",
  md: "text-sm md:text-base px-5 py-3 gap-2",
  lg: "text-base md:text-lg px-5 py-2.5 gap-2.5",
};
</script>
