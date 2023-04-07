import { defineStore } from 'pinia'
import { useViewStore } from './view'

export const useEventStore = defineStore('event', () => {
  const viewStore = useViewStore()

  function getEvent(): any[] {
    const select = viewStore.taregtSelect
    if (select.length !== 1)
      return []
    else if (!select[0].event)
      return []
    else
      return select[0].event
  }

  function getEventObject() {
    const select = viewStore.taregtSelect
    if (select.length !== 1)
      return null
    return select[0]
  }

  return {
    getEvent,
    getEventObject,
  }
})
