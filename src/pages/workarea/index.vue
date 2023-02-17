<script setup lang='ts'>
import Content from './content/index.vue'
import Materiel from './materiel/index.vue'
</script>

<template>
  <div wh-full flex>
    <div h-full w="240px">
      <Materiel />
    </div>
    <div h-full flex-1 bc-fdd>
      <Content />
    </div>
    <div h-full w="300px" />
  </div>
</template>
