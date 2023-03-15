/*
 * uSetStyle 用来处理单个组件的位置【在拖拽操作结束之后处理】
 * view.setShowDataTarget 用来处理seetings.vue文件展示的数值【在拖拽结束之后处理】
 */
import { ref } from 'vue'
/* 这个hooks需要用到useKeyBoard */
/* 这个hooks需要用到store 改变view里面的属性 */
/* 这种需要以来外部的函数组合，就不写进全局的hooks中 */
import type { VueMoveableInstance } from 'vue3-moveable'
import { useViewStore } from '@/store/modules'

export function useMoveable() {
  const selectTarget = ref<string[]>([])
  const viewStore = useViewStore()
  const moveableRef = ref<VueMoveableInstance>()
  let status: 'comp' | 'group' | undefined

  function getKeyStatus() {
    return {
      isMeta: window.$KeyboardActive!.meta,
      isCtrl: window.$KeyboardActive!.ctrl,
      isSpace: window.$KeyboardActive!.space,
    }
  }

  function setMoveableRef(ref: VueMoveableInstance) {
    moveableRef.value = ref
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
      viewStore.setShowDataTargetForComp() // 相同就不操作了，要不会造成点击坐标就变
    }
    else {
      status = 'group'
      const ifHasId = selectTarget.value.find(compId => compId === id)
      if (!ifHasId) {
        // view中的选中数组处理
        selectTarget.value = [...selectTarget.value, id]
        viewStore.setTarget(id, true) // isGroup = true
        // view中的展示数组处理
        setTimeout(() => {
          const { x, y } = uCalcXY()
          console.log(x, y, 'klklklkl')
          // todo
          viewStore.setShowDataTargetForGroup({ x, y, change: true })
        })
      }
    }
  }

  function dropComponent() {
    selectTarget.value = []
    // todo
  }

  // !!单个组件操作-----------------------------------------------------------
  function onDrag({ transform, target }: any) {
    target.style.transform = transform
  }

  function onScale({ drag, target }: any) {
    target.style.transform = drag.transform
  }

  function onRotate({ drag, target }: any) {
    target.style.transform = drag.transform
  }
  // !!-------------------------------------------------------------------------

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
  // !!-------------------------------------------------------------------------

  // !!单个组件操作结束--------------------------------------------------------
  function onDragEnd({ lastEvent, target }: any) {
    if (!lastEvent)
      return
    // target.style.transform = 'translate(0px, 0px)' // 来自gpt的方案，放止多次更新值造成双倍位移
    const [dx, dy] = [...lastEvent.dist]
    uSetStyle(target, { dx, dy })
    status === 'comp' && viewStore.setShowDataTargetForComp()
  }

  function onRotateEnd({ lastEvent, target }: any) {
    if (!lastEvent)
      return
    // ----------------这部分是为了处理组合旋转，单个旋转无需考虑translate ------------------
    const { dx, dy } = uCalcTranslateXY(lastEvent)
    // -------------------------------------------------------------------------------
    const rotate = lastEvent.rotate
    uSetStyle(target, { dx, dy, rotate })
    status === 'comp' && viewStore.setShowDataTargetForComp()
  }

  function onScaleEnd({ lastEvent, target }: any) {
    if (!lastEvent)
      return

    // 单个组件缩放会造成坐标xy也有所更改，所以需要额外处理这个情况-------------------
    const { dx, dy } = uCalcTranslateXY(lastEvent)
    // ----------------------------------------------------------------------
    const scale = [...lastEvent.dist]
    uSetStyle(target, { scale, dx, dy })
    status === 'comp' && viewStore.setShowDataTargetForComp()
  }
  // -------------------------------------------------------------------------

  // ！！多个组件操作结束---------------------------------------------------------
  function onDragGroupEnd({ events, lastEvent }: any) {
    events.forEach((event: any) => {
      const { lastEvent, target } = event
      if (!lastEvent)
        return
      onDragEnd({ lastEvent, target })
    })
    if (!lastEvent)
      return
    console.log(lastEvent, 'drag')
    const [x, y] = [...lastEvent.dist]
    // todo
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
    console.log(lastEvent, 'rotate')
    const rotate = lastEvent.rotate
    // const { dx, dy } = uCalcTranslateXY(lastEvent)
    // todo
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
    // console.log(lastEvent, 'scale')
    const scale = [...lastEvent.dist]
    // const { dx, dy } = uCalcTranslateXY(lastEvent)
    // todo
    viewStore.setShowDataTargetForGroup({ scale })
  }
  // !!------------------------------------------------------------------------

  // 用来改变组件的样式 transform to absolute 以及改变views.components记录的值
  function uSetStyle(
    target: HTMLElement,
    delta: { [propname: string]: any },
  ) {
    // debugger
    const id = target.id
    // 拿到targetComponent
    const targetComponent = viewStore.getTarget(`#${id}`)
    // 拿到transform对应属性
    const { dx, dy, rotate, scale } = delta

    // 处理targetComponent的属性
    if (dx)
      targetComponent!.x += dx
    if (dy)
      targetComponent!.y += dy
    if (rotate)
      targetComponent!.rotate = rotate
    if (scale) {
      targetComponent!.scale[0] *= scale[0]
      targetComponent!.scale[1] *= scale[1]
    }
    // 通过对象实例改变对象style.position的属性
    const [scalex = 1, scaley = 1] = targetComponent!.scale
    target.style.top = `${targetComponent!.y}px`
    target.style.left = `${targetComponent!.x}px`
    target.style.transform = `rotate(${targetComponent!.rotate}deg) scale(${scalex}, ${scaley})`
  }

  // translateXY 转化成 position 的 left 和 top
  function uCalcTranslateXY(lastEvent: any) {
    const regex = /translate\(\s*(-?\d+(?:\.\d+)?)(px)?\s*,\s*(-?\d+(?:\.\d+)?)(px)?\s*\)/
    const match = regex.exec(lastEvent.afterTransform)
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
    console.log(canvasRect, areaRect, 'uuiuiuiiu')
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
    setMoveableRef,
  }
}
