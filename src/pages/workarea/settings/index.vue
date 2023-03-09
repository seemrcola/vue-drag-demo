<script setup lang='ts'>
import { useViewStore } from '@/store/modules/view'
const viewStore = useViewStore()
</script>

<template>
  <div w-full h-full f-c-c>
    <div>
      <div>x:{{ viewStore.taregtSelect?.x }} </div>
      <div>y:{{ viewStore.taregtSelect?.y }} </div>
      <div>r:{{ viewStore.taregtSelect?.rotate }} </div>
    </div>
  </div>
</template>
