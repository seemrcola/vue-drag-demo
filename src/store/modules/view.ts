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
  scaleX: number
  scaleY: number
}

type ShowDataType = 'group' | 'comp' | undefined

export const useViewStore = defineStore('view', () => {
  // 画布上的全部图表
  const components = ref<IComponent[]>([])
  // 画布上被选中的图表
  const taregtSelect = ref<IComponent[]>([])
  // 右侧用于展示的数据
  const showDataType = ref<ShowDataType>(undefined)
  const initData: ShowData = { x: 0, y: 0, rotate: 0, scaleX: 1, scaleY: 1 }
  const showDataTarget = ref(initData)

  // 右侧栏setting的展示
  function setShowDataTarget(data: any, type: ShowDataType) {
    // 如果状态改变了 那就重新给showData赋值
    if (type !== showDataType.value)
      showDataTarget.value = initData

    // 如果data是空值 则不是展示组合状态 直接展示选中的组件即可
    if (!data) {
      const target = taregtSelect.value[0]
      showDataTarget.value = {
        x: target.x,
        y: target.y,
        rotate: target.rotate,
        scaleX: target.scale[0],
        scaleY: target.scale[1],
      }
      showDataType.value = type
    }
    else {
      // 如果不是空值 那就是展示组合状态的数据
      const { x, y, rotate, scaleX, scaleY } = data
      console.log(data, showDataTarget, 'iiiiiiii')
      if (x)
        showDataTarget.value.x += x
      if (y)
        showDataTarget.value.y += y
      if (rotate)
        showDataTarget.value.rotate = rotate
      if (scaleX)
        showDataTarget.value.scaleX *= scaleX
      if (scaleY)
        showDataTarget.value.scaleY *= scaleY

      showDataType.value = type
    }
  }

  function setTarget(targetId: string, isGroup = false) {
    !isGroup && taregtSelect.value?.pop()
    taregtSelect.value?.push(getTarget(targetId)!)
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
    setShowDataTarget,
  }
})
