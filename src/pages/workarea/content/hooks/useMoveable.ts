/*
 * uSetStyle 用来处理单个组件的位置【在拖拽操作结束之后处理】
 * view.setShowDataTarget 用来处理seetings.vue文件展示的数值【在拖拽结束之后处理】
 */
import { nextTick, ref, watch } from 'vue'
/* 这个hooks需要用到useKeyBoard */
/* 这个hooks需要用到store 改变view里面的属性 */
/* 这种需要以来外部的函数组合，就不写进全局的hooks中 */
import type { VueMoveableInstance } from 'vue3-moveable'
import { useViewStore } from '@/store/modules'

export function useMoveable() {
  const selectTarget = ref<string[]>([])
  const viewStore = useViewStore()
  const moveableRef = ref<VueMoveableInstance>()
  const moveableType = ref<'comp' | 'group'>('comp')

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

    // note: 每次必须要更换数组指向，否则不生效，就离谱
    // 不按住ctrl
    if (!isCtrl && !isMeta) {
      selectTarget.value = [id]
      viewStore.setTarget(id, false) // isGroup = false
    }
    else {
      const ifHasId = selectTarget.value.find(compId => compId === id)
      if (!ifHasId) {
        selectTarget.value = [...selectTarget.value, id]
        viewStore.setTarget(id, true) // isGroup = true
      }
    }
  }

  function dropComponent() {
    selectTarget.value = []
  }

  // ！！单个组件操作-----------------------------------------------------------
  function onDrag({ transform, target }: any) {
    target.style.transform = transform
  }

  function onScale({ drag, target }: any) {
    target.style.transform = drag.transform
  }

  function onRotate({ drag, target }: any) {
    target.style.transform = drag.transform
  }
  // -------------------------------------------------------------------------

  // ！！组合操作----------------------------------------------------------------
  // note: https://daybrush.com/moveable/storybook/?path=/story/snap-bound--bound-drag-rotate-group
  // 组合操作要变更x，y的坐标
  watch(
    () => selectTarget.value,
    (n) => {
      const len = n.length
      // 当选中的数量小于2，代表不是组合，展示数据直接展示选中的组件即可
      if (len < 2) {
        moveableType.value = 'comp'
        viewStore.setShowDataTarget(null, 'comp')
        return
      }
      moveableType.value = 'group'
      nextTick(() => {
        const { x, y } = calcXY()
        const showData = { x, y, rotate: 0, scaleX: 0, scaleY: 0 }
        viewStore.setShowDataTarget(showData, 'group')
      })
    },
  )
  // 用来计算组合操作的xy坐标值
  function calcXY() {
    const area = moveableRef.value!.getRect()
    return {
      x: area.left,
      y: area.top,
    }
  }

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
  // -------------------------------------------------------------------------

  // ！！单个组件操作结束--------------------------------------------------------
  function onDragEnd({ lastEvent, target }: any) {
    if (!lastEvent)
      return
    // target.style.transform = 'translate(0px, 0px)' // 来自gpt的方案，放止多次更新值造成双倍位移
    const [dx, dy] = [...lastEvent.dist]
    uSetStyle(target, { dx, dy })
    if (moveableType.value === 'comp')
      viewStore.setShowDataTarget({ x: dx, y: dy }, 'comp')
  }

  function onRotateEnd({ lastEvent, target }: any) {
    if (!lastEvent)
      return
    // target.style.transform = 'translate(0px, 0px)' // 来自gpt的方案，放止多次更新值造成双倍位移
    // ----------------这部分是为了处理组合旋转，单个旋转无需考虑translate ------------------
    const regex = /translate\(\s*(-?\d+(?:\.\d+)?)(px)?\s*,\s*(-?\d+(?:\.\d+)?)(px)?\s*\)/
    const match = regex.exec(lastEvent.afterTransform)
    let dx = 0
    let dy = 0
    if (match) {
      dx = parseFloat(match[1])
      dy = parseFloat(match[3])
    }
    // -------------------------------------------------------------------------------
    const rotate = lastEvent.rotate
    uSetStyle(target, { dx, dy, rotate })
    if (moveableType.value === 'comp')
      viewStore.setShowDataTarget({ x: dx, y: dy, rotate }, 'comp')
  }

  function onScaleEnd({ lastEvent, target }: any) {
    if (!lastEvent)
      return

    // target.style.transform = 'translate(0px, 0px)' // 来自gpt的方案，放止多次更新值造成双倍位移
    // 单个组件缩放会造成坐标xy也有所更改，所以需要额外处理这个情况
    const regex = /translate\(\s*(-?\d+(?:\.\d+)?)(px)?\s*,\s*(-?\d+(?:\.\d+)?)(px)?\s*\)/
    const match = regex.exec(lastEvent.afterTransform)
    const scale = [...lastEvent.dist]
    let dx = 0
    let dy = 0
    if (match) {
      dx = parseFloat(match[1])
      dy = parseFloat(match[3])
    }
    uSetStyle(target, { scale, dx, dy })
    if (moveableType.value === 'comp')
      viewStore.setShowDataTarget({ x: dx, y: dy, scaleX: scale[0], scaleY: scale[1] }, 'comp')
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
    // console.log(lastEvent, 'drag')
    const [x, y] = [...lastEvent.dist]
    viewStore.setShowDataTarget({ x, y }, 'group')
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
    // console.log(lastEvent, 'rotate')
    const rotate = lastEvent.rotate
    viewStore.setShowDataTarget({ rotate }, 'group')
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
    const [scaleX, scaleY] = [...lastEvent.dist]
    viewStore.setShowDataTarget({ scaleX, scaleY }, 'group')
  }
  // ------------------------------------------------------------------------

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
