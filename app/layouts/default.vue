<template>
  <MotionConfig reduced-motion="user">
    <Cursor />
    <LayoutHeader />

    <div class="pb-20 sm:pb-0">
      <slot />
    </div>
  </MotionConfig>
</template>

<script setup lang="ts">
import { MotionConfig } from "motion-v";
</script>
