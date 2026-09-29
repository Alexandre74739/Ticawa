<template>
  <div
    class="flex flex-col items-center gap-4 rounded-3xl bg-lavender px-6 py-12 text-center"
  >
    <UiTicoMascot mascot="Neutre.svg" />
    <p class="font-display text-lg font-bold">Tico prépare cette page</p>
    <p class="max-w-sm text-ink/70"><slot /></p>
  </div>
</template>
