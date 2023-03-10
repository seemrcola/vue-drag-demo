import type { Ref } from 'vue'
import { ref } from 'vue'
import type { VueMoveableInstance } from 'vue3-moveable'

/* 这个hooks需要用到store 改变view里面的属性 */
import { useViewStore } from '@/store/modules'

export function useMoveable(moveableRef: Ref<null | VueMoveableInstance>) {
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

  function getDom() {
    return selectTarget.value.map((domId) => {
      return document.querySelector(domId) as HTMLSelectElement
    })
  }

  function onDrag({ transform }: any) {
    const target = getDom()
    target.forEach(el => el.style.transform = transform)
    console.log(999)
  }

  function onScale({ drag }: any) {
    const target = getDom()
    target.forEach(el => el.style.transform = drag.transform)
  }

  function onRotate({ drag }: any) {
    const target = getDom()
    target.forEach(el => el.style.transform = drag.transform)
  }

  function onDragEnd({ lastEvent, target }: any) {
    if (!lastEvent)
      return
    target as HTMLElement
    target.style.transform = 'translate(0px, 0px)' // 来自gpt的方案，放止多次更新值造成双倍位移
    const [dx, dy] = [...lastEvent.dist]
    uSetStyle(target, { dx, dy })
  }

  function onRotateEnd({ lastEvent, target }: any) {
    if (!lastEvent)
      return
    target as HTMLElement
    target.style.transform = 'translate(0px, 0px)'
    const rotate = lastEvent.rotate
    uSetStyle(target, { rotate })
  }

  function onScaleEnd({ lastEvent, target }: any) {
    if (!lastEvent)
      return
    target as HTMLElement
    target.style.transform = 'translate(0px, 0px)'
    const regex = /translate\(\s*(-?\d+(?:\.\d+)?)(px)?\s*,\s*(-?\d+(?:\.\d+)?)(px)?\s*\)/
    const match = regex.exec(lastEvent.afterTransform)
    const scale = [...lastEvent.dist]
    let dx = 0
    let dy = 0
    if (match) {
      dx = parseFloat(match[1])
      dy = parseFloat(match[3])
    }
    console.log(dx, dy)
    uSetStyle(target, { scale, dx, dy })
  }

  function uSetStyle(
    target: HTMLElement,
    delta: { [propname: string]: any },
  ) {
    const viewStore = useViewStore()
    // 拿到targetComponent
    const targetComponent = viewStore.getTarget(selectTarget.value[0])
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
    onDragEnd,
    onRotateEnd,
    onScaleEnd,
    selectTarget,
    selectComponent,
    dropComponent,
  }
}
