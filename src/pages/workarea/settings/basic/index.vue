<script setup lang='ts'>
import { useRulerStore, useSettingStore } from '@/store/modules'
const settingStore = useSettingStore()
const rulerStore = useRulerStore()
</script>

<template>
  <div
    w-full overflow-hidden
    bg="#333" color="#fff" text="12px"
    b-b="1px solid #000"
  >
    <div bg="#000" f-c-c color="#fff" h-8>
      <strong>组件基本属性</strong>
    </div>
    <div>
      <div flex my-4>
        <label for="" flex-1 f-c-c>
          <div w-8 mr-2>横轴</div>
          <input
            readonly input w-24
            :value="~~settingStore.showDataTarget.x!"
          >
        </label>
        <label for="" flex-1 f-c-c>
          <div w-8 mr-2>纵轴</div>
          <input
            readonly input w-24
            :value="~~settingStore.showDataTarget.y!"
          >
        </label>
      </div>
      <div flex my-4>
        <label for="" flex-1 f-c-c>
          <div w-8 mr-2>宽度</div>
          <input
            readonly input w-24
            :value="~~settingStore.showDataTarget.width!"
          >
        </label>
        <label for="" flex-1 f-c-c>
          <div w-8 mr-2>高度</div>
          <input
            readonly input w-24
            :value="~~settingStore.showDataTarget.height!"
          >
        </label>
      </div>
      <div flex my-4>
        <label for="" flex-1 f-c-c>
          <div w-8 mr-2>旋转</div>
          <input readonly input w-24 :value="~~settingStore.showDataTarget.rotate!">
        </label>
        <label for="" flex-1 f-c-c>
          <div w-8 mr-2>画布</div>
          <input readonly input w-24 :value="rulerStore.rulerOptions.scale">
        </label>
      </div>
    </div>
    <!-- <input w="95%" m-auto h-10 type="text"> -->
  </div>
</template>
