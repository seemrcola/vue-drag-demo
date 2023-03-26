import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRulerStore } from './ruler'
import { useHistoryStore } from './history'

/*
 * usemoveable 的selectTarget用来控制选中的效果，以及让target可以进行操作，里面只有一个id属性
 * view里面的selectTarget内的数据更多，是把component的全部属性都保存下来形成的数组
*/

export interface IComponent {
  id: string
  type: string
  name: string
  x: number
  y: number
  rotate: number
  scale: number[]
  height: number
  width: number
  selecto: boolean // 是否被框选
  component: string // 组件名称 由TYPE加name拼接而成
}

export interface ShowData {
  x?: number
  y?: number
  rotate?: number
  scale?: [number, number]
  height?: number
  width?: number
}

export const useViewStore = defineStore('view', () => {
  // ruler
  const rulerStore = useRulerStore()
  // history
  const historyStore = useHistoryStore()
  // 画布上的全部图表
  const components = ref<IComponent[]>([])
  // 画布上被选中的图表
  const taregtSelect = ref<IComponent[]>([])

  function setTarget(targetId: string[]) {
    // 清空数组
    taregtSelect.value = []
    // 重新给数组赋值
    targetId.forEach((id) => {
      taregtSelect.value.push(getTarget(id)!)
    })
  }

  function getTarget(targetId: string) {
    return components.value.find(component => `#${component.id}` === targetId)
  }

  function clearSelect() {
    taregtSelect.value = []
  }

  function removeComponent<T extends IComponent>(component: T) {
    const index = components.value.findIndex(comp => comp.id === component.id)
    components.value.splice(index, 1)
  }

  function addComponent<T extends IComponent>(component: T) {
    // 把compnent属性变成非响应式
    components.value.push(component)
    setTimeout(() => historyStore.track())
  }

  function transformcomponent(componentId: string, data: ShowData) {
    const item = components.value.find(item => componentId === item.id)!
    const { x, y, rotate, scale } = data
    if (x)
      item.x += x
    if (y)
      item.y += y
    if (rotate)
      item.rotate = rotate
    if (scale) {
      item.scale[0] *= scale[0]
      item.scale[1] *= scale[1]
      item.width *= scale[0]
      item.height *= scale[1]
    }
  }

  /* 只用于初始化样式，后续啊的样式更改将直接在e.target上改 */
  function initComponentStyle<T extends IComponent>(component: T) {
    return {
      position: 'absolute',
      left: `${component.x}px`,
      top: `${component.y}px`,
      transform: `rotate(${component.rotate}deg) scale(${component.scale[0]}, ${component.scale[1]})`,
    }
  }

  // 样式改变相关-------------------------------------------------------------------
  // 用来改变组件的样式 transform to absolute 以及改变views.components记录的值
  function uSetStyle(
    target: HTMLElement,
    delta: ShowData,
  ) {
    const id = target.id
    // 根据id修改componnets中对应的component
    // 只有操作结束的时候才需要去调用transformcomponent，此时才会有完整的delta数据--------
    transformcomponent(id, delta)
    // 获取component
    const targetComponent = getTarget(`#${id}`)
    // 通过对象实例改变对象style.position的属性
    const [scalex = 1, scaley = 1] = targetComponent!.scale
    target.style.top = `${targetComponent!.y}px`
    target.style.left = `${targetComponent!.x}px`
    target.style.transform = `rotate(${targetComponent!.rotate}deg) scale(${scalex}, ${scaley})`
  }
  // --------------------------------------------------------------------------

  return {
    components,
    removeComponent,
    addComponent,
    initComponentStyle,
    setTarget,
    getTarget,
    taregtSelect,
    transformcomponent,
    clearSelect,
    uSetStyle,
  }
})
