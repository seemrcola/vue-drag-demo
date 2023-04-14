<script setup lang='ts'>
import { computed } from 'vue'
import { useViewStore } from '@/store/modules'
import type { IComponent } from '@/store/types/view'
const viewStore = useViewStore()
const components = computed(() => viewStore.components)

function getUrl({ thumbnail }: IComponent) {
  return new URL(`../../../../${thumbnail}`, import.meta.url).href
}
</script>

<template>
  <div
    h="500px" max-h="500px" overflow-auto
    class="no-scroll-bar"
  >
    <div
      v-for="(component, index) of components" :key="index"
      flex items-center
      bg="#555" b-b="1px solid #fff"
    >
      <img :src="getUrl(component)" h-6 w-6 mx-4>
      <p> {{ component.name.toLocaleUpperCase() }}</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  ::-webkit-scrollbar {
    width: 0px; /* 宽度设置为0，隐藏滚动条 */
    background-color: transparent; /* 滚动条背景色 */
  }
  /* 特定于火狐浏览器的样式 */
  mozilla::-moz-scrollbar {
    width: 0px;
    background-color: transparent;
  }
  mozilla::-moz-scrollbar-thumb {
    display: none; /* 隐藏火狐滚动条的thumb部分 */
  }
</style>
