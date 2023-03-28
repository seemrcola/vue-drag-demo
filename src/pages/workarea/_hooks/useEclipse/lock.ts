import { useViewStore } from '@/store/modules'
import { isEmpty } from '@/utils/is'

export function useLock() {
  const viewStore = useViewStore()

  // 锁定 LOCK
  function lock<T extends Event>(e: T) {
    console.log('lock')
    if (e instanceof KeyboardEvent && (e.target as HTMLElement).nodeName.toUpperCase() !== 'BODY')
      return
    if (isEmpty(viewStore.taregtSelect))
      return

    e.preventDefault()
    const locks = viewStore.taregtSelect
    locks.forEach(comp => comp.lock = true)
  }

  // 锁定 LOCK
  function unlock<T extends Event>(e: T) {
    console.log('unlock')
    if (e instanceof KeyboardEvent && (e.target as HTMLElement).nodeName.toUpperCase() !== 'BODY')
      return
    if (isEmpty(viewStore.taregtSelect))
      return

    e.preventDefault()
    const locks = viewStore.taregtSelect
    locks.forEach(comp => comp.lock = false)
  }

  return {
    lock,
    unlock,
  }
}
