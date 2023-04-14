<script setup lang='ts'>
import Label from './label.vue'
import { useCoordStore, useRulerStore, useViewStore } from '@/store/modules'
const viewStore = useViewStore()
const coordStore = useCoordStore()
const rulerStore = useRulerStore()
</script>

<template>
  <div
    w-full overflow-hidden
    bg="#222" color="#fff" text="12px"
    b-b="1px solid #000"
  >
    <div bg="#000" f-c-c color="#fff" h-8>
      <strong>组件基本属性</strong>
    </div>
    <div v-show="viewStore.taregtSelect.length === 1">
      <div flex my-4>
        <Label text="X轴" :value="~~coordStore.showDataTarget.x" />
        <Label text="Y轴" :value="~~coordStore.showDataTarget.y" />
      </div>
      <div flex my-4>
        <Label text="宽度" :value="~~coordStore.showDataTarget.width" />
        <Label text="高度" :value="~~coordStore.showDataTarget.height" />
      </div>
      <div flex my-4>
        <Label text="角度" :value="~~coordStore.showDataTarget.rotate" />
        <Label text="缩放" :value="rulerStore.rulerOptions.scale" />
      </div>
    </div>
    <div v-show="viewStore.taregtSelect.length !== 1">
      <div flex my-4>
        <Label text="X轴" value="N" />
        <Label text="Y轴" value="N" />
      </div>
      <div flex my-4>
        <Label text="宽度" value="N" />
        <Label text="高度" value="N" />
      </div>
      <div flex my-4>
        <Label text="角度" value="N" />
        <Label text="缩放" :value="rulerStore.rulerOptions.scale" />
      </div>
    </div>
  </div>
</template>
