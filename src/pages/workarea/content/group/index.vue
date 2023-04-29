<script setup lang='ts'>
import { useViewStore } from '@/store/modules/index'
import type { IComponent } from '@/store/types/view'
const props = defineProps<{
  group: IComponent[]
}>()
const viewStore = useViewStore()
</script>

<template>
  <div>
    <component
      :is="item.component" v-for="(item) of props.group" :key="item.id"
      :style="{
        ...viewStore.setComponentStyle(item),
      }"
    />
  </div>
</template>
