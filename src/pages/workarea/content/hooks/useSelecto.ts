import { computed, onUnmounted, ref } from 'vue'
import { useRulerStore } from '@/store/modules'

interface Point {
  x: number
  y: number
}
interface Options {
  color?: string
  container: string
}

export function useSeleto(options: Options) {
  // ruler
  const rulerStore = useRulerStore()
  // 测试用的selectoRef
  const selectoRef = ref<HTMLElement>()
  // container Rect
  let containerRect: DOMRect
  // 边框
  const COLOR = options?.color || '#4af'
  // 拖拽锁
  let lock = true
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
    console.log(containerRect)
    // 事件绑定
    document.body.addEventListener('mousemove', handleMouseMove)
    document.body.addEventListener('mouseup', handleMouseUp)
  }

  function handleMouseMove(e: MouseEvent) {
    if (lock)
      return
    const { shift, ctrl, space } = window.$KeyboardActive
    const isFn = shift || ctrl || space
    if (isFn) // 有特殊键按下时候不触发框选
      return
    const { clientX, clientY } = e
    end.value = { x: clientX, y: clientY }
    // deflateRaw()  //用于测试的
  }

  function handleMouseUp(e: MouseEvent) {
    lock = false
    start.value = { x: 0, y: 0 }
    end.value = { x: 0, y: 0 }
    document.body.removeEventListener('mousemove', handleMouseMove)
    document.body.removeEventListener('mouseup', handleMouseUp)
    // 将鼠标样式改成常规标识
    const target = e.target as HTMLElement
    target.style.cursor = ''
  }

  /**
   * 这里的写法和viewStore里有点区别，view中是直接修改的e.target，而这里是修改一个对象
   * 按理说数据驱动视图应该更好，所以view中应该也用这种方式
   * 不过考虑到view中修改e.target的样式仅仅发生在拖拽旋转和缩放结束，所以不会有太大影响，方便起见就没有多写一个computed
   * 而这里不一样，这里move操作会频繁触发，直接更改样式就会频繁回流
   * 不过测试上体验差距不大
   * 我把代码放在下面，后续有空再体验到底有没有差距
  */
  // function deflateRaw() {
  //   const left = Math.min(start.value.x, end.value.x) - containerRect?.left || 0
  //   const top = Math.min(start.value.y, end.value.y) - containerRect?.top || 0
  //   const width = Math.abs(end.value.x - start.value.x)
  //   const height = Math.abs(end.value.y - start.value.y)
  //   selectoRef.value!.style.left = `${left}px`
  //   selectoRef.value!.style.top = `${top}px`
  //   selectoRef.value!.style.width = `${width}px`
  //   selectoRef.value!.style.height = `${height}px`
  //   selectoRef.value!.style.border = `2px solid ${COLOR}`
  //   selectoRef.value!.style.zIndex = '1000'
  // }
  const setStyle = computed(() => {
    if (end.value.x === 0 && end.value.y === 0)
      return {}
    const { scale } = rulerStore.rulerOptions
    const left = (Math.min(start.value.x, end.value.x) - containerRect?.left || 0) / scale
    const top = (Math.min(start.value.y, end.value.y) - containerRect?.top || 0) / scale
    const width = Math.abs(end.value.x - start.value.x) / scale
    const height = Math.abs(end.value.y - start.value.y) / scale
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

  function setSelectoRef(ref: HTMLElement) {
    selectoRef.value = ref
  }

  onUnmounted(() => {
    document.removeEventListener('mousedown', handleMouseDown)
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  })

  return {
    selectoDown: handleMouseDown,
    setSelectoRef,
    setStyle,
  }
}
