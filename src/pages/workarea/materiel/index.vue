<script setup lang='ts'>
import { onUnmounted, reactive, ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { componentsConfig } from './comp.config'
import { CompType } from '@/enum/materiel.enum'
import type { ImgGlobResult } from '@/utils/glob'
import { imgGlob } from '@/utils/index'
import { useRulerStore, useViewStore } from '@/store/modules/index'
import Goast from '@/components/goast/index.vue'
import type { IComponent } from '@/store/types/view'

const viewStore = useViewStore()
const rulerStore = useRulerStore()

const toysModules = imgGlob(CompType.TOYS)
const shapeModules = imgGlob(CompType.SHAPE)
const mediaModules = imgGlob(CompType.MEDIA)
const chartModules = imgGlob(CompType.CHART)

interface Icon {
  icon: string
  text: string
  type: CompType
  imgList: ImgGlobResult[]
}
const icons = reactive<Icon[]>([
  { icon: 'i-icon-park-solid:game', text: '玩具', type: CompType.TOYS, imgList: toysModules },
  { icon: 'i-simple-icons:soundcharts', text: '图表', type: CompType.CHART, imgList: chartModules },
  { icon: 'i-ic:twotone-media-bluetooth-on', text: '媒体', type: CompType.MEDIA, imgList: mediaModules },
  { icon: 'i-carbon:shape-intersect', text: '形状', type: CompType.SHAPE, imgList: shapeModules },
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
const component = ref<IComponent>()
const style = ref({ left: '0px', top: '0px', transform: '' })
const dragFlag = ref(false)
let scale = 0
function changeImgSrc(imgSrc: ImgGlobResult, e: MouseEvent) {
  scale = rulerStore.rulerOptions.scale
  // 图片src赋值确保拖出来的图片正确
  imgsrc.value = imgSrc
  // 为拖拽做点准备
  dragFlag.value = true
  window.addEventListener('mousemove', mousemoveHandle)
  window.addEventListener('mouseup', mouseupHandle)
}

function mousemoveHandle(e: MouseEvent) {
  if (!dragFlag.value)
    return
  // 靠名字找到组件的config信息 也可以根据index找 但是index有局限 config文件就必须按顺序来写组件
  component.value = componentsConfig[curIcon.type]
    .find(comp => comp.component.includes(imgsrc.value!.name))!
  // 位置和大小处理一下
  style.value.left = `${(e.clientX - component.value!.width / 2)}px`
  style.value.top = `${(e.clientY - component.value!.height / 2)}px`
  style.value.transform = `scale(${scale})`
}
/**************************************************************************/

/** ***************** 拖拽结束时组件放入画布 ***********************/
function mouseupHandle(e: MouseEvent) {
  // 清空
  dragFlag.value = false
  style.value = { left: '0px', top: '0px', transform: '' }

  const { left, top } = document.querySelector('#canvas')!.getBoundingClientRect()
  // 靠名字找到组件的config信息
  const compnentConfig = component.value!
  // 按下就松开的情况下直接return
  if (!compnentConfig)
    return
  // 计算坐标点
  const { clientX, clientY } = e
  const { width, height } = compnentConfig
  const x = (clientX - left) / scale - (width / 2)
  const y = (clientY - top) / scale - (height / 2)
  // 进入画布则收集该组件信息
  if ((clientX) > left && (clientY) > top) {
    const targetComponent = {
      ...compnentConfig,
      id: `wrapper${uuidv4().split('-')[0]}`,
      scale: [1, 1] as [number, number], // 因为我引入的是同一个组件，共享同一个模板数据，所以引用类型的数据要注意，需要覆盖一下
      x,
      y,
    }
    viewStore.addComponent(targetComponent)
  }
  // 清空
  component.value = undefined
  clearListener()
}

function clearListener() {
  window.removeEventListener('mousemove', mousemoveHandle)
  window.removeEventListener('mouseup', mouseupHandle)
}
/*******************************************************************/

onUnmounted(() => {
  clearListener()
})
</script>

<template>
  <div wh-full bg="#222">
    <Teleport to="body">
      <Goast
        v-if="component"
        ref="goast" absolute z-999
        :style="style" :component="component!"
      />
    </Teleport>
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
            :draggable="false"
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
