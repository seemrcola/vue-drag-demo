import { computed, onUnmounted, ref } from 'vue'
import { useMoveable } from './useMoveable'
import { isEmpty } from '@/utils/is'
import { useRulerStore, useViewStore } from '@/store/modules'

interface Point {
  x: number
  y: number
}
interface Options {
  color?: string
  container: string
}
/* 这个hooks需要用到store 需要view里面的属性 */
/* 这种需要依赖外部store的函数组合，就不写进全局的hooks中 */
export function useSeleto(options: Options) {
  // moveable
  const moveable = useMoveable()
  // ruler
  const rulerStore = useRulerStore()
  // view
  const viewStore = useViewStore()
  // container Rect
  let containerRect: DOMRect
  // 边框
  const COLOR = options?.color || '#4af'
  // 拖拽锁
  let lock = true
  // 被选中的元素
  const selected = ref<Array<{ id: string }>>([])
  // 开始坐标
  const start = ref<Point>({ x: 0, y: 0 })
  const end = ref<Point>({ x: 0, y: 0 })
  function handleMouseDown(e: MouseEvent) {
    // 打开拖拽锁
    lock = false
    // 将鼠标样式改成cross标识
    const target = e.target as HTMLElement
    target.style.cursor = 'crosshair'
    // 确定初始坐标
    const { clientX, clientY } = e
    start.value = {
      x: clientX,
      y: clientY,
    }
    // 拿到container的Rect
    containerRect = getContainerRect()
    // 事件绑定
    document.body.addEventListener('mousemove', handleMouseMove)
    document.body.addEventListener('mouseup', handleMouseUp)
  }

  function handleMouseMove(e: MouseEvent) {
    e.preventDefault() // 阻止滚动条滚动
    // 未解锁直接return
    if (lock)
      return
    const { shift, ctrl, space } = window.$KeyboardActive
    const isFn = shift || ctrl || space
    if (isFn) // 有特殊键按下时候不触发框选
      return
    const { clientX, clientY } = e
    end.value = { x: clientX, y: clientY }
    // 计算哪些倒霉蛋被框选住了
    const ans = getWrapperedComps()
    // 被框选住的要加box-shadow来标记一下框选到了
    if (isEmpty(viewStore.components))
      return
    viewStore.components.forEach((comp) => {
      comp.selecto = false
      ans.forEach((sel) => {
        if (sel.id === comp.id)
          comp.selecto = true
      })
    })
  }

  function handleMouseUp(e: MouseEvent) {
    lock = false
    // 计算哪些倒霉蛋被框选住了
    selected.value = getWrapperedComps()
    // 通知moveable moveable会主动通知view
    const ids = selected.value
    moveable.selectComponent(ids, 'selecto')
    // 清掉框住的状态
    viewStore.components.forEach(comp => comp.selecto = false)
    // 清空一些乱七八糟的
    start.value = { x: 0, y: 0 }
    end.value = { x: 0, y: 0 }
    document.body.removeEventListener('mousemove', handleMouseMove)
    document.body.removeEventListener('mouseup', handleMouseUp)
    // 将鼠标样式改成常规标识
    const target = e.target as HTMLElement
    target.style.cursor = ''
  }

  function getWrapperedComps() {
    // 如果都是空 就不用计算了
    if (
      (end.value.x === 0 && end.value.y === 0)
      || (start.value.x === 0 && start.value.y === 0)
    )
      return []

    const components = viewStore.components
    // 如果无组件 则直接return
    if (isEmpty(components))
      return []
    const ans: Array<{ id: string }> = []
    // 选框的坐标-------------------------------------
    const { left, top, height, width } = calcXY()
    const startx = left
    const starty = top
    const endx = startx + width
    const endy = starty + height
    // -------------------------------------------
    components.forEach((component) => {
      const { x, y, width, height } = component
      if (
        startx < x
        && starty < y
        && endx > (x + width)
        && endy > (y + height)
      )
        ans.push({ id: `${component.id}` })
    })
    return ans
  }

  const setStyle = computed(() => {
    if (end.value.x === 0 && end.value.y === 0)
      return {}
    const { left, top, width, height } = calcXY()
    return {
      'left': `${left}px`,
      'top': `${top}px`,
      'width': `${width}px`,
      'height': `${height}px`,
      'border': `2px solid ${COLOR}`,
      'z-index': 1000,
    }
  })

  function getContainerRect() {
    const container = document.querySelector(options.container)
    if (!container)
      throw new Error('[Selecto Error] Unable to find container')
    const rect = container.getBoundingClientRect()
    return rect
  }

  function calcXY() {
    const { scale } = rulerStore.rulerOptions
    const left = (Math.min(start.value.x, end.value.x) - containerRect?.left || 0) / scale
    const top = (Math.min(start.value.y, end.value.y) - containerRect?.top || 0) / scale
    const width = Math.abs(end.value.x - start.value.x) / scale
    const height = Math.abs(end.value.y - start.value.y) / scale
    return {
      left, top, width, height,
    }
  }

  onUnmounted(() => {
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  })

  return {
    selectoDown: handleMouseDown,
    setStyle,
    getWrapperedComps,
    selected,
  }
}
