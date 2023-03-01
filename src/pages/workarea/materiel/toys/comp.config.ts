import { toysComponents } from './comp.index'
import type { Component } from '@/store/modules/view'

interface ToysComponent extends Component {
  type: string
  id: string
  name: string
  clientX: number
  clientY: number
  width: number
  height: number
  component: any
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
