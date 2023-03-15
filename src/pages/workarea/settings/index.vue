<script setup lang='ts'>
import { watch } from 'vue'
import { useViewStore } from '@/store/modules/view'
const viewStore = (useViewStore())
watch(
  () => viewStore.taregtSelect,
  n => console.log(100),
)
</script>

<template>
  <div w-full h-full f-c-c>
    <div>
      <div>x: {{ viewStore.showDataTarget?.x }} </div>
      <div>y: {{ viewStore.showDataTarget?.y }} </div>
      <div>rotate: {{ viewStore.showDataTarget?.rotate }} </div>
      <div>scaleX: {{ viewStore.showDataTarget?.scaleX }} </div>
      <div>scaleY: {{ viewStore.showDataTarget?.scaleY }} </div>
    </div>
  </div>
</template>
