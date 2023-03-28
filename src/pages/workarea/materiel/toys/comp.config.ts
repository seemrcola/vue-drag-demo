import type { IComponent } from '@/store/modules/view'
import { compType } from '@/enum/materiel.enum'

interface ToysComponent extends IComponent {}

export const toysComponentsConfig: ToysComponent[] = [
  // 元胞自动机-生命游戏
  {
    type: compType.TOYS, // 组件类型
    name: 'automaton', // 组件名称
    id: '', // 组件id
    height: 400, // 组件高度
    width: 400, // 组件宽度
    x: 0, // 相对画布的x距离
    y: 0, // 相对画布的y距离
    rotate: 0, // 旋转角度
    scale: [1, 1], // 缩放
    selecto: false, // 是否选中
    component: `${compType.TOYS}-automaton`, // 为防止名称重复 组件注册时候的名称就用类型+名称来表示
  },
  // mines扫雷
  {
    type: compType.TOYS,
    name: 'mines',
    id: '',
    height: 400,
    width: 350,
    x: 0,
    y: 0,
    rotate: 0,
    scale: [1, 1],
    selecto: false,
    component: `${compType.TOYS}-mines`,
  },
  // plum 梅花生长
  {
    type: compType.TOYS,
    name: 'plum',
    id: '',
    height: 400,
    width: 400,
    x: 0,
    y: 0,
    rotate: 0,
    scale: [1, 1],
    selecto: false,
    component: `${compType.TOYS}-plum`,
  },
  // 随机数
  {
    type: compType.TOYS,
    name: 'random',
    id: '',
    height: 200,
    width: 200,
    x: 0,
    y: 0,
    rotate: 0,
    scale: [1, 1],
    selecto: false,
    component: `${compType.TOYS}-random`,
  },
  // 疫情元胞自动机
  {
    type: compType.TOYS,
    name: 'virus',
    id: '',
    height: 400,
    width: 400,
    x: 0,
    y: 0,
    rotate: 0,
    scale: [1, 1],
    selecto: false,
    component: `${compType.TOYS}-virus`,
  },
]
