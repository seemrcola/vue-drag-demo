import { defineStore } from 'pinia'
import { markRaw, ref } from 'vue'

export interface IComponent {
  id: string
  type: string
  name: string
  x: number
  y: number
  rotate: number
  scale: number[]
  height: number
  width: number
  component: {
    component: any
    name: string
  }
}

export interface ShowData {
  x?: number
  y?: number
  rotate?: number
  scale?: [number, number]
  height?: number
  width?: number
}

export const useViewStore = defineStore('view', () => {
  // 画布上的全部图表
  const components = ref<IComponent[]>([])
  // 画布上被选中的图表
  const taregtSelect = ref<IComponent[]>([])
  // 被选中图表的偏差记录
  // 右侧用于展示的数据
  const initData: ShowData = { x: 0, y: 0, rotate: 0, scale: [1, 1], height: 0, width: 0 }
  const showDataTarget = ref<ShowData>({ x: 0, y: 0, rotate: 0, scale: [1, 1], height: 0, width: 0 })

  // 右侧栏setting的展示
  /**
   * @param data 缩放的时的xy值
   * @param direction 缩放的方向
   * @description 组件坐标 = seeting展示的坐标 + 偏差值
  */
  function setShowDataTargetForComp() {
    // 选择和变换两种情况 选择data和direction都是空 变换时都有值
    const { rotate, scale, id } = taregtSelect.value[0]
    // 这两个直接赋值就行了
    if (rotate)
      showDataTarget.value.rotate = rotate
    if (scale) {
      showDataTarget.value.scale![0] = scale[0]
      showDataTarget.value.scale![1] = scale[1]
    }
    // xy需要处理一下
    const { offsetX, offsetY } = uCalcCompXY(id)
    showDataTarget.value.x = offsetX
    showDataTarget.value.y = offsetY
    // 宽高直接赋值
    const comp = getTarget(`#${id}`)!
    showDataTarget.value.width = comp.width
    showDataTarget.value.height = comp.height
  }

  function uCalcCompXY(tagetId: string) {
    // xy处理一下
    const dom = document.querySelector(`#${tagetId}`)!
    const domRect = dom.getBoundingClientRect()
    const canvas = document.querySelector('#canvas')!
    const canvasRect = canvas.getBoundingClientRect()
    // 中心点计算
    const centerX = domRect.left + domRect.width / 2
    const centerY = domRect.top + domRect.height / 2
    // 与canvas画布的距离计算
    const comp = getTarget(`#${tagetId}`)!
    const offsetX = centerX - canvasRect.left - comp.width / 2
    const offsetY = centerY - canvasRect.top - comp.height / 2

    return { offsetX, offsetY }
  }

  /**
   * @param data 数据
   * @param direction 缩放的方向
  */
  function setShowDataTargetForGroup(data: any) {
    // 如果组合被改变了，则重制
    if (data.change)
      return showDataTarget.value = { ...initData, ...data }

    // 组合没有被改变， 则在基础上运算
    const { x, y, rotate, scale } = data
    if (x)
      showDataTarget.value.x += x
    if (y)
      showDataTarget.value.y += y
    if (rotate)
      showDataTarget.value.rotate = rotate
    if (scale) {
      showDataTarget.value.scale![0] *= scale[0]
      showDataTarget.value.scale![1] *= scale[1]
    }
  }

  function setTarget(targetId: string, isGroup = false) {
    if (!isGroup)
      taregtSelect.value.length = 0
    taregtSelect.value.push(getTarget(targetId)!)
  }

  function getTarget(targetId: string) {
    return components.value.find(component => `#${component.id}` === targetId)
  }

  function addComponent<T extends IComponent>(component: T) {
    // 把compnent属性变成非响应式
    component.component = markRaw(component.component)
    components.value.push(component)
  }

  function changeComponents(componentId: string, data: ShowData) {
    const item = components.value.find(item => componentId === item.id)!
    const { x, y, rotate, scale } = data
    if (x)
      item.x += x
    if (y)
      item.y += y
    if (rotate)
      item.rotate = rotate
    if (scale) {
      item.scale[0] *= scale[0]
      item.scale[1] *= scale[1]
      item.width *= scale[0]
      item.height *= scale[1]
    }
  }

  function removeComponent<T extends IComponent>(component: T) {
    const index = components.value.findIndex(comp => comp.id === component.id)
    components.value.splice(index, 1)
  }

  function initComponentStyle<T extends IComponent>(component: T) {
    return {
      position: 'absolute',
      left: `${component.x}px`,
      top: `${component.y}px`,
      transform: `rotate(${component.rotate}))`,
    }
  }

  return {
    components,
    removeComponent,
    addComponent,
    initComponentStyle,
    setTarget,
    getTarget,
    taregtSelect,
    showDataTarget,
    setShowDataTargetForComp,
    setShowDataTargetForGroup,
    changeComponents,
  }
})
