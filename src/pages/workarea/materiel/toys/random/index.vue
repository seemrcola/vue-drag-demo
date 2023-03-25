<script setup lang='ts'>
const random = Math.random().toFixed(8)
</script>

<template>
  <div
    h="200px" w="200px" bg="#eee" color="#000"
    f-c-c text-xl border="1px #fff solid"
  >
    {{ random }}
  </div>
</template>
