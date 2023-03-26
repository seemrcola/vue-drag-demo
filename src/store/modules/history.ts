import { defineStore } from 'pinia'
import { ref } from 'vue'
import { cloneDeep } from 'lodash-es'
import type { IComponent } from './view'
import { useViewStore } from './view'

const historyList = ref<IComponent[][]>([[]])
const pointer = ref<number>(0)

export const useHistoryStore = defineStore('history', () => {
  const viewStore = useViewStore()

  function init() {
    historyList.value = []
  }

  function track() {
    // 删除当前状态之后的所有状态
    historyList.value.splice(pointer.value + 1)
    // 将当前状态收集进来
    const disk = (cloneDeep(viewStore.components))
    historyList.value.push(disk)
    // 指针自加
    pointer.value++
  }

  function undo(e: KeyboardEvent) {
    e.preventDefault()
    if (pointer.value <= 0)
      return viewStore.components = []
    // 指针自减
    pointer.value--
    // 画布指向历史记录
    const current = historyList.value[pointer.value]
    viewStore.components = current
  }

  function redo(e: KeyboardEvent) {
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
