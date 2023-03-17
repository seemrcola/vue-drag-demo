import { defineStore } from 'pinia'
import { useViewStore } from './view'

export const useEclipseStore = defineStore('eclipse', () => {
  const viewStore = useViewStore()
  // 复制
  function copy() {

  }
  return {
    copy,
  }
})
