import { defineStore } from 'pinia'
import { nextTick, ref } from 'vue'
import { useRulerStore } from './ruler'
import { useViewStore } from './view'

export interface ShowData {
  x?: number
  y?: number
  rotate?: number
  scale?: [number, number]
  height?: number
  width?: number
}

export const useSettingStore = defineStore('settings', () => {
  // ruler
  const rulerStore = useRulerStore()
  // view
  const viewStore = useViewStore()

  // 右侧用于展示的数据
  const initData: ShowData = { x: 0, y: 0, rotate: 0, scale: [1, 1], height: 0, width: 0 }
  const showDataTarget = ref<ShowData>({ x: 0, y: 0, rotate: 0, scale: [1, 1], height: 0, width: 0 })
  /**
   * @param data 操作组件时的组件id xy rotate等值
   * @param type 操作类型，结束操作还是操作中，涉及到rotate的赋值问题
   * @param scale type === 'ing'时用来处理宽高
  */
  function setShowDataTargetForComp(data: any = undefined, type: 'ing' | 'end' = 'end') {
    // 选择和变换两种情况 选择data和direction都是空 变换时都有值
    const { rotate, scale, id } = (data || viewStore.taregtSelect[0])
    // 放大缩小的比例不直接显示在右侧，所以直接赋值就好
    if (scale) {
      showDataTarget.value.scale![0] = scale[0]
      showDataTarget.value.scale![1] = scale[1]
    }
    // rotate 需要兼容结束时和操作中 不过两种状态下行为是一样的
    if (rotate) {
      showDataTarget.value.rotate
      = rotate > 0
          ? Math.abs(rotate) % 360
          : -Math.abs(rotate) % 360
    }

    // xy需要处理一下 需要兼容结束时和操作中
    const { offsetX, offsetY } = uCalcCompXY(`#${id}`, type, scale)
    showDataTarget.value.x! = offsetX
    showDataTarget.value.y! = offsetY
    // 宽高处理 需要兼容结束时和操作中
    const comp = viewStore.getTarget(`#${id}`)!
    if (type === 'ing' && scale) {
      showDataTarget.value.width! = comp.width * scale[0]
      showDataTarget.value.height! = comp.height * scale[1]
    }
    else {
      showDataTarget.value.width! = comp.width
      showDataTarget.value.height! = comp.height
    }
  }

  /**
   * @param data 操作组件时的组件id xy rotate等值
  */
  function setShowDataTargetForGroup(data: any) {
    // 如果组合被改变了，则重制
    if (data.change)
      return showDataTarget.value = { ...initData, ...data }

    // 组合没有被改变， 则在基础上运算
    nextTick(() => {
      const { rotate, scale } = data
      if (rotate) {
        showDataTarget.value.rotate
        = rotate > 0
            ? Math.abs(rotate) % 360
            : -Math.abs(rotate) % 360
      }
      if (scale) {
        showDataTarget.value.scale![0] *= scale[0]
        showDataTarget.value.scale![1] *= scale[1]
      }
      // 宽高获取
      const dom = document.querySelector('.moveable-area')
      showDataTarget.value.height = dom?.clientHeight || 0
      showDataTarget.value.width = dom?.clientWidth || 0
      // xy需要处理一下
      const { offsetX, offsetY } = uCalcCompXY('.moveable-area')
      showDataTarget.value.x = offsetX
      showDataTarget.value.y = offsetY
    })
  }

  function uCalcCompXY(
    selector: string,
    type: 'ing' | 'end' = 'end',
    scale: [number, number] | undefined = undefined,
  ) {
    // xy处理一下
    const dom = document.querySelector(`${selector}`)! as HTMLElement
    const domRect = dom.getBoundingClientRect()
    const canvas = document.querySelector('#canvas')!
    const canvasRect = canvas.getBoundingClientRect()
    // 中心点计算
    const centerX = (domRect.left + domRect.width / 2)
    const centerY = (domRect.top + domRect.height / 2)
    // 与canvas画布的距离计算
    const canvasScale = rulerStore.rulerOptions.scale
    let comp: any = viewStore.getTarget(`${selector}`)
    if (selector === '.moveable-area')
      comp = { width: dom.clientWidth, height: dom.clientHeight }
    let centerToborderX = comp.width / 2 * canvasScale
    let centerToborderY = comp.height / 2 * canvasScale
    // 仅当ing且scale不为空的时候
    if (type === 'ing' && scale) {
      centerToborderX *= scale![0]
      centerToborderY *= scale![1]
    }
    // 算出的距离要根据画布缩放进行处理
    const offsetX = (centerX - canvasRect.left - centerToborderX) / canvasScale
    const offsetY = (centerY - canvasRect.top - centerToborderY) / canvasScale
    return { offsetX, offsetY }
  }

  return {
    showDataTarget,
    setShowDataTargetForComp,
    setShowDataTargetForGroup,
  }
})
