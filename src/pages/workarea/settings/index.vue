<script setup lang='ts'>
import Basic from './basic/index.vue'
import Event from './events/index.vue'
</script>

<template>
  <div
    w-full h-full overflow-hidden text="12px"
    border="1px solid #fff" color="#fff" bg="#333"
  >
    <Basic />
    <Event />
  </div>
</template>
