import { defineStore } from 'pinia'
import { markRaw, ref } from 'vue'

export interface IComponent {
  id: string
  type: string
  name: string
  x: number
  y: number
  rotate: number
  height: number
  width: number
  component: {
    component: any
    name: string
  }
}

export const useViewStore = defineStore('view', () => {
  const components = ref<IComponent[]>([])

  function addComponent<T extends IComponent>(component: T) {
    components.value.push(markRaw(component))
  }

  function removeComponent<T extends IComponent>(component: T) {
    const index = components.value.findIndex(comp => comp.id === component.id)
    components.value.splice(index, 1)
  }

  function setComponentStyle<T extends IComponent>(component: T) {
    console.log('xxxx')
    return {
      position: 'absolute',
      left: `${component.x}px`,
      top: `${component.y}px`,
      transform: `rotate(${component.rotate})`,
    }
  }

  return {
    components,
    removeComponent,
    addComponent,
    setComponentStyle,
  }
})
