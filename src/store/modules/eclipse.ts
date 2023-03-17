import type { VueMoveableInstance } from 'vue3-moveable'
import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useViewStore } from './view'
import { KeyCodeEnum } from '@/enum/keyboard.enum'

// fixme 这里设计的有点问题，这个store需要使用到hooks的功能
import { useMoveable } from '@/pages/workarea/content/hooks/useMoveable'

export const useEclipseStore = defineStore('eclipse', () => {
  const viewStore = useViewStore()
  const moveableRef = ref<VueMoveableInstance>()
  // execEcplise 执行组合快捷键 & 非组合快捷键
  function execEcplise(keycode: number) {
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
        case KeyCodeEnum.DELETE || KeyCodeEnum.MACDEL:
          del()
          break
        default:
          void 0
      }
    }
    else {
      console.log('非组合')
      switch (keycode) {
        case KeyCodeEnum.DELETE:
          del()
          break
        case KeyCodeEnum.MACDEL:
          del()
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
  // 删除 DELETE
  function del() {
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
      execEcplise(code) // 即使判断了isNumber当时并不会类型收窄 那就不用工具函数了 直接typeof
  }

  function setMoveableRef(ref: VueMoveableInstance) {
    moveableRef.value = ref
  }

  return {
    listener,
    setMoveableRef,
  }
})
