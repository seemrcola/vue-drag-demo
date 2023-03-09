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
  rotate: number
  component: {
    component: Component
    name: string
  }
}

export const toysComponentsConfig: ToysComponent[] = [
  // mines扫雷
  {
    type: 'toys',
    name: 'minesweeper',
    id: '',
    height: 400,
    width: 350,
    x: 0,
    y: 0,
    rotate: 0,
    component: toysComponents[0],
  },
  // plums 梅花生长
  {
    type: 'toys',
    name: 'plums',
    id: '',
    height: 400,
    width: 400,
    x: 0,
    y: 0,
    rotate: 0,
    component: toysComponents[1],
  },
  // 随机数
  {
    type: 'toys',
    name: 'random',
    id: '',
    height: 200,
    width: 200,
    x: 0,
    y: 0,
    rotate: 0,
    component: toysComponents[2],
  },
  // 元胞自动机-生命游戏
  {
    type: 'toys',
    name: 'automaton',
    id: '',
    height: 400,
    width: 400,
    x: 0,
    y: 0,
    rotate: 0,
    component: toysComponents[3],
  },
  // 疫情元胞自动机
  {
    type: 'toys',
    name: 'virus',
    id: '',
    height: 400,
    width: 400,
    x: 0,
    y: 0,
    rotate: 0,
    component: toysComponents[4],
  },
]
