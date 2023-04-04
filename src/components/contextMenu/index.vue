<script setup lang='ts'>
import type { KeyCodeEnum } from '@/enum/keyboard.enum'
interface Operate {
  text: string
  type: KeyCodeEnum
}
const props = defineProps<{
  list: Array<Operate>
}>()
const emits = defineEmits<{
  (e: 'dispatch', type: KeyCodeEnum): void
}>()

function operate(type: KeyCodeEnum) {
  emits('dispatch', type)
}
</script>

<template>
  <div py-2 b="1px solid #444" rounded-2 bg="#fff" color="#666">
    <div
      v-for="(item, index) of props.list" :key="index"
      h-8 w-30 f-c-c text-sm cursor-pointer
      class="item"
      @click="operate(item.type)"
    >
      <span>{{ item.text }}</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.item {
  transition: all .3s;
  &:hover {
    background-color: aliceblue;
    color: #000
  }
}
</style>
