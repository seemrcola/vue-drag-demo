<script setup lang='ts'>
import { reactive, ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { componentsConfig } from './comp.config'
import { compType } from '@/enum/materiel.enum'
import type { ImgGlobResult } from '@/utils/glob'
import { imgGlob } from '@/utils/index'
import { useRulerStore, useViewStore } from '@/store/modules/index'

const viewStore = useViewStore()
const rulerStore = useRulerStore()

const toysModules = imgGlob(compType.TOYS)
const shapeModules = imgGlob(compType.SHAPE)
const mediaModules = imgGlob(compType.MEDIA)
const chartModules = imgGlob(compType.CHART)

interface Icon {
  icon: string
  text: string
  type: compType
  imgList: ImgGlobResult[]
}
const icons = reactive<Icon[]>([
  { icon: 'i-icon-park-solid:game', text: '玩具', type: compType.TOYS, imgList: toysModules },
  { icon: 'i-simple-icons:soundcharts', text: '图表', type: compType.CHART, imgList: chartModules },
  { icon: 'i-ic:twotone-media-bluetooth-on', text: '媒体', type: compType.MEDIA, imgList: mediaModules },
  { icon: 'i-carbon:shape-intersect', text: '形状', type: compType.SHAPE, imgList: shapeModules },
])

/** ****** 鼠标移入显示类型 *********/
const curIcon: Icon = icons[0]
/*********************************/
/** ********* 初始化显示 **********/
const checkArr = ref<boolean[]>([true, false, false, false])
const curImgList = ref<ImgGlobResult[]>(icons[0].imgList)
/*********************************/

/* *** 鼠标点击icon右侧显示缩略图 ***/
function linkPreviewImg(icon: Icon, idx: number) {
  checkArr.value = [false, false, false, false]
  checkArr.value[idx] = true
  curImgList.value = icon.imgList
}
/********************************/

/** raydata拖拽方案 *******************************************/
const imgsrc = ref<ImgGlobResult>()
let dragDom: HTMLElement | null = null
function changeImgSrc(imgSrc: ImgGlobResult, e: MouseEvent) {
  // 图片src赋值确保拖出来的图片正确
  imgsrc.value = imgSrc
  // 靠名字找到组件的config信息 也可以根据index找 但是index有局限 config文件就必须按顺序来写组件
  const compnentConfig = componentsConfig[curIcon.type]
    .find(comp => comp.component.includes(imgsrc.value!.name))!
  const { height, width } = compnentConfig
  generateImgDom(e, height, width)
}
function generateImgDom(e: MouseEvent, height: number, width: number) {
  const { rulerOptions: { scale } } = useRulerStore()
  const clone = (e.target as HTMLElement).cloneNode() as HTMLElement
  document.querySelector('body')?.append(clone)
  requestAnimationFrame(() => {
    clone.style.cssText // 定位到一个远一点的地方
    += `
      height: ${height * scale}px;
      width: ${width * scale}px;
      border: 1px solid #000;
      position: absolute; 
      left: -99999px;
      top: -99999px;
    `
    dragDom = clone // 赋值
    setTimeout(() => clone.remove(), 1000) // remove元素
  })
}
function dragHandle(e: DragEvent) {
  // cloneNode 和 new Image 出来的图片都无法处理宽高，只能先这样
  const { dataTransfer } = e
  const target = dragDom!
  // *******************************************************************
  // ** !!这里做个解释 [这是貌似是一个mac专属bug]
  // ** 当drag操作自定义拖动图片，并且改变了dataTransfer!.setDragImage(img, x, y)
  // ** 此时当drag操作结束时，dragend获取clientX喝clientY都会受到这个x和y的影响
  // ** 把dragend绑定在document上就不会有这个问题
  // ** 但是dragend绑定在和dragstart一样的元素上时就会造成clientX和clientY的偏移
  // ** fix: 但是为了记录这个操作，我决定在window上加个属性来打补丁，以提醒自己这个知识点。
  //* ******************************************************************
  const os = window.$OS
  window.$fixClientX = 0
  window.$fixClientY = 0
  const w = parseInt(target.style.width) / 2
  const h = parseInt(target.style.height) / 2
  if (os === 'MAC') {
    window.$fixClientX = w
    window.$fixClientY = h
  }
  dataTransfer!.setDragImage(target, w, h)
}
/**************************************************************************/

/** ***************** 拖拽结束时组件放入画布 ***********************/
function imgDragEnd(e: DragEvent) {
  const { left, top } = document.querySelector('#canvas')!.getBoundingClientRect()
  // 靠名字找到组件的config信息
  const compnentConfig = componentsConfig[curIcon.type]
    .find(comp => comp.component.includes(imgsrc.value!.name))!
  // 计算坐标点
  const { clientX, clientY } = e
  const scale = rulerStore.rulerOptions.scale
  const { width, height } = compnentConfig
  const x = (clientX - left - window.$fixClientX) / scale - (width / 2)
  const y = (clientY - top + window.$fixClientY) / scale - (height / 2)
  // 进入画布则收集该组件信息
  if (
    (clientX - window.$fixClientX) > left
    && (clientY + window.$fixClientY) > top
  ) {
    const targetComponent = {
      ...compnentConfig,
      id: `wrapper${uuidv4().split('-')[0]}`,
      scale: [1, 1] as [number, number], // 因为我引入的是同一个组件，共享同一个模板数据，所以引用类型的数据要注意，需要覆盖一下
      x,
      y,
    }
    viewStore.addComponent(targetComponent)
  }
}
/*******************************************************************/
</script>

<template>
  <div wh-full bg="#222">
    <div
      flex px-1 items-center
      w-full h="40px" leading="40px"
      border="#fff 1px solid" color="#fff"
    >
      <strong text="0.9rem">组件列表</strong>
    </div>

    <div flex w-full h="[calc(100%-40px)]" relative>
      <div
        class="icons"
        flex flex-col items-center
        w="40px" h-full b
        py-2 border="#fff 1px solid"
      >
        <div
          v-for="(item, idx) in icons"
          :key="idx" :class="{ click: checkArr[idx] }"
          mb-2 rounded-1
          @click="linkPreviewImg(item, idx)"
        >
          <div h-6 w-6 color="#fff" :class="item.icon" />
        </div>
      </div>

      <div
        w="[calc(100%-40px)]"
        border="#fff 1px solid" px-2
      >
        <div
          v-for="(item, idx) in curImgList" :key="idx"
          f-c-c p-1 my-2 b="1px #fff solid" rounded-1 relative
        >
          <img
            :src="item.img"
            h-24 w-full rounded-1 cursor-move object-contain bg="#fff"
            @dragstart="dragHandle"
            @dragend="imgDragEnd($event)"
            @mousedown.stop="changeImgSrc(item, $event)"
          >
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.icons {
  .click {
    background-color: #fff;
      border-radius: 0.5rem;
      > div {
        color: #000
      }
  }
  > div {
    height: 40px;
    width: 90%;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all .8s;
    cursor: pointer;
    &:hover {
      @extend .click
    }
  }
}
</style>
