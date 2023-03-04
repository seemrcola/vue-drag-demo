import { ref } from 'vue'

export function useMoveable() {
  const selectTarget = ref<string>('')

  function selectComponent<T extends { id: string }>(comp: T) {
    selectTarget.value = `#${(comp).id}`
  }

  function dropComponent() {
    console.log('fdfdxxxxxxxxs')
    selectTarget.value = ''
  }

  function getDom() {
    return document.querySelector(selectTarget.value) as HTMLSelectElement
  }

  function onDrag({ transform }: any) {
    const target = getDom()
    target.style.transform = transform
  }

  function onScale({ drag }: any) {
    const target = getDom()
    target.style.transform = drag.transform
  }

  function onRotate({ drag }: any) {
    const target = getDom()
    target.style.transform = drag.transform
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
