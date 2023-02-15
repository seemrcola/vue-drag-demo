/**
 * 拖拽逻辑
 * 1.当点击画布的时候，鼠标按下，开始拖动（start = true）
 * 2.记录下开始的坐标 (startPoint)
 * 3.拖动之后，算出位移坐标 (dertaX, dertaY)
 * 4.更改画布绝对定位。 style.top + y, style.left + x
 * 5.将之前记录的开始坐标替换为拖动之后的坐标
 * 6.鼠标弹起，拖拽结束
 */

interface Point {
  x: number
  y: number
}

export function useDrag(domName: string) {
  let dom: any
  let start = false

  let startPoint: Point = {
    x: 0,
    y: 0,
  }

  function dragStart(e: MouseEvent) {
    start = true
    dom = document.querySelector(domName)
    startPoint = {
      x: e.clientX,
      y: e.clientY,
    }
  }

  function dragEnable(e: MouseEvent) {
    // 如果没有开启移动锁，则直接return
    if (!start)
      return
    requestAnimationFrame(() => {
      // 算出相对于上次的位移差
      const x = e.clientX - startPoint.x
      const y = e.clientY - startPoint.y
      // 设置样式
      dom.style.left = `${parseFloat(dom.style.left) + x}px`
      dom.style.top = `${parseFloat(dom.style.top) + y}px`
      // 更新值
      startPoint = {
        x: e.clientX,
        y: e.clientY,
      }
    })
  }

  function dragEnd(e: MouseEvent) {
    start = false
  }

  return {
    dragStart,
    dragEnable,
    dragEnd,
  }
}
