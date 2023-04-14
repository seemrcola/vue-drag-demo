<script setup lang='ts'>
import { ref } from 'vue'
import Coord from './coord/index.vue'
import Layer from './layer/index.vue'
const toggle = ref('component')

function toggleChange(status: string) {
  toggle.value = status
}
</script>

<template>
  <div
    w-full h-full overflow-hidden text="12px"
    border="1px solid #fff" color="#fff" bg="#222"
  >
    <div flex text="0.9rem">
      <div
        flex-1 py-1 class="title"
        :class="{ 'title-active': toggle === 'component' }"
        @click="toggleChange('component')"
      >
        组件
      </div>
      <div
        flex-1 py-1 class="title"
        :class="{ 'title-active': toggle === 'canvas' }"
        @click="toggleChange('canvas')"
      >
        画布
      </div>
    </div>
    <div v-if="toggle === 'component'">
      <Coord />
    </div>
    <div v-if="toggle === 'canvas'">
      <Layer />
    </div>
  </div>
</template>

<style lang="scss">
.title {
  transition: all .4s;
  &:hover {
    cursor: pointer;
    background-color: aliceblue;
    color: #333;
  }

}
.title-active {
  background-color: aliceblue;
  color: #333;
}
</style>
