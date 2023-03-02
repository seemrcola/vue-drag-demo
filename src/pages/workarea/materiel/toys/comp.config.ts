import type { Component } from 'vue'
import { toysComponents } from './comp.index'
import type { IComponent } from '@/store/modules/view'

interface ToysComponent extends IComponent {
  type: string
  id: string
  name: string
  clientX: number
  clientY: number
  width: number
  height: number
  component: {
    component: Component
    name: string
  }
}

export const toysComponentsConfig: ToysComponent[] = [
  // mines
  {
    type: 'toys',
    name: 'minesweeper',
    id: '',
    height: 600,
    width: 500,
    clientX: 0,
    clientY: 0,
    component: toysComponents[0],
  },
  // plums
  {
    type: 'toys',
    name: 'plums',
    id: '',
    height: 500,
    width: 500,
    clientX: 0,
    clientY: 0,
    component: toysComponents[1],
  },
]
