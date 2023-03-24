import { useHistoryStore } from '@/store/modules'

export function useHistory() {
  const { redo, undo } = useHistoryStore()
  return {
    undo,
    redo,
  }
}
