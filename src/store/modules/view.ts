import { defineStore } from 'pinia'
import { shallowRef } from 'vue'

export interface IComponent {
  id: string
  type: string
  name: string
  clientX: number
  clientY: number
  height: number
  width: number
  component: {
    component: any
    name: string
  }
}

export const useViewStore = defineStore('view', () => {
  const components = shallowRef<IComponent[]>([])

  function addComponent(component: IComponent) {
    components.value.push(component)
  }

  function removeComponent(component: IComponent) {
    const index = components.value.findIndex(comp => comp.id === component.id)
    components.value.splice(index, 1)
  }

  function setComponentStyle(component: IComponent) {
    console.log('dfdf')
    return {
      position: 'absolute',
    }
  }

  return {
    components,
    removeComponent,
    addComponent,
    setComponentStyle,
  }
})
