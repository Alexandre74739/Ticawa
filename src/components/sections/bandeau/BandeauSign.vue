<template>
  <g>
    <rect
      x="190.563"
      y="185.131"
      width="16"
      height="249.184"
      rx="8"
      transform="rotate(-7.245 190.563 185.131)"
      class="fill-indigo"
    />
    <path :d="signBoard" class="fill-indigo" />
    <rect
      x="70.18"
      y="147.647"
      width="240"
      height="5.306"
      rx="2.653"
      transform="rotate(-7.245 70.18 147.647)"
      class="fill-paper/50"
    />
    <text
      x="186"
      y="105"
      font-size="46"
      font-weight="800"
      text-anchor="middle"
      dominant-baseline="central"
      transform="rotate(-7.245 186 105)"
      class="fill-paper font-display"
    >
      VOS DROITS
    </text>
  </g>
</template>

<script setup lang="ts">
import { signBoard } from "~/data/race";
</script>
