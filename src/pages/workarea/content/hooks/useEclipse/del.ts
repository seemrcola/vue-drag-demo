import { useMoveable } from '../useMoveable'
import { useViewStore } from '@/store/modules'
import { isEmpty } from '@/utils/is'

export function useDel() {
  const viewStore = useViewStore()

  // 删除 DELETE
  function del(e: KeyboardEvent) {
    if ((e.target as HTMLElement).nodeName.toUpperCase() !== 'BODY')
      return
    if (isEmpty(viewStore.taregtSelect))
      return

    const dels = viewStore.taregtSelect
    dels.forEach(comp => viewStore.removeComponent(comp))
    const { dropComponent } = useMoveable() // 这个清空要调用useMoveable的方法
    dropComponent()

    // fixme control-box不消失，只好强制让他消失了
    const controlElement = document.querySelector('.moveable-control-box') as HTMLElement
    controlElement.style.display = 'none'
  }

  return { del }
}
