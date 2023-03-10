import type { Ref } from 'vue'
import { ref } from 'vue'
/* 这个hooks需要用到store 改变view里面的属性 */
import type { VueMoveableInstance } from 'vue3-moveable'
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
    // gpt方案，重置一下translate，以免control box双倍位移
    target.style.transform = 'translate(0px, 0px)'
    uSetStyle(target, lastEvent.translate)
    moveableRef.value!.updateRect()
  }

  function onRotateEnd({ lastEvent, target }: any) {

  }

  function onScaleEnd({ lastEvent, target }: any) {

  }

  function uSetStyle(target: HTMLElement, transform: number[]) {
    const viewStore = useViewStore()
    // 拿到targetComponent
    const targetComponent = viewStore.getTarget(selectTarget.value[0])
    // 拿到transform对应属性
    const [x, y, rotate, scale] = transform

    // 处理targetComponent的属性
    targetComponent!.x += x
    targetComponent!.y += y

    // 通过对象实例改变对象style.position的属性
    target.style.top = `${targetComponent!.y}px`
    target.style.left = `${targetComponent!.x}px`
    target.style.transform = `rotate(${rotate}deg))` // scale(${scale}
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
