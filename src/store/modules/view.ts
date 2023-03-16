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

interface ShowData {
  x: number
  y: number
  rotate: number
  scale: [number, number]
}

export const useViewStore = defineStore('view', () => {
  // 画布上的全部图表
  const components = ref<IComponent[]>([])
  // 画布上被选中的图表
  const taregtSelect = ref<IComponent[]>([])
  // 右侧用于展示的数据
  const initData: ShowData = { x: 0, y: 0, rotate: 0, scale: [1, 1] }
  const showDataTarget = ref(initData)

  // 右侧栏setting的展示
  function setShowDataTargetForComp() {
    console.log('in comp')
    // 当单个组件的情况下，可能是切换组件，也可能是连续移动某个组件
    console.log(taregtSelect.value)
    const { x, y, rotate, scale } = taregtSelect.value[0] // !! fixme: 这里没有跟着动态改变
    if (x)
      showDataTarget.value.x = x
    if (y)
      showDataTarget.value.y = y
    if (rotate)
      showDataTarget.value.rotate = rotate
    if (scale) {
      showDataTarget.value.scale[0] = scale[0]
      showDataTarget.value.scale[1] = scale[1]
    }
  }

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
      showDataTarget.value.scale[0] *= scale[0]
      showDataTarget.value.scale[1] *= scale[1]
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
  }
})
