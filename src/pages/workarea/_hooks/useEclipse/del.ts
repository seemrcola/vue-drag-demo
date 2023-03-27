import { useMoveable } from '../useMoveable'
import { useViewStore } from '@/store/modules'
import { isEmpty } from '@/utils/is'

export function useDel() {
  const viewStore = useViewStore()
  const moveable = useMoveable()

  // 删除 DELETE
  function del<T extends Event>(e: T) {
    if (
      e instanceof KeyboardEvent
      && (e.target as HTMLElement).nodeName.toUpperCase() !== 'BODY'
    )
      return
    if (isEmpty(viewStore.taregtSelect))
      return

    // 删除掉views中对应的数据
    const dels = viewStore.taregtSelect
    dels.forEach(comp => viewStore.removeComponent(comp))
    // 处理掉选中框
    moveable.clearSelect()
  }

  return { del }
}
