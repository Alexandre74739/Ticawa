<template>
  <div>
    <label :for="id" class="block text-sm font-medium 2xl:text-base">{{
      label
    }}</label>
    <div class="relative mt-1">
      <input
        :id="id"
        v-model="model"
        :type="
          isPassword && !revealed ? 'password' : isPassword ? 'text' : type
        "
        :autocomplete="autocomplete"
        :minlength="minlength"
        :aria-describedby="hint ? `${id}-hint` : undefined"
        required
        class="w-full rounded-xl border border-ink/15 bg-white px-3.5 py-2.5 text-base 2xl:px-4 2xl:py-3 text-ink transition-colors placeholder:text-ink/40 focus:border-indigo focus:outline-none focus:ring-2 focus:ring-indigo/30"
        :class="{ 'pr-12': isPassword }"
      />
      <button
        v-if="isPassword"
        type="button"
        class="absolute inset-y-0 right-0 grid w-12 place-items-center rounded-r-xl text-ink/60 hover:text-indigo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo"
        :aria-pressed="revealed"
        @click="revealed = !revealed"
      >
        <component :is="revealed ? EyeOff : Eye" class="size-5" />
        <span class="sr-only">
          {{
            revealed ? "Masquer le mot de passe" : "Afficher le mot de passe"
          }}
        </span>
      </button>
    </div>
    <p
      v-if="hint"
      :id="`${id}-hint`"
      class="mt-1 text-xs text-ink/60 2xl:text-sm"
    >
      {{ hint }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { Eye, EyeOff } from "@lucide/vue";

const props = withDefaults(
  defineProps<{
    label: string;
    type?: "text" | "email" | "password";
    autocomplete?: string;
    minlength?: number;
    hint?: string;
  }>(),
  { type: "text" },
);

const model = defineModel<string>({ required: true });
const id = useId();
const revealed = ref(false);
const isPassword = computed(() => props.type === "password");
</script>
