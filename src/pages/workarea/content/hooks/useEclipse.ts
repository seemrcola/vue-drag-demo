import type { VueMoveableInstance } from 'vue3-moveable'
import { ref } from 'vue'
import { useMoveable } from './useMoveable'
import { useViewStore } from '@/store/modules'
import { KeyCodeEnum } from '@/enum/keyboard.enum'

// fixme 上下左右的移动第一次总会先移动组件再移动controller容器
export function useEclipse() {
  const viewStore = useViewStore()
  const moveableRef = ref<VueMoveableInstance>()
  // execEcplise 执行组合快捷键 & 非组合快捷键
  function execEcplise(keycode: number, e: KeyboardEvent) {
    // 功能键是否按下
    const isCtrlActive = isCtrl()
    if (isCtrlActive) {
      switch (keycode) {
        case KeyCodeEnum.COPY:
          copy()
          break
        case KeyCodeEnum.PASTE:
          paste()
          break
        default:
          void 0
      }
    }
    else {
      console.log('非组合')
      switch (keycode) {
        case KeyCodeEnum.DELETE: // 删除组件
          del(e)
          break
        case KeyCodeEnum.MACDEL: // mac端删除组件
          del(e)
          break
        case KeyCodeEnum.LEFT: // 组件左移
          left(e)
          break
        case KeyCodeEnum.RIGHT: // 组件右移
          right(e)
          break
        case KeyCodeEnum.UP: // 组件上移
          up(e)
          break
        case KeyCodeEnum.DOWN: // 组件下移
          down(e)
          break
        default:
          void 0
      }
    }
  }
  // 复制 COPY
  function copy() {
  }
  // 粘贴 PASTE
  function paste() {
  }
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
  // 删除 DELETE
  function del(e: KeyboardEvent) {
    const { dropComponent } = useMoveable()
    const dels = viewStore.taregtSelect
    dels.forEach(comp => viewStore.removeComponent(comp))
    dropComponent()
    // fixme control-box不消失，只好强制让他消失了
    const controlElement = document.querySelector('.moveable-control-box') as HTMLElement
    controlElement.style.display = 'none'
  }

  function isCtrl() {
    const { ctrl, meta } = window.$KeyboardActive
    return ctrl || meta
  }

  function listener(e: KeyboardEvent) {
    const code = Object.values(KeyCodeEnum).find(code => e.keyCode === code)
    if (code && typeof code === 'number')
      execEcplise(code, e) // 即使判断了isNumber当时并不会类型收窄 那就不用工具函数了 直接typeof
  }

  function setMoveableRef(ref: VueMoveableInstance) {
    moveableRef.value = ref
  }

  return {
    listener,
    setMoveableRef,
  }
}
