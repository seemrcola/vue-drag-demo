import { defineStore } from 'pinia'
import { ref } from 'vue'
import { cloneDeep } from 'lodash-es'
import { useRulerStore } from './ruler'
import { useViewStore } from './view'
import { isEmpty } from '@/utils/is'

export interface ShowData {
  x: number
  y: number
  rotate: number
  scale: [number, number]
  height: number
  width: number
  [propname: string]: any
}

export interface DeltaData {
  x?: number
  y?: number
  rotate?: number
  scale?: [number, number]
}

export const useSettingStore = defineStore('settings', () => {
  // ruler
  const rulerStore = useRulerStore()
  // view
  const viewStore = useViewStore()

  // 右侧用于展示的数据
  const initData: ShowData = { x: 0, y: 0, rotate: 0, scale: [1, 1], height: 0, width: 0 } // 初始化数据做个参考
  const showDataTarget = ref<ShowData>(initData)

  // 初始化组件的信息
  function init(init: ShowData[]) {
    if (isEmpty(init))
      return

    if (init.length === 1)
      return showDataTarget.value = cloneDeep(init[0])

    if (init.length > 1)
      console.log('todo')
  }

  // 计算单个组件的位置 展示给右边
  function settingDataForSingle(delta: DeltaData) {
    // todo
    // const { x, y, rotate, scale } = delta
    // const id = `#${viewStore.taregtSelect[0].id}`
    // const target = viewStore.getTarget(id)!
    // if (x || y) { // drag
    //   showDataTarget.value.x = target.x + (x || 0)
    //   showDataTarget.value.y = target.y + (y || 0)
    // }
    // if (rotate) { // rotate
    //   showDataTarget.value.rotate = (target.rotate + rotate) % 360
    // }
    // if (scale) { // scale
    //   // console.log(target, 'xxxxxpppppppp')
    //   // showDataTarget.value.scale[0] = scale[0]
    //   // showDataTarget.value.scale[1] = scale[1]
    //   const { x, y } = calcXY(id, target, scale)
    //   showDataTarget.value.x = x
    //   showDataTarget.value.y = y
    // }
  }

  // 计算moveable-area组件的位置 展示给右边
  function settingDataForGroup(delta: DeltaData) {

  }

  function calcXY(selector: string, target: any, curScale: [number, number]) {
    // todo
    // xy处理一下
    // const dom = document.querySelector(selector) as HTMLElement
    // const domRect = dom.getBoundingClientRect()
    // const canvas = document.querySelector('#canvas')!
    // const canvasRect = canvas.getBoundingClientRect()
    // // 中心点计算
    // const centerX = (domRect.left - canvasRect.left + domRect.width / 2)
    // const centerY = (domRect.top - canvasRect.top + domRect.height / 2)
    // // 与canvas画布的距离计算
    // // const canvasScale = rulerStore.rulerOptions.scale
    // const compRealWidth = target.width * (target.scale[0] * curScale[0])
    // const compRealHeight = target.height * (target.scale[1] * curScale[1])

    // console.log(compRealWidth, compRealHeight, centerX, centerY, 'xxxxxx')
    // const centerToborderX = compRealWidth / 2
    // const centerToborderY = compRealHeight / 2
    // // 算出的距离要根据画布缩放进行处理
    // const x = (centerX - centerToborderX)
    // const y = (centerY - centerToborderY)
    // return { x, y }
  }

  return {
    showDataTarget,
    settingDataForSingle,
    settingDataForGroup,
    init,
  }
})
