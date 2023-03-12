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

export const useViewStore = defineStore('view', () => {
  // 画布上的全部图表
  const components = ref<IComponent[]>([])
  // 画布上被选中的图表
  const taregtSelect = ref<IComponent>()

  // 更改选中的图表
  function setTarget(targetId: string) {
    taregtSelect.value = getTarget(targetId)
  }

  function getTarget(targetId: string) {
    console.log(components, 'components')
    return components.value.find(component => `#${component.id}` === targetId)
  }

  function addComponent<T extends IComponent>(component: T) {
    // 把compnent属性变成非响应式
    console.log(component, 'addComponent')
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
  }
})
