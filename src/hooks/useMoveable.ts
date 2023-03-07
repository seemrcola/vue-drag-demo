import { ref } from 'vue'

/* 这个hooks需要用到useKeyBoard */
console.log(window.$KeyboardActive, 'xxxx')

export function useMoveable() {
  const selectTarget = ref<string[]>([])

  function getKeyStatus() {
    return {
      isMeta: window.$KeyboardActive!.meta,
      isCtrl: window.$KeyboardActive!.ctrl,
    }
  }

  function selectComponent<T extends { id: string }>(comp: T) {
    const { isMeta, isCtrl } = getKeyStatus()
    const id = `#${(comp).id}`

    if (!isCtrl && !isMeta) {
      selectTarget.value = []
      selectTarget.value.push(id)
    }
    else {
      const ifHasId = selectTarget.value.find(compId => compId === id)
      !ifHasId && selectTarget.value.push(id)
    }
    console.log(selectTarget.value)
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

  return {
    onRotate,
    onDrag,
    onScale,
    selectTarget,
    selectComponent,
    dropComponent,
  }
}
