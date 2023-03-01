<script setup lang='ts'>
import { reactive, ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { toysComponentsConfig } from './toys/comp.config'
import { compType } from '@/enum/materiel.enum'
import { imgGlob } from '@/utils/index'
import { useViewStore } from '@/store/modules/view'

const viewStore = useViewStore()

const toysModules = imgGlob(compType.TOYS)
const shapeModules = imgGlob(compType.SHAPE)
const mediaModules = imgGlob(compType.MEDIA)
const chartModules = imgGlob(compType.CHART)

interface Icon {
  icon: string
  text: string
  type: compType
}
const icons = reactive<Icon[]>([
  { icon: 'i-icon-park-solid:game', text: '玩具', type: compType.TOYS },
  { icon: 'i-simple-icons:soundcharts', text: '图表', type: compType.CHART },
  { icon: 'i-ic:twotone-media-bluetooth-on', text: '媒体', type: compType.MEDIA },
  { icon: 'i-carbon:shape-intersect', text: '形状', type: compType.SHAPE },
])

/** ****** 鼠标移入显示类型 *********/
const curIcon = ref<Icon | undefined>(undefined)
function overIcon(item: Icon) {
  curIcon.value = item
}
function leaveIcon() {
  curIcon.value = undefined
}
/*********************************/
/** ********* 初始化显示 **********/
const imgListMap = {
  shape: shapeModules,
  media: mediaModules,
  toys: toysModules,
  chart: chartModules,
}
const checkArr = ref<boolean[]>([true, false, false, false])
const curImgList = ref<string[]>(imgListMap.toys)
/*********************************/

/* *** 鼠标点击icon右侧显示缩略图 ***/
function linkPreviewImg(icon: Icon, idx: number) {
  checkArr.value = [false, false, false, false]
  checkArr.value[idx] = true
  curImgList.value = imgListMap[icon.type]
}
/********************************/

/** 鼠标始终在图片中心的拖拽方案*********/
const imgsrc = ref<string>('')
function changeImgSrc(imgSrc: string) {
  imgsrc.value = imgSrc
}
function dragHandle(e: DragEvent) {
  // cloneNode 和 new Image 出来的图片都无法处理宽高，只能先这样
  const { dataTransfer } = e
  const target = e.target as HTMLImageElement
  dataTransfer!.setDragImage(target, target.width / 2, target.height / 2)
}
/********************************/

/** * 拖拽结束时组件放入画布 *******/
function imgDragEnd(e: DragEvent, idx: number) {
  console.log(e, 'xxxxxx')
  // 判断一下是否进入画布内
  const screen = document.getElementById('screen')
  const screenRect = screen!.getBoundingClientRect()
  const { clientX, clientY } = e
  if (clientX > screenRect.left && clientY > screenRect.top) {
    // 进入画布则收集该组件信息
    const targetComponent = { ...toysComponentsConfig[idx], id: uuidv4() }
    viewStore.addComponent(targetComponent)
  }
}
/*******************************/
</script>

<template>
  <div wh-full bg="#333">
    <div
      flex px-1 items-center
      w-full h="40px" leading="40px"
      border="#fff 1px solid" color="#fff"
    >
      <div
        border="#fff 1px solid"
        f-c-c w-16 h="80%" rounded-1
      >
        {{ curIcon?.text }}
      </div>
    </div>

    <div flex w-full h="[calc(100%-40px)]">
      <div
        class="icons"
        flex flex-col items-center
        w="40px" h-full
        py-2 border="#fff 1px solid"
      >
        <div
          v-for="(item, idx) in icons"
          :key="idx" :class="{ click: checkArr[idx] }"
          border="#fff 1px solid" mb-2 rounded-1
          @mouseover="overIcon(item)"
          @mouseleave="leaveIcon"
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
            :src="item"
            h-24 w-full rounded-1 cursor-move
            @dragstart="dragHandle"
            @dragend="e => imgDragEnd(e, idx)"
            @mousedown="changeImgSrc(item)"
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
