<script setup lang='ts'>
interface Operate {
  text: string
  type: string
}

const props = defineProps<{
  list: Array<Operate>
}>()

const emits = defineEmits<{
  (e: 'dispatch', type: string): void
}>()

function operate(type: string) {
  emits('dispatch', type)
}
</script>

<template>
  <div
    py-2
    b="1px solid #ccc" rounded-2 bg="#fff" color="#666"
  >
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
