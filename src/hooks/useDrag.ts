/**
 * shift + 鼠标的拖拽逻辑
 * 1.当点击画布的时候，鼠标按下，开始拖动（start = true）
 * 2.记录下开始的坐标 (startPoint)
 * 3.拖动之后，算出位移坐标 (dertaX, dertaY)
 * 4.更改画布绝对定位。 style.top + y, style.left + x
 * 5.将之前记录的开始坐标替换为拖动之后的坐标
 * 6.鼠标弹起，拖拽结束
 */

import { onUnmounted } from 'vue'

import type { DertaState, DragState, Options, UseDragResult } from './types/useDrag.d'

// needShift表示是否需要一个控制按键于鼠标同时操作，来实现拖拽
export function useDrag(options: Options = { needShift: true }): UseDragResult {
  let pointState: DragState = {
    isDragging: false,
    clientX: 0,
    clientY: 0,
  }

  let derta: DertaState = {
    isChanged: false,
    dertaX: 0,
    dertaY: 0,
  }

  function isEnable(shiftKey: boolean) {
    return (options.needShift && shiftKey) || !options.needShift
  }

  function handleMouseDown(e: MouseEvent) {
    if (!isEnable(e.shiftKey))
      return
    const { clientX, clientY } = e
    pointState.isDragging = true

    pointState = {
      ...pointState,
      clientX,
      clientY,
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
  }

  function handleMouseMove(e: MouseEvent): boolean {
    const { clientX, clientY } = e
    // 如果没有开启移动锁，则直接return
    if (!pointState.isDragging || !isEnable(e.shiftKey)) {
      derta.isChanged = false
      return false
    }
    // 算出相对于上次的位移差
    const dertaX = clientX - pointState.clientX
    const dertaY = clientY - pointState.clientY
    // 存下位移差
    derta = {
      ...derta,
      isChanged: true,
      dertaX,
      dertaY,
    }
    // 更新值
    pointState = {
      ...pointState,
      clientX,
      clientY,
    }

    return true
  }

  function handleMouseUp() {
    pointState.isDragging = false
    derta.isChanged = false
    window.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('mouseup', handleMouseUp)
  }

  function getDerta(): DertaState {
    return derta
  }

  function getPoint(): DragState {
    return pointState
  }

  onUnmounted(() => {
    window.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('mouseup', handleMouseUp)
  })

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    getDerta,
    getPoint,
  }
}
