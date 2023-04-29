<script setup lang='ts'>
import { basicConfig } from './comp.config'
</script>

<template>
  <div
    :style="{
      height: `${basicConfig.height}px`,
      width: `${basicConfig.width}px`,
    }"
  >
    <slot />
  </div>
</template>
