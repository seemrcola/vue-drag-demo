import type { IComponent } from '@/store/modules/view'
import { CompType } from '@/enum/materiel.enum'

interface ChartComponent extends IComponent {}

export const chartComponentsConfig: ChartComponent[] = [
  // 旭日图
  {
    type: CompType.CHART, // 组件类型
    name: 'sun', // 组件名称
    id: '', // 组件id
    initHeight: 400, // 组件初始高度
    initWidth: 400, // 组件初始宽度
    height: 400, // 组件高度
    width: 400, // 组件宽度
    x: 0, // 相对画布的x距离
    y: 0, // 相对画布的y距离
    rotate: 0, // 旋转角度
    scale: [1, 1], // 缩放
    selecto: false, // 是否选中
    lock: false, // 是否锁定
    visible: false, // 是否可见
    component: `${CompType.CHART}-sun`, // 为防止名称重复 组件注册时候的名称就用类型+名称来表示
    thumbnail: 'assets/img/chart/sun.png',
    event: [
      // { eventName: 'reset', disc: '重置' },
    ],
  },
]
