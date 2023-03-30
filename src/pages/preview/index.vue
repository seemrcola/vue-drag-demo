<script setup lang='ts'>
import { onMounted, ref } from 'vue'
import { useRulerStore, useViewStore } from '@/store/modules'
const viewStore = useViewStore()
const rulerStore = useRulerStore()
const scale = ref(1)
const skewingX = ref(0)
const skewingY = ref(0)

onMounted(() => handleFilled())

function handleFilled() {
  // 算出document的宽高比
  const vw = document.documentElement.clientWidth
  const vh = document.documentElement.clientHeight
  const ratio = vw / vh
  // 算出view的宽高比
  const viewRatio = rulerStore.canvasOptions.width / rulerStore.canvasOptions.height
  // 如果document宽高比小于view的宽高比
  if (ratio < viewRatio)
    scale.value = vw / rulerStore.canvasOptions.width
  else
    scale.value = vh / rulerStore.canvasOptions.height

  const deltaH = (vh - (rulerStore.canvasOptions.height * scale.value)) / 2
  skewingY.value = deltaH
  const deltaW = (vw - (rulerStore.canvasOptions.width * scale.value)) / 2
  skewingX.value = deltaW
}

window.addEventListener('resize', handleFilled)
</script>

<template>
  <div bg="#000" wh-full relative>
    <div
      :style="{
        height: `${rulerStore.canvasOptions.height}px`,
        width: `${rulerStore.canvasOptions.width}px`,
        position: 'absolute',
        overflow: 'hidden',
        backgroundColor: '#eee',
        transformOrigin: 'top left',
        transform: `scale(${scale})`,
        margin: `${skewingY}px  ${skewingX}px ${skewingY}px ${skewingX}px`,
      }"
    >
      <template v-for="componentItem in viewStore.components" :key="componentItem.id">
        <component
          :is="componentItem.component"
          :id="componentItem.id"
          :style="{ ...viewStore.setComponentStyle(componentItem) }"
          :class="{
            component: !viewStore.taregtSelect.find(comp => comp.id === componentItem.id),
            selecto: componentItem.selecto,
            lock: componentItem.lock,
          }"
        />
      </template>
    </div>
  </div>
</template>
