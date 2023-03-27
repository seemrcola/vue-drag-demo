import { useMoveable } from '../useMoveable'
import { useHistoryStore } from '@/store/modules'

export function useHistory() {
  const moveable = useMoveable()
  const { redo: REDO, undo: UNDO } = useHistoryStore()

  function redo<T extends Event>(e: T) {
    REDO(e)
    moveable.clearSelect()
  }
  function undo<T extends Event>(e: T) {
    UNDO(e)
    moveable.clearSelect()
  }

  return {
    undo,
    redo,
  }
}
