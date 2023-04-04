<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref } from 'vue'
import { SketchRule } from 'vue3-sketch-ruler'
import type { VueMoveableInstance } from 'vue3-moveable'
import Moveable from 'vue3-moveable'
import { useMoveable } from '../_hooks/useMoveable'
import { useEclipse } from '../_hooks/useEclipse'
import { useSeleto } from '../_hooks/useSelecto'
import { useRulerStore, useViewStore } from '@/store/modules/index'
import { useDrag } from '@/hooks/useDrag'
import type { IComponent } from '@/store/modules/view'

/* viewStore */
const viewStore = useViewStore()
/* Eclipse */
const { listener, setMoveableRef } = useEclipse()
/* Selecto */
const { selectoDown, setStyle } = useSeleto({ container: '#canvas' })
/* 拿到rulerStore的配置 */
const rulerStore = useRulerStore()
const state = rulerStore.rulerOptions
const canvasStyle = rulerStore.canvasStyle

/* drag */
const { handleMouseDown, getDerta } = useDrag()

/* dom ref */
const wrapperRef = ref<null | HTMLElement>()
const screensRef = ref<null | HTMLElement>()
const containerRef = ref<null | HTMLElement>()
const canvasRef = ref<null | HTMLElement>()
const selecto = ref<null | HTMLElement>()

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
      Math.max(0.2, state.scale - e.deltaY / 500).toFixed(5),
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
    const { clientHeight, clientWidth } = wrapperRef.value!
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
const moveable = ref<null | VueMoveableInstance>(null)
const {
  singleHandler,
  singleEndHandler,
  groupHandler,
  clickGroup,
  groupEndHandler,
  selectComponent,
  clearSelect,
  selectTarget,
  setMoveableRef: setVueMoveableRef,
}
= useMoveable()
// fixme 这部分特殊操作并没有想到好的方案，所以暂时放在了vue文件里，有点影响文件结构
// 实现按下即拖动，这个功能相当于对hooks的补充，就不写进hooks了
function MouseDownHandle(e: MouseEvent, comp: IComponent) {
  e.stopPropagation()
  selectComponent(comp)
  nextTick(() => {
    moveable.value!.dragStart(e)
  })
}
// 等比缩放
const keepRatio = ref(false)
function scaleHandle(e: any, type = '') {
  const { space } = window.$KeyboardActive
  keepRatio.value = space
  if (type)
    groupHandler(e, 'scale')
  else
    singleHandler(e, 'scale')
}
// 最外层wrapper的按下事件
function selectoDownHandler(e: MouseEvent) {
  // 判断是否点击在范围内
  const id = (e.target as HTMLElement).id
  if (id !== 'canvas' && id !== 'container')
    return
  selectoDown(e)
  clearSelect()
}
// fixme ---------------------------------------------------------------

onMounted(() => {
  rulerInit() // 初始化尺子，尺子的宽高和screen可视容器px像素对应，先获取宽高再赋值给尺子
  screenInit() // 可视区域初始化，让滚动条滚到中间
  containerInit() // 背景初始化
  canvasInit() // 画布初始化
  eventInit() // 事件初始化，监听鼠标移动事件
  window.addEventListener('resize', windowResizeHandle) // 监听窗口变化
  window.addEventListener('keydown', listener) // 鼠标按下监听
  setMoveableRef(moveable.value!)
  setVueMoveableRef(moveable.value!)
})

onUnmounted(() => {
  document.removeEventListener('mousemove', handleSrcollBar)
  window.removeEventListener('resize', windowResizeHandle) // 监听窗口变化
  canvasRef.value?.removeEventListener('keydown', listener)
})
</script>

<template>
  <!-- 最外层的包裹容器 -->
  <div
    id="wrapper" ref="wrapperRef" class="wrapper" relative
    @mousedown="selectoDownHandler"
  >
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
      <div id="container" ref="containerRef">
        <!-- 画布 -->
        <div
          id="canvas"
          ref="canvasRef"
          :style="canvasStyle"
          absolute bg="#ccc" rounded-2
          @mousedown="handleMouseDown"
          @dragover="e => e.preventDefault()"
        >
          <div id="selecto" ref="selecto" absolute :style="setStyle" />
          <Moveable
            ref="moveable"
            :target="selectTarget"
            :draggable="true"
            :scalable="true"
            :rotatable="true"
            :scrollable="true"
            :snappable="true"
            :keep-ratio="keepRatio"
            @scale="(e) => scaleHandle(e)"
            @scale-group="(e) => scaleHandle(e, 'group')"
            @drag="(e) => singleHandler(e, 'drag')"
            @rotate="(e) => singleHandler(e, 'rotate')"
            @drag-group="(e) => groupHandler(e, 'drag')"
            @rotate-group="(e) => groupHandler(e, 'rotate')"
            @drag-end="(e) => singleEndHandler(e, 'drag')"
            @rotate-end="(e) => singleEndHandler(e, 'rotate')"
            @scale-end="(e) => singleEndHandler(e, 'scale')"
            @drag-group-end="(e) => groupEndHandler(e, 'drag')"
            @rotate-group-end="(e) => groupEndHandler(e, 'rotate')"
            @scale-group-end="(e) => groupEndHandler(e, 'scale')"
            @click-group="clickGroup"
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
              @click.stop
              @mousedown="(e: MouseEvent) => MouseDownHandle(e, componentItem)"
            />
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.wrapper {
  position: relative;
  background: rgba($color: #000, $alpha: 0.9) ;
  background-image:
      linear-gradient(rgba(255,255,255,.3) 1px, transparent 0),
      linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 0),
      linear-gradient(white 1px, transparent 0),
      linear-gradient(90deg, white 1px, transparent 0);
  background-size: 15px 15px, 15px 15px, 75px 75px, 75px 75px;
  /*
   * 特别注意,这个width要和传入组件的width成对应关系,
   * 也就是 580width +thick20 = 600
   * 不过我这里就直接给100%了
   */
  width: 100%;
  height: 100%;
  border: 1px solid #dadadc;

  #canvas {
    background: rgba($color: #fff, $alpha: 1.0) ;
    background-image:
        linear-gradient(rgba(0,0,0,.1) 1px, transparent 0),
        linear-gradient(90deg, rgba(0,0,0,.1) 1px, transparent 0),
        linear-gradient(white 1px, transparent 0),
        linear-gradient(90deg, white 1px, transparent 0);
    background-size: 15px 15px, 15px 15px, 75px 75px, 75px 75px;
  }
}
.component {
  &:hover {
    box-shadow: 0px 0px 2px 2px rgb(68, 170, 255);
  }
  &:active {
    box-shadow: 0 0 0 0 ;
  }
}
.selecto {
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
    background-color: rgba(68, 170, 255, 0.1);
  }
}
.lock {
  cursor: not-allowed;
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
    background-color: rgba(241, 229, 123, 0.2);
  }
  &::after {
    content:'🔒';
    position: absolute;
    bottom: 0.3rem;
    right:0.3rem
  }
}
</style>
