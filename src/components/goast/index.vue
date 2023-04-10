<script setup lang='ts'>
import type { IComponent } from '@/store/types/view'

const props = defineProps<{
  component: IComponent
}>()
</script>

<template>
  <div>
    <component
      :is="props.component.component"
    />
  </div>
</template>
