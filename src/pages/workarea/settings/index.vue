<script setup lang='ts'>
import { useViewStore } from '@/store/modules/view'
const viewStore = (useViewStore())
</script>

<template>
  <div w-full h-full overflow-hidden bg="#333" color="#fff" text="12px">
    <div>
      <div flex my-4>
        <label for="" flex-1 f-c-c>
          <div w-8 mr-2>横轴</div>
          <input
            readonly input w-24
            :value="~~viewStore.showDataTarget.x!"
          >
        </label>
        <label for="" flex-1 f-c-c>
          <div w-8 mr-2>纵轴</div>
          <input
            readonly input w-24
            :value="~~viewStore.showDataTarget.y!"
          >
        </label>
      </div>
      <div flex my-4>
        <label for="" flex-1 f-c-c>
          <div w-8 mr-2>宽度</div>
          <input
            readonly input w-24
            :value="~~viewStore.showDataTarget.width!"
          >
        </label>
        <label for="" flex-1 f-c-c>
          <div w-8 mr-2>高度</div>
          <input
            readonly input w-24
            :value="~~viewStore.showDataTarget.height!"
          >
        </label>
      </div>
      <div flex my-4>
        <label for="" flex-1 f-c-c>
          <div w-8 mr-2>旋转</div>
          <input readonly input w-24 :value="~~viewStore.showDataTarget.rotate!">
        </label>
        <label for="" flex-1>
          <div />
        </label>
      </div>
    </div>
  </div>
</template>
