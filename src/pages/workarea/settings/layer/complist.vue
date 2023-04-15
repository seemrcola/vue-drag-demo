<script setup lang='ts'>
import { computed, onMounted } from 'vue'
import { useViewStore } from '@/store/modules'
import type { IComponent } from '@/store/types/view'
import { useVitrualList } from '@/hooks/useVitrualList'

const viewStore = useViewStore()
const components = computed(() => viewStore.components)
const { generateObserver, onObserve } = useVitrualList('.list-item', components.value)

function getUrl({ thumbnail }: IComponent) {
  return new URL(`../../../../${thumbnail}`, import.meta.url).href
}

onMounted(() => {
  generateObserver()
  onObserve()
})
</script>

<template>
  <div
    h="500px" max-h="500px" overflow-auto
    relative
    class="no-scroll-bar vitural"
  >
    <div
      w-full z--1 absolute bg="#fff"
      :style="{ height: `${components.length * 36}px` }"
    />
    <div
      v-for="(component, index) of components"
      :key="index"
      class=".list-item"
      :data-index="index"
      flex items-center h="36px"
      bg="#555" b-b="1px solid #fff"
    >
      <img :src="getUrl(component)" h-6 w-6 mx-4>
      <p> {{ component.name.toLocaleUpperCase() }}</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
    /* 修改滚动条的颜色 */
    ::-webkit-scrollbar {
      width: 6px;
      background-color: #eee;
    }
    ::-webkit-scrollbar-thumb {
      width: 6px;
      background-color: rgb(245, 202, 150);
    }
    ::-webkit-scrollbar-thumb:hover {
      background-color: rgb(230, 162, 78);
    }
</style>
