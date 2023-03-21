import type { VueMoveableInstance } from 'vue3-moveable'
import { ref } from 'vue'
import { useViewStore } from '@/store/modules'

export function useMove() {
  const viewStore = useViewStore()
  const moveableRef = ref<VueMoveableInstance>()

  // 组件左移
  function left(e: KeyboardEvent) {
    e.preventDefault()
    viewStore.taregtSelect.forEach(comp => comp.x -= 1)
    viewStore.showDataTarget.x! -= 1
    moveableRef.value?.updateTarget()
  }
  // 组件右移
  function right(e: KeyboardEvent) {
    e.preventDefault()
    viewStore.taregtSelect.forEach(comp => comp.x += 1)
    viewStore.showDataTarget.x! += 1
    moveableRef.value?.updateTarget()
  }
  // 组件上移
  function up(e: KeyboardEvent) {
    e.preventDefault()
    viewStore.taregtSelect.forEach(comp => comp.y -= 1)
    viewStore.showDataTarget.y! -= 1
    moveableRef.value?.updateTarget()
  }
  // 组件下移
  function down(e: KeyboardEvent) {
    e.preventDefault()
    viewStore.taregtSelect.forEach(comp => comp.y += 1)
    viewStore.showDataTarget.y! += 1
    moveableRef.value?.updateTarget()
  }

  function setMoveableRef(ref: VueMoveableInstance) {
    moveableRef.value = ref
  }

  return {
    left, up, right, down, setMoveableRef,
  }
}
