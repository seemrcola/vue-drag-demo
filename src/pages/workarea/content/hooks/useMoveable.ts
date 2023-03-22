/*
 * uSetStyle 用来处理单个组件的位置【在拖拽操作结束之后处理】
 * view.setShowDataTarget 用来处理seetings.vue文件展示的数值【在拖拽结束之后处理】
 */
import { ref } from 'vue'
/* 这个hooks需要用到useKeyBoard */
/* 这个hooks需要用到store 改变view里面的属性 */
/* 这种需要以来外部的函数组合，就不写进全局的hooks中 */
import { useViewStore } from '@/store/modules'

export function useMoveable() {
  const selectTarget = ref<string[]>([])
  const viewStore = useViewStore()
  let status: 'comp' | 'group' | undefined

  function getKeyStatus() {
    return {
      isMeta: window.$KeyboardActive.meta,
      isCtrl: window.$KeyboardActive.ctrl,
      isSpace: window.$KeyboardActive.space,
    }
  }

  function selectComponent<T extends { id: string }>(comp: T) {
    const { isMeta, isCtrl } = getKeyStatus()
    const id = `#${(comp).id}`
    // note: 每次必须要更换数组指向，否则不生效，就离谱----
    // 不按住ctrl 或者按住ctrl但是target列表长度为0
    const noCtrl = !isCtrl && !isMeta
    if (noCtrl || (!noCtrl && selectTarget.value.length === 0)) {
      status = 'comp'
      // view中的选中数组处理
      selectTarget.value = [id]
      viewStore.setTarget(id, false) // isGroup = false
      // view中的展示数组处理
      viewStore.setShowDataTargetForComp()
    }
    else {
      status = 'group'
      const ifHasId = selectTarget.value.find(compId => compId === id)
      if (ifHasId)
        return
      // view中的选中数组处理
      selectTarget.value = [...selectTarget.value, id]
      viewStore.setTarget(id, true) // isGroup = true
      // view中的展示数组处理
      setTimeout(() => {
        const { x, y } = uCalcXY()
        viewStore.setShowDataTargetForGroup({ x, y, change: true })
      })
    }
  }

  function dropComponent() {
    console.log('drop')
    selectTarget.value = []
    viewStore.dropComponent()
    viewStore.setShowDataTargetForGroup({ change: true })
  }

  // !!单个组件操作-----------------------------------------------------------
  function onDrag({ transform, target, dist }: any) {
    target.style.transform = transform
    // beta 实时修改右侧坐标
    const [x, y] = dist
    viewStore.setShowDataTargetForComp({ x, y, id: target.id }, 'ing')
  }

  function onScale({ drag, target, dist }: any) {
    target.style.transform = drag.transform
    // beta 实时修改右侧坐标
    const scale = [...dist]
    viewStore.setShowDataTargetForComp({ scale, id: target.id }, 'ing')
  }

  function onRotate({ drag, target, dist }: any) {
    target.style.transform = drag.transform
    // beta 实时修改右侧坐标
    const rotate = dist
    viewStore.setShowDataTargetForComp({ rotate, id: target.id }, 'ing')
  }
  // !!----------------------------------------------------------------------

  // !!组合操作----------------------------------------------------------------
  // note: https://daybrush.com/moveable/storybook/?path=/story/snap-bound--bound-drag-rotate-group
  // 组合操作要记得变更x，y的坐标----------
  function onDragGroup({ events }: any) {
    events.forEach((event: any) => {
      event.target.style.transform = event.style.transform
    })
  }

  function onScaleGroup({ events }: any) {
    events.forEach((event: any) => {
      const transformString = event.style.transform
      // todo: 不允许翻转 moveable的组合完全翻转存在bug
      event.target.style.transform = transformString
    })
  }

  function onRotateGroup({ events }: any) {
    events.forEach((event: any) => {
      event.target.style.transform = event.style.transform
    })
  }
  // !!---------------------------------------------------------------------

  // !!单个组件操作结束--------------------------------------------------------
  function onDragEnd({ lastEvent, target }: any) {
    if (!lastEvent)
      return
    const [dx, dy] = [...lastEvent.dist]
    viewStore.uSetStyle(target, { x: dx, y: dy })
    status === 'comp' && viewStore.setShowDataTargetForComp()
  }

  function onRotateEnd({ lastEvent, target }: any) {
    if (!lastEvent)
      return
    // ----------------这部分是为了处理组合旋转，单个旋转无需考虑translate ------------------
    const { dx, dy } = uCalcTranslateXY(lastEvent)
    // -------------------------------------------------------------------------------
    const rotate = lastEvent.rotate
    viewStore.uSetStyle(target, { x: dx, y: dy, rotate })
    status === 'comp' && viewStore.setShowDataTargetForComp()
  }

  function onScaleEnd({ lastEvent, target }: any) {
    if (!lastEvent)
      return
    // 单个组件缩放会造成坐标xy也有所更改，所以需要额外处理这个情况-------------------
    const { dx, dy } = uCalcTranslateXY(lastEvent)
    // ----------------------------------------------------------------------
    const scale = [...lastEvent.dist] as [number, number]
    viewStore.uSetStyle(target, { scale, x: dx, y: dy })
    status === 'comp' && viewStore.setShowDataTargetForComp()
  }
  // -------------------------------------------------------------------------

  // !!多个组件操作结束---------------------------------------------------------
  function onDragGroupEnd({ events, lastEvent }: any) {
    events.forEach((event: any) => {
      const { lastEvent, target } = event
      if (!lastEvent)
        return
      onDragEnd({ lastEvent, target })
    })
    if (!lastEvent)
      return
    const [x, y] = [...lastEvent.dist]
    viewStore.setShowDataTargetForGroup({ x, y })
  }

  function onRotateGroupEnd({ events, lastEvent }: any) {
    events.forEach((event: any) => {
      const { lastEvent, target } = event
      if (!lastEvent)
        return
      onRotateEnd({ lastEvent, target })
    })
    if (!lastEvent)
      return
    const rotate = lastEvent.rotate
    viewStore.setShowDataTargetForGroup({ rotate })
  }

  function onScaleGroupEnd({ events, lastEvent }: any) {
    events.forEach((event: any) => {
      const { lastEvent, target } = event
      if (!lastEvent)
        return
      onScaleEnd({ lastEvent, target })
    })
    if (!lastEvent)
      return
    const scale = [...lastEvent.dist]
    viewStore.setShowDataTargetForGroup({ scale })
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
    const areaRect = area.getBoundingClientRect()
    const canvas = document.querySelector('#canvas')!
    const canvasRect = canvas.getBoundingClientRect()
    return {
      x: areaRect.left - canvasRect.left,
      y: areaRect.top - canvasRect.top,
    }
  }

  return {
    onRotate,
    onDrag,
    onScale,
    onDragGroup,
    onRotateGroup,
    onScaleGroup,
    onDragEnd,
    onRotateEnd,
    onScaleEnd,
    onDragGroupEnd,
    onRotateGroupEnd,
    onScaleGroupEnd,
    selectTarget,
    selectComponent,
    dropComponent,
  }
}
