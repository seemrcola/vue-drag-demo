import { useSingleEnd } from './singleEnd'
import { useHistoryStore, useViewStore } from '@/store/modules'

export function useGroupEnd() {
  const { track } = useHistoryStore()
  const viewStore = useViewStore()
  const { onScaleEnd, onRotateEnd, onDragEnd } = useSingleEnd()

  function groupEndHandler(e: any, type: 'drag' | 'scale' | 'rotate') {
    if (viewStore.taregtSelect.some(comp => comp.lock))
      return

    if (type === 'scale')
      onScaleGroupEnd(e)
    if (type === 'drag')
      onDragGroupEnd(e)
    if (type === 'rotate')
      onRotateGroupEnd(e)
    setTimeout(() => track())
  }

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

  return {
    groupEndHandler,
  }
}
