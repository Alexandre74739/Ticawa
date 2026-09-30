<template>
  <div class="flex flex-col gap-3">
    <component
      :is="tile.camera ? 'button' : 'label'"
      v-for="tile in tiles"
      :key="tile.title"
      :type="tile.camera ? 'button' : undefined"
      class="flex w-full cursor-pointer items-center gap-4 rounded-3xl p-4 text-left transition-transform duration-300 focus-within:ring-2 focus-within:ring-indigo focus-within:ring-offset-2 focus-visible:outline-none active:scale-[0.98]"
      :class="tile.class"
      @click="tile.camera && (camera = true)"
    >
      <input
        v-if="!tile.camera"
        type="file"
        class="sr-only"
        accept="application/pdf,.pdf"
        @change="pick"
      />
      <span
        class="grid size-14 shrink-0 place-items-center rounded-2xl"
        :class="tile.icon"
      >
        <component :is="tile.is" aria-hidden="true" class="size-7" />
      </span>
      <span class="min-w-0 flex-1">
        <span class="block font-display text-lg leading-tight font-bold">{{
          tile.title
        }}</span>
        <span class="mt-0.5 block text-sm opacity-75">{{ tile.text }}</span>
      </span>
      <ChevronRight aria-hidden="true" class="size-5 shrink-0 opacity-60" />
    </component>

    <label
      class="mx-auto cursor-pointer rounded-xl px-3 py-2 text-sm font-medium text-indigo underline-offset-4 transition-colors focus-within:ring-2 focus-within:ring-indigo hover:bg-lavender hover:underline"
    >
      <input type="file" class="sr-only" accept="image/*" @change="pick" />
      ou choisir une photo déjà prise
    </label>

    <ScanCamera v-if="camera" @close="camera = false" @file="send" />
  </div>
</template>

<script setup lang="ts">
import { Camera, ChevronRight, FileText } from "@lucide/vue";

const emit = defineEmits<{ file: [file: File] }>();

const camera = ref(false);

const tiles = [
  {
    camera: true,
    title: "Photographier un ticket",
    text: "À plat, bien éclairé, en entier.",
    is: Camera,
    class: "bg-indigo text-paper shadow-lg shadow-indigo/30",
    icon: "bg-paper/15",
  },
  {
    camera: false,
    title: "Importer une facture PDF",
    text: "Reçue par mail ou téléchargée sur un site.",
    is: FileText,
    class: "bg-lavender text-ink",
    icon: "bg-paper text-indigo",
  },
];

function send(file: File) {
  camera.value = false;
  emit("file", file);
}

function pick(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  input.value = "";
  if (file) emit("file", file);
}
</script>
