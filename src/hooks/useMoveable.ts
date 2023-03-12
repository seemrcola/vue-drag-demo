import { ref } from 'vue'

/* 这个hooks需要用到store 改变view里面的属性 */
import { useViewStore } from '@/store/modules'

export function useMoveable() {
  const selectTarget = ref<string[]>([])
  /* 这个hooks需要用到useKeyBoard */
  function getKeyStatus() {
    return {
      isMeta: window.$KeyboardActive!.meta,
      isCtrl: window.$KeyboardActive!.ctrl,
    }
  }

  function selectComponent<T extends { id: string }>(comp: T) {
    const { isMeta, isCtrl } = getKeyStatus()
    const id = `#${(comp).id}`

    // note: 每次必须要更换数组指向，否则不生效，就离谱
    // 不按住ctrl
    if (!isCtrl && !isMeta) {
      selectTarget.value = [id]
    }
    // todo：按住ctrl进行多选【搁置中...】
    else {
      const ifHasId = selectTarget.value.find(compId => compId === id)
      if (!ifHasId)
        selectTarget.value = [...selectTarget.value, id]
    }

    // 改变一下viewStore的selectTarget
    const viewStore = useViewStore()
    viewStore.setTarget(id)
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
  function onDragGroup({ events }: any) {
    events.forEach((event: any) => {
      event.target.style.transform = event.style.transform
    })
  }

  function onScaleGroup({ events }: any) {
    events.forEach((event: any) => {
      const transformString = event.style.transform

      // const scaleRegex = /transform:\s*scale\((\d*\.?\d+),\s*(\d*\.?\d+)\);/
      // const match = transformString.match(scaleRegex)
      // let x = 0
      // let y = 0
      // if (match) {
      //   x = parseFloat(match[1])
      //   y = parseFloat(match[2])
      // }
      // if (x < 0 || y < 0) { // moveable存在bug，组合拖拽不能完全反转
      //   alert('暂时无法完全反转')
      //   return
      // }

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
  }

  function onRotateEnd({ lastEvent, target }: any) {
    if (!lastEvent)
      return
    // target.style.transform = 'translate(0px, 0px)' // 来自gpt的方案，放止多次更新值造成双倍位移
    const regex = /translate\(\s*(-?\d+(?:\.\d+)?)(px)?\s*,\s*(-?\d+(?:\.\d+)?)(px)?\s*\)/
    const match = regex.exec(lastEvent.afterTransform)
    let dx = 0
    let dy = 0
    if (match) {
      dx = parseFloat(match[1])
      dy = parseFloat(match[3])
    }
    const rotate = lastEvent.rotate
    uSetStyle(target, { dx, dy, rotate })
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
  }
  // -------------------------------------------------------------------------

  // ！！多个组件操作结束---------------------------------------------------------
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
  // ----------------------------------------------------------------------

  // 用来改变组件的样式 transform to absolute 以及改变views.components记录的值
  function uSetStyle(
    target: HTMLElement,
    delta: { [propname: string]: any },
  ) {
    // debugger
    const id = target.id
    const viewStore = useViewStore()
    // 拿到targetComponent
    const targetComponent = viewStore.getTarget(`#${id}`)
    console.log(JSON.parse(JSON.stringify(targetComponent)))
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
  }
}
