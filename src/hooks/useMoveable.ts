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
      isSpace: window.$KeyboardActive!.space,
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
    // todo: 当space按下，使用等比缩放
    // const { isSpace } = getKeyStatus()
    // if (isSpace)
    //   return onEqualScale({ drag, target })
    target.style.transform = drag.transform
  }

  function onRotate({ drag, target }: any) {
    target.style.transform = drag.transform
  }

  // function onEqualScale({ drag, target }: any) {
  //   console.log('uiuiuiiuiiu')
  //   const regex = /scale\(\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*\)/
  //   const transformValue = drag.transform
  //   console.log(transformValue, 'opopop')
  //   const match = regex.exec(transformValue)
  //   let scaleX = 0
  //   let scaleY = 0
  //   let scale = 0
  //   if (match) {
  //     scaleX = parseFloat(match[1])
  //     scaleY = parseFloat(match[2])
  //   }
  //   const { min, abs } = Math
  //   scale = min(abs(scaleX), abs(scaleY))
  //   target.style.transform = transformValue
  //   target.style.cssText += `transform: scale(${scale})`
  // }
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
      // todo: 不允许翻转
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
