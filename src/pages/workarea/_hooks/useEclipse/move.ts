import type { VueMoveableInstance } from 'vue3-moveable'
import { ref } from 'vue'
import { useCoord, useViewStore } from '@/store/modules'

// fixme 上下左右的移动第一次总会先移动组件再移动controller容器
export function useMove() {
  const viewStore = useViewStore()
  const coordStore = useCoord()
  const moveableRef = ref<VueMoveableInstance>()

  // 组件左移
  function left(e: KeyboardEvent) {
    e.preventDefault()
    viewStore.taregtSelect.forEach(comp => comp.x -= 1)
    coordStore.showDataTarget.x! -= 1
    moveableRef.value?.updateTarget()
  }
  // 组件右移
  function right(e: KeyboardEvent) {
    e.preventDefault()
    viewStore.taregtSelect.forEach(comp => comp.x += 1)
    coordStore.showDataTarget.x! += 1
    moveableRef.value?.updateTarget()
  }
  // 组件上移
  function up(e: KeyboardEvent) {
    e.preventDefault()
    viewStore.taregtSelect.forEach(comp => comp.y -= 1)
    coordStore.showDataTarget.y! -= 1
    moveableRef.value?.updateTarget()
  }
  // 组件下移
  function down(e: KeyboardEvent) {
    e.preventDefault()
    viewStore.taregtSelect.forEach(comp => comp.y += 1)
    coordStore.showDataTarget.y! += 1
    moveableRef.value?.updateTarget()
  }

  function injectMoveRef(ref: VueMoveableInstance) {
    moveableRef.value = ref
  }

  return {
    left,
    up,
    right,
    down,
    injectMoveRef,
  }
}
