<script setup lang='ts'>
import { onMounted } from 'vue'
import Header from './header/index.vue'
import Content from './content/index.vue'
import Materiel from './materiel/index.vue'
import Settings from './settings/index.vue'

import { getInstances } from './materiel/comp.index'
onMounted(() => {
  console.log(getInstances())
  const constructors = getInstances()
  setTimeout(() => {
    constructors.forEach(
      constructor => constructor.setup(),
    )
  }, 3000)
})
</script>

<template>
  <div wh-full>
    <div h="32px" w-full>
      <Header />
    </div>
    <div w-full h="[calc(100vh-32px)]" flex>
      <div h-full w="240px">
        <Materiel />
      </div>
      <div h-full flex-1>
        <Content />
      </div>
      <div h-full w="300px">
        <Settings />
      </div>
    </div>
  </div>
</template>
