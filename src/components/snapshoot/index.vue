<script setup lang='ts'>
import { onMounted, ref } from 'vue'
import { useRulerStore, useViewStore } from '@/store/modules'

const emits = defineEmits(['close'])

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

function closeSnapshoot() {
  emits('close')
}

window.addEventListener('resize', handleFilled)
</script>

<template>
  <div bg="#000" class="overlay" wh-full relative z-99999>
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
        transition: 'all .3s',
        border: '2px solid #333',
      }"
    >
      <div
        h-8 w-8 cursor-pointer
        absolute right-4 top-4 color="#333"
        i-mdi:alpha-x-box
        @click="closeSnapshoot"
      />
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

<style lang="scss" scoped>
.overlay {
  &::before {
    content: 'snapshoot';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
    background-color: rgba(68, 170, 255, 0.4);
  }
}
</style>
