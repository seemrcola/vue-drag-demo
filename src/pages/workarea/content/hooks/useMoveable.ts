import { nextTick, ref } from 'vue'
import { isEmpty } from '@/utils/is'
/*
 * uSetStyle 用来处理单个组件的位置【在拖拽操作结束之后处理】
 * view.setShowDataTarget 用来处理seetings.vue文件展示的数值【在拖拽结束之后处理】
 * 这个hooks需要用到useKeyBoard
 * 这个hooks需要用到store 改变view里面的属性
 * 这种需要依赖外部store的函数组合，就不写进全局的hooks中
 * // !! 注意:
 * 由于操作结束之后组件的位置要改成用position去处理，所以需要将moveable的target同步给views的target 一边viewStore去处理
 */
import { useHistoryStore, useViewStore } from '@/store/modules'

// 被选中的元素
const selectTarget = ref<string[]>([])

export function useMoveable() {
  const { track } = useHistoryStore()
  const viewStore = useViewStore()
  let oprateMode: 'comp' | 'group' // 操作类型 是分组操作还是单个操作

  function getKeyStatus() {
    return {
      isMeta: window.$KeyboardActive.meta,
      isCtrl: window.$KeyboardActive.ctrl,
      isSpace: window.$KeyboardActive.space,
    }
  }

  function isGroup() {
    return oprateMode === 'group'
  }

  // 选中组件的方法有两种 一种是框选 还有一种是点击
  function selectComponent<T extends { id: string }>(
    comp: T | T[],
    type: 'click' | 'selecto' = 'click',
  ) {
    if (type === 'click')
      selectByClick(comp as T)
    if (type === 'selecto')
      selectBySelecto(comp as T[])
  }

  function selectBySelecto<T extends { id: string }>(comps: T[]) {
    oprateMode = 'group' // 框选也视为组合选中
    if (isEmpty(comps))
      return
    selectTarget.value = comps.map(comp => `#${comp.id}`)
    DuetoSelectedInView()
  }

  function selectByClick<T extends { id: string }>(comp: T) {
    const { isMeta, isCtrl } = getKeyStatus()
    const id = `#${(comp).id}`
    // !!: 每次必须要更换数组指向，否则不生效，就离谱----
    const noCtrl = !isCtrl && !isMeta
    if (noCtrl || (!noCtrl && selectTarget.value.length === 0)) { // 不按住ctrl 或者按住ctrl但是target列表长度为0
      oprateMode = 'comp'
      selectTarget.value = [id]
      DuetoSelectedInView()
    }
    else {
      oprateMode = 'group'
      selectTarget.value = [...selectTarget.value, id]
      DuetoSelectedInView()
    }
  }

  function DuetoSelectedInView() {
    // 区分组合状态和不组合状态 view中的target根据是否组合来确认如何保存数据
    viewStore.setTarget(selectTarget.value)
    if (isGroup()) {
      nextTick(() => { // 这里要这么套才行，原因未知 fixme
        setTimeout(() => { // 这里用定时器是为了保证能获取到movable-area元素
          // view中的展示数组处理 针对组合选中
          const { x, y } = uCalcXY()
          viewStore.setShowDataTargetForGroup({ x, y, change: true })
        })
      })
    }

    else { viewStore.setShowDataTargetForComp() } // view中的展示数组处理
  }

  function clearSelect() {
    console.log('drop')
    selectTarget.value = []
    viewStore.clearSelect()
    viewStore.setShowDataTargetForGroup({ change: true })
  }

  // !!单个组件操作-----------------------------------------------------------

  function singleHandler(e: any, type: 'drag' | 'scale' | 'rotate') {
    if (type === 'scale')
      onScale(e)
    if (type === 'drag')
      onDrag(e)
    if (type === 'rotate')
      onRotate(e)
  }

  function onDrag({ transform, target, dist }: any) {
    target.style.transform = transform
    const [x, y] = dist
    viewStore.setShowDataTargetForComp({ x, y, id: target.id }, 'ing')
  }

  function onScale({ drag, target, dist }: any) {
    target.style.transform = drag.transform
    const scale = [...dist]
    viewStore.setShowDataTargetForComp({ scale, id: target.id }, 'ing')
  }

  function onRotate({ drag, target, dist }: any) {
    target.style.transform = drag.transform
    const rotate = dist
    viewStore.setShowDataTargetForComp({ rotate, id: target.id }, 'ing')
  }
  // !!----------------------------------------------------------------------

  // !!组合操作----------------------------------------------------------------
  // note: https://daybrush.com/moveable/storybook/?path=/story/snap-bound--bound-drag-rotate-group
  // 组合操作要记得变更x，y的坐标----------
  function groupHandler(e: any, type: 'drag' | 'scale' | 'rotate') {
    if (type === 'scale')
      onScaleGroup(e)
    if (type === 'drag')
      onDragGroup(e)
    if (type === 'rotate')
      onRotateGroup(e)
  }
  function onDragGroup({ events, dist }: any) {
    events.forEach((event: any) => {
      event.target.style.transform = event.style.transform
    })
    const [x, y] = [...dist]
    viewStore.setShowDataTargetForGroup({ x, y })
  }

  function onScaleGroup({ events, dist }: any) {
    events.forEach((event: any) => {
      const transformString = event.style.transform
      // todo: 不允许翻转 moveable的组合完全翻转存在bug
      event.target.style.transform = transformString
    })
    const scale = dist
    viewStore.setShowDataTargetForGroup({ scale })
  }

  function onRotateGroup({ events, dist }: any) {
    events.forEach((event: any) => {
      event.target.style.transform = event.style.transform
    })
    const rotate = dist
    viewStore.setShowDataTargetForGroup({ rotate })
  }
  // !!---------------------------------------------------------------------

  // !!单个组件操作结束--------------------------------------------------------
  function singleEndHandler(e: any, type: 'drag' | 'scale' | 'rotate') {
    if (type === 'scale')
      onScaleEnd(e)
    if (type === 'drag')
      onDragEnd(e)
    if (type === 'rotate')
      onRotateEnd(e)
    setTimeout(() => track())
  }

  function onDragEnd({ lastEvent, target }: any) {
    if (!lastEvent)
      return
    const [dx, dy] = [...lastEvent.dist]
    viewStore.uSetStyle(target, { x: dx, y: dy })
    !isGroup() && viewStore.setShowDataTargetForComp()
  }

  function onRotateEnd({ lastEvent, target }: any) {
    if (!lastEvent)
      return
    const { dx, dy } = uCalcTranslateXY(lastEvent)
    const rotate = lastEvent.rotate
    viewStore.uSetStyle(target, { x: dx, y: dy, rotate })
    !isGroup() && viewStore.setShowDataTargetForComp()
  }

  function onScaleEnd({ lastEvent, target }: any) {
    if (!lastEvent)
      return
    const { dx, dy } = uCalcTranslateXY(lastEvent)
    const scale = [...lastEvent.dist] as [number, number]
    viewStore.uSetStyle(target, { scale, x: dx, y: dy })
    !isGroup() && viewStore.setShowDataTargetForComp()
  }
  // -------------------------------------------------------------------------

  // !!多个组件操作结束---------------------------------------------------------
  function groupEndHandler(e: any, type: 'drag' | 'scale' | 'rotate') {
    if (type === 'scale')
      onScaleGroupEnd(e)
    if (type === 'drag')
      onDragGroupEnd(e)
    if (type === 'rotate')
      onRotateGroupEnd(e)
    setTimeout(() => track())
  }
  function onDragGroupEnd({ events }: any) {
    events.forEach((event: any) => {
      const { lastEvent, target } = event
      if (!lastEvent)
        return
      onDragEnd({ lastEvent, target })
    })
  }

  function onRotateGroupEnd({ events }: any) {
    events.forEach((event: any) => {
      const { lastEvent, target } = event
      if (!lastEvent)
        return
      onRotateEnd({ lastEvent, target })
    })
  }

  function onScaleGroupEnd({ events }: any) {
    events.forEach((event: any) => {
      const { lastEvent, target } = event
      if (!lastEvent)
        return
      onScaleEnd({ lastEvent, target })
    })
  }
  // !!------------------------------------------------------------------------

  // translateXY 转化成 position 的 left 和 top
  /**
     * @param lastEvent    moveable事件的一个属性，里面有一个tranform字符串
     * @param directValue  直接量，用户直接需要处理的tranform字符串 //暂时用不上这个属性，只是写在这里
     * @returns
     */
  function uCalcTranslateXY<T extends { afterTransform: any }>(lastEvent: T, directValue?: string) {
    const regex = /translate\(\s*(-?\d+(?:\.\d+)?)(px)?\s*,\s*(-?\d+(?:\.\d+)?)(px)?\s*\)/
    const match = regex.exec((lastEvent?.afterTransform) || directValue)
    let dx = 0
    let dy = 0
    if (match) {
      dx = parseFloat(match[1])
      dy = parseFloat(match[3])
    }
    return { dx, dy }
  }

  // 用来计算组合操作的xy坐标值
  function uCalcXY() {
    const area = document.getElementsByClassName('moveable-area')[0]!
    const areaRect = area?.getBoundingClientRect()
    const canvas = document.querySelector('#canvas')!
    const canvasRect = canvas.getBoundingClientRect()
    return {
      x: areaRect.left - canvasRect.left,
      y: areaRect.top - canvasRect.top,
    }
  }

  return {
    selectTarget,
    selectComponent,
    clearSelect,
    singleHandler,
    groupHandler,
    singleEndHandler,
    groupEndHandler,
  }
}
