import type { IComponent } from '@/store/modules/view'
import { compType } from '@/enum/materiel.enum'
interface ToysComponent extends IComponent {}

// 目前这里的顺序要和toys文件夹下的顺序一致
export const toysComponentsConfig: ToysComponent[] = [
  // 元胞自动机-生命游戏
  {
    type: compType.TOYS,
    name: 'automaton',
    id: '',
    height: 400,
    width: 400,
    x: 0,
    y: 0,
    rotate: 0,
    scale: [1, 1],
    selecto: false,
    component: `${compType.TOYS}automaton`,
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
    component: `${compType.TOYS}mines`,
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
    component: `${compType.TOYS}plum`,
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
    component: `${compType.TOYS}random`,
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
    component: `${compType.TOYS}virus`,
  },
]
