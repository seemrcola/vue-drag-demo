import { defineStore } from 'pinia'
import { ref } from 'vue'
import { cloneDeep } from 'lodash-es'
import type { DeltaData, ShowData } from '../types/coord.d'
import { useRulerStore } from './ruler'
import { useViewStore } from './view'

export { DeltaData, ShowData }

export const useCoord = defineStore('base-single', () => {
  // ruler
  const rulerStore = useRulerStore()
  // view
  const viewStore = useViewStore()
  // 右侧用于展示的数据
  const initData: ShowData = { x: 0, y: 0, rotate: 0, scale: [1, 1], height: 0, width: 0 } // 初始化数据做个参考
  const showDataTarget = ref<ShowData>(initData)

  // 选中时的初始化
  function getInitData() {
    const initdata = cloneDeep(viewStore.taregtSelect[0])
    // 很重要的一步 由于是缩放改变了组件宽高 所以实际上的position是根据组件原大小来定的 所以选中的时候我们要做个减法
    initdata.x -= (initdata.width - initdata.initWidth) / 2
    initdata.y -= (initdata.height - initdata.initHeight) / 2
    return initdata
  }

  // 初始化组件的信息
  function init() {
    const data = getInitData()
    if (!data)
      return
    showDataTarget.value = data
  }

  // 计算单个组件的位置 展示给右边
  function settingDataForSingle(delta: DeltaData) {
    const { x, y, rotate, scale } = delta
    const id = `#${viewStore.taregtSelect[0].id}`
    const target = getInitData()!

    if (x || y) { // drag
      showDataTarget.value.x = target.x + (x || 0)
      showDataTarget.value.y = target.y + (y || 0)
    }
    if (rotate) { // rotate
      showDataTarget.value.rotate = (target.rotate + rotate) % 360
    }
    if (scale) { // scale
      const { x, y } = calcXY(id, target, scale)
      showDataTarget.value.x = x
      showDataTarget.value.y = y
      showDataTarget.value.width = target.width * scale[0]
      showDataTarget.value.height = target.height * scale[1]
    }
  }

  function calcXY(selector: string, target: any, curScale: [number, number]) {
    const canvasScale = rulerStore.rulerOptions.scale
    // xy处理一下
    const dom = document.querySelector(selector) as HTMLElement
    const domRect = dom.getBoundingClientRect()
    const canvas = document.querySelector('#canvas')!
    const canvasRect = canvas.getBoundingClientRect()
    // 中心点计算
    const centerX = (domRect.left - canvasRect.left + domRect.width / 2)
    const centerY = (domRect.top - canvasRect.top + domRect.height / 2)
    // 与canvas画布的距离计算
    const compRealWidth = target.initWidth * (target.scale[0] * curScale[0])
    const compRealHeight = target.initHeight * (target.scale[1] * curScale[1])
    const centerToborderX = compRealWidth / 2 * canvasScale
    const centerToborderY = compRealHeight / 2 * canvasScale
    // 算出的距离要根据画布缩放进行处理
    const x = (centerX - centerToborderX) / canvasScale
    const y = (centerY - centerToborderY) / canvasScale
    return { x, y }
  }

  return {
    showDataTarget,
    settingDataForSingle,
    init,
  }
})
