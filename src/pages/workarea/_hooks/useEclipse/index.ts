import type { VueMoveableInstance } from 'vue3-moveable'
import { ref } from 'vue'
import { useMove } from './move'
import { useCVX } from './cvx'
import { useDel } from './del'
import { useHistory } from './history'
import { KeyCodeEnum } from '@/enum/keyboard.enum'

export function useEclipse() {
  const moveableRef = ref<VueMoveableInstance>()

  // 各个功能快捷键
  const { del } = useDel()
  const { copy, paste } = useCVX()
  const { left, right, up, down, injectMoveRef } = useMove()
  const { redo, undo } = useHistory()

  // execEcplise 执行组合快捷键 & 非组合快捷键
  function execEcplise(keycode: number, e: KeyboardEvent) {
    // 功能键是否按下
    const isCtrlActive = isCtrl()
    if (isCtrlActive) {
      switch (keycode) {
        case KeyCodeEnum.COPY:
          copy(e)
          break
        case KeyCodeEnum.PASTE:
          paste(e)
          break
        case KeyCodeEnum.UNDO:
          undo(e)
          break
        case KeyCodeEnum.REDO:
          redo(e)
          break
        default:
          void 0
      }
    }
    else {
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

  function isCtrl() {
    const { ctrl, meta } = window.$KeyboardActive
    return ctrl || meta
  }

  // 做一个传递
  function setMoveableRef(ref: VueMoveableInstance) {
    moveableRef.value = ref
    injectMoveRef(moveableRef.value)
  }

  function listener(e: KeyboardEvent) {
    const code = Object.values(KeyCodeEnum).find(code => e.keyCode === code)
    if (code && typeof code === 'number')
      execEcplise(code, e) // 即使判断了isNumber当时并不会类型收窄 那就不用工具函数了 直接typeof
  }

  return {
    listener,
    setMoveableRef,
  }
}
