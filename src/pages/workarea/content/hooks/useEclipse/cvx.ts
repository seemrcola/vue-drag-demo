import { cloneDeep } from 'lodash-es'
import { v4 as uuid } from 'uuid'
import { ref } from 'vue'
import { isEmpty } from '@/utils/is'
import { useViewStore } from '@/store/modules'
import type { IComponent } from '@/store/modules/view'

export function useCVX() {
  const viewStore = useViewStore()
  const cacheComponents = ref<IComponent[]>([])
  // 复制 COPY
  function copy(e: KeyboardEvent) {
    const cache = viewStore.taregtSelect
    console.log(cache)
    if (isEmpty(cache))
      return
    cacheComponents.value = cache
  }
  // 粘贴 PASTE
  function paste(e: KeyboardEvent) {
    if (isEmpty(cacheComponents.value))
      return
    if ((e.target as HTMLElement).nodeName.toUpperCase() !== 'BODY')
      return
    const added = cacheComponents.value!
      .map((comp: IComponent) => {
        comp = cloneDeep(comp)
        comp.id = `wrapper${uuid().split('-')[0]}`
        comp.x += 5
        comp.y += 5
        return comp
      })
    console.log(added)
    added.forEach(comp => viewStore.addComponent(comp))
  }

  return {
    copy,
    paste,
  }
}
