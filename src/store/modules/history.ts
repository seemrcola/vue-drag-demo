import { defineStore } from 'pinia'
import { ref } from 'vue'
import { cloneDeep } from 'lodash-es'
import type { IComponent } from './view'
import { useViewStore } from './view'

export const useHistoryStore = defineStore('history', () => {
  const viewStore = useViewStore()
  const historyList = ref<IComponent[][]>([[]])
  const pointer = ref<number>(0)

  function init() {
    historyList.value = []
  }

  function track() {
    // 删除当前状态之后的所有状态
    historyList.value.splice(pointer.value + 1)
    // 将当前状态收集进来
    const snapshoot = (cloneDeep(viewStore.components))
    historyList.value.push(snapshoot)
    // 指针自加
    pointer.value++
  }

  function undo<T extends Event>(e: T) {
    e.preventDefault()
    if (pointer.value <= 0)
      return viewStore.components = []
    // 指针自减
    pointer.value--
    // 画布指向历史记录
    const current = historyList.value[pointer.value]
    viewStore.components = current
  }

  function redo<T extends Event>(e: T) {
    e.preventDefault()
    // 指针自加
    if (pointer.value >= historyList.value.length - 1)
      return
    pointer.value++
    // 画布指向历史记录
    viewStore.components = historyList.value[pointer.value]
  }

  return {
    init,
    track,
    redo,
    undo,
  }
})
