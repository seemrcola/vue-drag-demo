import { KEYSMAP } from './types/useKeyboard'

// 处理键盘记录
export function keyRecordHandle() {
  // 默认赋值
  window.$KeyboardActive = {
    ctrl: false,
    space: false,
    shift: false,
  }

  document.onkeydown = (e: KeyboardEvent) => {
    const { keyCode, shiftKey } = e
    if (keyCode === KEYSMAP.SPACE && e.target === document.body)
      e.preventDefault()

    if (shiftKey && window.$KeyboardActive)
      window.$KeyboardActive.shift = true

    if ([KEYSMAP.SPACE, KEYSMAP.CTRL].includes(keyCode) && window.$KeyboardActive) {
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
    const { keyCode, shiftKey } = e
    if (keyCode === KEYSMAP.SPACE && e.target === document.body)
      e.preventDefault()

    if (!shiftKey && window.$KeyboardActive)
      window.$KeyboardActive.shift = false

    if ([KEYSMAP.CTRL, KEYSMAP.SPACE].includes(keyCode) && window.$KeyboardActive) {
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
