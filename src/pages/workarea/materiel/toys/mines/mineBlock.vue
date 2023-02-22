<script setup lang='ts'>
import { reactive } from 'vue'
import type { BlockState } from './types'
const props = defineProps<{
  block: BlockState
}>()
const emit = defineEmits<{
  (e: 'blockClick', payload: BlockState): void
  (e: 'rightClick', payload: BlockState): void
}>()

function blockClick(payload: BlockState) {
  emit('blockClick', payload)
}
function rightClick(payload: BlockState) {
  emit('rightClick', payload)
}

const color = reactive([
  'text-green-400',
  'text-blue-400',
  'text-yellow-400',
  'text-red-400',
  'text-orange-600',
  'text-red-500',
  'text-red-600',
])
function getColor(block: BlockState) {
  if (!block.revealed)
    return 'bg-gray/10'

  return block.mine
    ? 'bg-red-500'
    : color[block.adjacentMines]
}
</script>

<template>
  <button
    :class="getColor(props.block)" h-8 w-8 b f-c-c m="1px" @click="blockClick(props.block)"
    @contextmenu.prevent="rightClick(props.block)"
  >
    <template v-if="props.block.revealed">
      <div v-if="props.block.mine">
        <div i-game-icons:bolt-bomb />
      </div>
      <div v-else>
        {{ props.block.adjacentMines }}
      </div>
    </template>
    <template v-else-if="!props.block.revealed && props.block.flag">
      <div text-red-5 i-fontisto:flag />
    </template>
  </button>
</template>
