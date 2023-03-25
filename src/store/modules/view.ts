import { defineStore } from 'pinia'
import { nextTick, ref } from 'vue'
import { useRulerStore } from './ruler'
import { useHistoryStore } from './history'

/* usemoveable 的selectTarget用来控制选中的效果，以及让target可以进行操作
 * view里面的selectTarget是用来渲染这些组件，让它们显示在正确的位置
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
  // 右侧用于展示的数据
  const initData: ShowData = { x: 0, y: 0, rotate: 0, scale: [1, 1], height: 0, width: 0 }
  const showDataTarget = ref<ShowData>({ x: 0, y: 0, rotate: 0, scale: [1, 1], height: 0, width: 0 })

  // !!右侧栏setting的展示-------------------------------------------------------------
  /**
   * @param data 操作组件时的组件id xy rotate等值
   * @param type 操作类型，结束操作还是操作中，涉及到rotate的赋值问题
   * @param scale type === 'ing'时用来处理宽高
  */
  function setShowDataTargetForComp(data: any = undefined, type: 'ing' | 'end' = 'end') {
    // 选择和变换两种情况 选择data和direction都是空 变换时都有值
    const { rotate, scale, id } = (data || taregtSelect.value[0])
    // 放大缩小的比例不直接显示在右侧，所以直接赋值就好
    if (scale) {
      showDataTarget.value.scale![0] = scale[0]
      showDataTarget.value.scale![1] = scale[1]
    }
    // rotate 需要兼容结束时和操作中 不过两种状态下行为是一样的
    if (rotate) {
      showDataTarget.value.rotate
      = rotate > 0
          ? Math.abs(rotate) % 360
          : -Math.abs(rotate) % 360
    }

    // xy需要处理一下 需要兼容结束时和操作中
    const { offsetX, offsetY } = uCalcCompXY(`#${id}`, type, scale)
    showDataTarget.value.x! = offsetX
    showDataTarget.value.y! = offsetY
    // 宽高处理 需要兼容结束时和操作中
    const comp = getTarget(`#${id}`)!
    if (type === 'ing' && scale) {
      showDataTarget.value.width! = comp.width * scale[0]
      showDataTarget.value.height! = comp.height * scale[1]
    }
    else {
      showDataTarget.value.width! = comp.width
      showDataTarget.value.height! = comp.height
    }
  }

  /**
   * @param data 操作组件时的组件id xy rotate等值
  */
  function setShowDataTargetForGroup(data: any) {
    // 如果组合被改变了，则重制
    if (data.change)
      return showDataTarget.value = { ...initData, ...data }

    // 组合没有被改变， 则在基础上运算
    nextTick(() => {
      const { rotate, scale } = data
      if (rotate) {
        showDataTarget.value.rotate
        = rotate > 0
            ? Math.abs(rotate) % 360
            : -Math.abs(rotate) % 360
      }
      if (scale) {
        showDataTarget.value.scale![0] *= scale[0]
        showDataTarget.value.scale![1] *= scale[1]
      }
      // 宽高获取
      const dom = document.querySelector('.moveable-area')
      showDataTarget.value.height = dom?.clientHeight || 0
      showDataTarget.value.width = dom?.clientWidth || 0
      // xy需要处理一下
      const { offsetX, offsetY } = uCalcCompXY('.moveable-area')
      showDataTarget.value.x = offsetX
      showDataTarget.value.y = offsetY
    })
  }

  function uCalcCompXY(
    selector: string,
    type: 'ing' | 'end' = 'end',
    scale: [number, number] | undefined = undefined,
  ) {
    // xy处理一下
    const dom = document.querySelector(`${selector}`)! as HTMLElement
    const domRect = dom.getBoundingClientRect()
    const canvas = document.querySelector('#canvas')!
    const canvasRect = canvas.getBoundingClientRect()
    // 中心点计算
    const centerX = (domRect.left + domRect.width / 2)
    const centerY = (domRect.top + domRect.height / 2)
    // 与canvas画布的距离计算
    const canvasScale = rulerStore.rulerOptions.scale
    let comp: any = getTarget(`${selector}`)
    if (selector === '.moveable-area')
      comp = { width: dom.clientWidth, height: dom.clientHeight }
    let centerToborderX = comp.width / 2 * canvasScale
    let centerToborderY = comp.height / 2 * canvasScale
    // 仅当ing且scale不为空的时候
    if (type === 'ing' && scale) {
      centerToborderX *= scale![0]
      centerToborderY *= scale![1]
    }
    // 算出的距离要根据画布缩放进行处理
    const offsetX = (centerX - canvasRect.left - centerToborderX) / canvasScale
    const offsetY = (centerY - canvasRect.top - centerToborderY) / canvasScale
    return { offsetX, offsetY }
  }

  // !!-------------------------------------------------------------------------------

  function setTarget(targetId: string, isGroup = false) {
    if (!isGroup)
      taregtSelect.value.length = 0
    taregtSelect.value.push(getTarget(targetId)!)
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
    console.log(component, 'sdsdsdsd')
    // 把compnent属性变成非响应式
    components.value.push(component)
    setTimeout(() => historyStore.track())
  }

  function changeComponents(componentId: string, data: ShowData) {
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
    // 只有操作结束的时候才需要去调用changeComponents，此时才会有完整的delta数据--------
    changeComponents(id, delta)
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
    showDataTarget,
    setShowDataTargetForComp,
    setShowDataTargetForGroup,
    changeComponents,
    clearSelect,
    uSetStyle,
  }
})
