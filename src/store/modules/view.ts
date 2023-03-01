import { defineStore } from 'pinia'
import { shallowRef } from 'vue'
import type { DefineComponent } from 'vue'

export interface Component {
  id: string
  type: string
  name: string
  clientX: number
  clientY: number
  height: number
  width: number
  component: DefineComponent
}

export const useViewStore = defineStore('view', () => {
  const components = shallowRef<Component[]>([])

  function addComponent(component: Component) {
    components.value.push(component)
  }

  function removeComponent(component: Component) {
    const index = components.value.findIndex(comp => comp.id === component.id)
    components.value.splice(index, 1)
  }

  return {
    components,
    removeComponent,
    addComponent,
  }
})
