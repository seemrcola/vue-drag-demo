/**
 * 拖拽逻辑
 * 1.当点击画布的时候，鼠标按下，开始拖动（start = true）
 * 2.记录下开始的坐标 (startPoint)
 * 3.拖动之后，算出位移坐标 (dertaX, dertaY)
 * 4.更改画布绝对定位。 style.top + y, style.left + x
 * 5.将之前记录的开始坐标替换为拖动之后的坐标
 * 6.鼠标弹起，拖拽结束
 */

import { onUnmounted } from 'vue'

interface DragState {
  isDragging: boolean
  clientX: number
  clientY: number
}

interface DertaState {
  isChanged: boolean
  dertaX: number
  dertaY: number
}

interface UseDragResult {
  dragStart: (event: MouseEvent) => void
  dragEnable: (event: MouseEvent) => boolean
  dragEnd: (event: MouseEvent) => void
  getDerta: () => DertaState
}

export function useDrag(): UseDragResult {
  let startPoint: DragState = {
    isDragging: false,
    clientX: 0,
    clientY: 0,
  }

  let derta: DertaState = {
    isChanged: false,
    dertaX: 0,
    dertaY: 0,
  }

  function dragStart(e: MouseEvent) {
    const { clientX, clientY } = e
    startPoint.isDragging = true

    startPoint = {
      ...startPoint,
      clientX,
      clientY,
    }

    window.addEventListener('mousemove', dragEnable)
    window.addEventListener('mouseup', dragEnd)
  }

  function dragEnable(e: MouseEvent): boolean {
    const { clientX, clientY } = e
    // 如果没有开启移动锁，则直接return
    if (!startPoint.isDragging) {
      derta.isChanged = false
      return false
    }
    // 算出相对于上次的位移差
    const dertaX = clientX - startPoint.clientX
    const dertaY = clientY - startPoint.clientY
    // 存下位移差
    derta = {
      ...derta,
      isChanged: true,
      dertaX,
      dertaY,
    }
    // 更新值
    startPoint = {
      ...startPoint,
      clientX,
      clientY,
    }

    return true
  }

  function dragEnd(e: MouseEvent) {
    startPoint.isDragging = false
    derta.isChanged = false
    window.removeEventListener('mousemove', dragEnable)
    window.removeEventListener('mouseup', dragEnd)
  }

  function getDerta(): DertaState {
    return derta
  }

  onUnmounted(() => {
    window.removeEventListener('mousemove', dragEnable)
    window.removeEventListener('mouseup', dragEnd)
  })

  return {
    dragStart,
    dragEnable,
    dragEnd,
    getDerta,
  }
}
