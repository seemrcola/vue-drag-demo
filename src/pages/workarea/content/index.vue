<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref } from 'vue'
import { SketchRule } from 'vue3-sketch-ruler'
import Moveable from 'vue3-moveable'
import { useRulerStore, useViewStore } from '@/store/modules/index'

/* useDrag */
import { useDrag } from '@/hooks/useDrag'
/* useMoveable */
import { useMoveable } from '@/hooks/useMoveable'

const viewStore = useViewStore()

/* 拿到rulerStore的配置 */
const rulerStore = useRulerStore()
const state = rulerStore.rulerOptions
const canvasStyle = rulerStore.canvasStyle

const { handleMouseDown, getDerta } = useDrag()

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
    const nextScale = parseFloat(
      Math.max(0.2, state.scale - e.deltaY / 500).toFixed(2),
    )
    rulerStore.setScale(nextScale)
  }
  nextTick(() => handleScroll())
}

// 尺子宽高初始化
function rulerInit() {
  const workareaRect = screensRef.value!.getBoundingClientRect()
  // 尺子大小设置
  rulerStore.setRulerSize(workareaRect)
}

// 窗口缩放监听----------------------------------------
function windowResizeHandle() {
  console.log('resize')
  rulerInit()
}
// --------------------------------------------------

function containerInit() {
  const canvasRect = canvasRef.value!.getBoundingClientRect()
  // 背景板大小处理, canvas两倍大小
  containerRef.value!.style.height = `${canvasRect.height * 2}px`
  containerRef.value!.style.width = `${canvasRect.width * 2}px`
}

// 视野容器盒子初始化
function screenInit() {
  // 滚动居中, 由于containerRef的值是动态赋值的，所以这里nextTick一下
  nextTick(() => {
    const { height: containerHeight, width: containerWidth } = containerRef.value!.getBoundingClientRect()
    const { clientHeight, clientWidth } = canvasRef.value!
    screensRef.value!.scrollLeft = (containerWidth / 2 - clientWidth / 2)
    screensRef.value!.scrollTop = (containerHeight / 2 - clientHeight / 2)
  })
}

// canvas初始化
function canvasInit() {
  // 由于尺子有厚度，所以canvas要多给个厚度边距
  nextTick(() => {
    const { clientHeight, clientWidth } = canvasRef.value!
    // clientHeight, clientWidth是可视宽高
    // console.log(clientHeight, clientWidth)
    canvasRef.value!.style.marginLeft = `${state.thick + clientWidth / 2}px`
    canvasRef.value!.style.marginTop = `${state.thick + clientHeight / 2}px`
  })
}

// 事件绑定初始化
const handleSrcollBar = () => {
  const { isChanged, dertaX, dertaY } = getDerta()
  if (!isChanged)
    return
  screensRef.value!.scrollLeft -= dertaX
  screensRef.value!.scrollTop -= dertaY
}

function eventInit() {
  document.addEventListener('mousemove', handleSrcollBar)
}

// moveable------------------------------------------------
const {
  onDrag,
  onRotate,
  onScale,
  selectComponent,
  selectTarget,
  dropComponent,
}
= useMoveable()
document.addEventListener('click', dropComponent)
console.log(selectTarget, 'xcxcxcxcxxcxcxc')
// --------------------------------------------------------

onMounted(() => {
  rulerInit() // 初始化尺子，尺子的宽高和screen可视容器px像素对应，先获取宽高再赋值给尺子
  screenInit() // 可视区域初始化，让滚动条滚到中间
  containerInit() // 背景初始化
  canvasInit() // 画布初始化
  eventInit() // 事件初始化，监听鼠标移动事件
  window.addEventListener('resize', windowResizeHandle) // 监听窗口变化
})

onUnmounted(() => {
  document.removeEventListener('mousemove', handleSrcollBar)
  window.removeEventListener('resize', windowResizeHandle) // 监听窗口变化
})
</script>

<template>
  <div>{{ selectTarget }}</div>
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
      id="screen"
      ref="screensRef"
      absolute w="100%" h="100%"
      overflow-auto
      @wheel="handleWheel"
      @scroll="handleScroll"
      @mousedown="handleMouseDown"
    >
      <!-- 一个宽高很大的容器，作为背景板 -->
      <div ref="containerRef">
        <!-- 画布 -->
        <div
          id="canvas"
          ref="canvasRef"
          :style="canvasStyle"
          absolute bg="#ccc" rounded-2
          @mousedown="handleMouseDown"
          @dragover="e => e.preventDefault()"
        >
          <Moveable
            :target="selectTarget"
            :draggable="true"
            :scalable="true"
            :rotatable="true"
            @drag="onDrag"
            @scale="onScale"
            @rotate="onRotate"
          />
          <!-- <div id="test1" w-50 h-50 />
          <div id="test2" w-50 h-50 /> -->
          <component
            :is="componentItem.component.component"
            v-for="componentItem in viewStore.components"
            :id="componentItem.id"
            :key="componentItem.name"
            :style="{
              ...viewStore.setComponentStyle(componentItem),
            }"
            class="component"
            @click.stop="selectComponent(componentItem)"
          />
        </div>
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
.component {
  &:hover {
    box-shadow: 0px 0px 2px 2px #4af;
  }
}
</style>
