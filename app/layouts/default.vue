<template>
  <MotionConfig reduced-motion="user">
    <Cursor />
    <LayoutHeader />
    <slot />
    <LayoutFooter />
    <LayoutTabBar />
    <AccountDangerGoodbyeModal />
  </MotionConfig>
</template>

<script setup lang="ts">
import { MotionConfig } from "motion-v";
</script>
