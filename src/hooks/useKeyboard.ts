import { KEYSMAP } from './types/useKeyboard.d'

const keysmap = [KEYSMAP.SPACE, KEYSMAP.CTRL]
// 处理键盘记录
export function useKeyboard() {
  // 默认赋值
  window.$KeyboardActive = {
    ctrl: false,
    space: false,
    shift: false,
    meta: false, // mac command
  }

  document.onkeydown = (e: KeyboardEvent) => {
    const { keyCode, shiftKey, metaKey } = e

    /* space键有特殊作用，但是space又会有默认事件 */
    if (keyCode === KEYSMAP.SPACE && e.target === document.body)
      e.preventDefault()

    if (shiftKey && window.$KeyboardActive)
      window.$KeyboardActive.shift = true

    if (metaKey && window.$KeyboardActive)
      window.$KeyboardActive.meta = true

    if (keysmap.includes(keyCode) && window.$KeyboardActive) {
      switch (keyCode) {
        case KEYSMAP.CTRL:
          window.$KeyboardActive.ctrl = true
          break
        case KEYSMAP.SPACE:
          window.$KeyboardActive.space = true
          break
      }
    }
  }

  document.onkeyup = (e: KeyboardEvent) => {
    const { keyCode, shiftKey, metaKey } = e

    /* space键有特殊作用，但是space又会有默认事件 */
    if (keyCode === KEYSMAP.SPACE && e.target === document.body)
      e.preventDefault()

    if (!shiftKey && window.$KeyboardActive)
      window.$KeyboardActive.shift = false

    if (!metaKey && window.$KeyboardActive)
      window.$KeyboardActive.meta = false

    if (keysmap.includes(keyCode) && window.$KeyboardActive) {
      switch (keyCode) {
        case KEYSMAP.CTRL:
          window.$KeyboardActive.ctrl = false
          break
        case KEYSMAP.SPACE:
          window.$KeyboardActive.space = false
          break
      }
    }
  }
}
