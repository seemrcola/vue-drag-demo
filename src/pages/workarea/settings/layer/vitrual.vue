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
  <div>
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
