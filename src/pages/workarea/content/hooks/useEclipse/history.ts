import { useMoveable } from '../useMoveable'
import { useHistoryStore } from '@/store/modules'

export function useHistory() {
  const moveable = useMoveable()
  const { redo: REDO, undo: UNDO } = useHistoryStore()

  function redo(e: KeyboardEvent) {
    REDO(e)
    moveable.clearSelect()
  }
  function undo(e: KeyboardEvent) {
    UNDO(e)
    moveable.clearSelect()
  }

  return {
    undo,
    redo,
  }
}
