import { cloneDeep } from 'lodash-es'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useViewStore } from './view'

export const useHistoryStore = defineStore('history', () => {
  const viewStore = useViewStore()

  const historyList = ref<any[]>([])
  const pointer = ref<number>(-1)

  function init() {
    historyList.value = []
  }

  function track() {
    // 从当前步到后面的步骤全部清掉
    historyList.value.splice(0, pointer.value + 1)
    // 将当前状态收集进来
    historyList.value.push(cloneDeep(viewStore.components))
    // 指针自加
    pointer.value++
  }

  function undo() {
    // 指针自减
    pointer.value--
    // 画布指向历史记录
    viewStore.components = historyList.value[pointer.value]
  }

  function redo() {
    // 指针自减
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
