<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref } from 'vue'
import { SketchRule } from 'vue3-sketch-ruler'
import { useRulerStore } from '@/store/modules/index'

/* useDrag */
import { useDrag } from '@/hooks/useDrag'

/* 拿到rulerStore的配置 */
const rulerStore = useRulerStore()
const state = rulerStore.rulerOptions
const canvasStyle = rulerStore.canvasStyle

const { dragStart, getDerta } = useDrag()

/* dom ref */
const wrapperRef = ref<null | HTMLElement>()
const screensRef = ref<null | HTMLElement>()
const containerRef = ref<null | HTMLElement>()
const canvasRef = ref<null | HTMLElement>()

// 滚动监听
const handleScroll = () => {
  const screensRect = screensRef.value!.getBoundingClientRect()
  const canvasRect = canvasRef.value!.getBoundingClientRect()
  // 标尺开始的刻度
  const startX = (screensRect.left + state.thick - canvasRect.left) / state.scale
  const startY = (screensRect.top + state.thick - canvasRect.top) / state.scale
  rulerStore.setStart(startX, startY)
}

// 缩放监听
const handleWheel = (
  e: {
    ctrlKey: any
    metaKey: any
    preventDefault: () => void
    deltaY: number
  }) => {
  if (e.ctrlKey || e.metaKey) {
    e.preventDefault()
    const nextScale = parseFloat(Math.max(0.2, state.scale - e.deltaY / 500).toFixed(2))
    rulerStore.setScale(nextScale)
  }
  nextTick(() => handleScroll())
}

// 尺子宽高初始化
function rulerInit() {
  const workarea = document.querySelector('.wrapper')
  const workareaRect = workarea!.getBoundingClientRect()
  // 背景板大小处理
  containerRef.value!.style.height = `${workareaRect.height * 2}px`
  containerRef.value!.style.width = `${workareaRect.width * 2}px`
  // 尺子大小处理
  rulerStore.setRulerSize(workareaRect)
}

// 视野容器盒子初始化
function screenInit() {
  // 滚动居中
  screensRef.value!.scrollLeft
    = containerRef.value!.getBoundingClientRect().width / 2 - state.width / 2
  screensRef.value!.scrollTop
    = containerRef.value!.getBoundingClientRect().height / 2 - state.height / 2
}

// canvas初始化
function canvasInit() {
  const workarea = document.querySelector('.wrapper')
  const workareaRect = workarea!.getBoundingClientRect()
  // 由于尺子有厚度，所以canvas要多给个厚度边距
  canvasRef.value!.style.left = `${state.thick + workareaRect.width / 2}px`
  canvasRef.value!.style.top = `${state.thick + workareaRect.height / 2}px`
}

// 事件绑定初始化
const handleSrcollBar = () => {
  const { isChanged, dertaX, dertaY } = getDerta()
  console.log(dertaX, dertaY, isChanged)
  if (isChanged) {
    screensRef.value!.scrollLeft -= dertaX
    screensRef.value!.scrollTop -= dertaY
  }
}

function eventInit() {
  window.addEventListener('mousemove', handleSrcollBar)
}

onMounted(() => {
  rulerInit()
  screenInit()
  canvasInit()
  eventInit()
})

onUnmounted(() => {
  window.removeEventListener('mousemove', handleSrcollBar)
})
</script>

<template>
  <!-- 最外层的包裹容器 -->
  <div ref="wrapperRef" class="wrapper">
    <!-- 标尺容器 -->
    <SketchRule
      :thick="state.thick"
      :scale="state.scale"
      :width="state.width"
      :height="state.height"
      :start-x="state.startX"
      :start-y="state.startY"
      :palette="state.palette"
      :is-show-refer-line="state.isShowReferLine"
    />
    <!-- 和标尺容器同级，一个定位容器，用于限制可视区域 -->
    <div
      ref="screensRef"
      absolute w="100%" h="100%"
      overflow-auto
      @wheel="handleWheel"
      @scroll="handleScroll"
    >
      <!-- 一个宽高很大的容器，作为背景板 -->
      <div ref="containerRef" absolute>
        <!-- 画布 -->
        <div
          id="canvas"
          ref="canvasRef"
          :style="canvasStyle"
          absolute bg="#fff"
          @mousedown="dragStart"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.wrapper {
  position: relative;
  /*
   * 特别注意,这个width要和传入组件的width成对应关系,
   * 也就是 580width +thick20 = 600
   * 不过我这里就直接给100%了
   */
  width: 100%;
  height: 100%;
  background-color: #333;
  border: 1px solid #dadadc;
}
</style>
