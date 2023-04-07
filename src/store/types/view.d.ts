export interface IComponent {
  id: string
  type: string
  name: string
  x: number
  y: number
  rotate: number
  scale: [number, number]
  initHeight: number // 元素初始化时的宽高
  initWidth: number // 元素初始化时的宽高
  height: number // 元素变换之后的宽高
  width: number // 元素变换之后的宽高
  selecto: boolean // 是否被框选
  lock: boolean // 是否锁定
  visible: boolean // 是否可见
  component: string // 组件名称 由TYPE加name拼接而成
  event?: EventItem[]
}

interface EventItem {
  eventName: string
  disc: string
}

export interface DertaData {
  x?: number
  y?: number
  rotate?: number
  scale?: [number, number]
  height?: number
  width?: number
}
