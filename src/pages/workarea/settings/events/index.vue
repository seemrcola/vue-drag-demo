<script setup lang='ts'>
import { computed } from 'vue'
import { useEventStore } from '@/store/modules/index'
const eventStore = useEventStore()
const events = computed(() => eventStore.getEvent())

// 本来想在这个模块去操作一些组件暴露出来的事件，但是没有实现
</script>

<template>
  <div
    w-full overflow-hidden
    bg="#333" color="#fff" text="12px"
    b-b="1px solid #000"
  >
    <div bg="#000" f-c-c color="#fff" h-8>
      <strong>组件事件</strong>
    </div>
    <div>
      <div
        v-for="(e, index) of events" :key="index"
        flex text="1rem"
      >
        <div w-30>
          DEFAULT
        </div>
        <button flex-1>
          TODO
        </button>
      </div>
    </div>
  </div>
</template>
