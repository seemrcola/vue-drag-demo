import type { Component } from 'vue'
import { toysComponents } from './comp.index'
import type { IComponent } from '@/store/modules/view'

interface ToysComponent extends IComponent {
  type: string
  id: string
  name: string
  x: number
  y: number
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
    height: 400,
    width: 350,
    x: 0,
    y: 0,
    component: toysComponents[0],
  },
  // plums
  {
    type: 'toys',
    name: 'plums',
    id: '',
    height: 400,
    width: 400,
    x: 0,
    y: 0,
    component: toysComponents[1],
  },
  {
    type: 'toys',
    name: 'random',
    id: '',
    height: 200,
    width: 200,
    x: 0,
    y: 0,
    component: toysComponents[2],
  },
  {
    type: 'toys',
    name: 'random',
    id: '',
    height: 300,
    width: 300,
    x: 0,
    y: 0,
    component: toysComponents[3],
  },
]
