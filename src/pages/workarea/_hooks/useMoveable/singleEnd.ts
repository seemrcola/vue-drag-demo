import { useHistoryStore, useViewStore } from '@/store/modules'

export function useSingleEnd() {
  const { track } = useHistoryStore()
  const viewStore = useViewStore()

  function singleEndHandler(e: any, type: 'drag' | 'scale' | 'rotate') {
    if (type === 'scale')
      onScaleEnd(e)
    if (type === 'drag')
      onDragEnd(e)
    if (type === 'rotate')
      onRotateEnd(e)
    setTimeout(() => track())
  }

  function onDragEnd({ lastEvent, target }: any) {
    if (!lastEvent)
      return
    const [dx, dy] = [...lastEvent.dist]
    viewStore.uSetStyle(target, { x: dx, y: dy })
  }

  function onRotateEnd({ lastEvent, target }: any) {
    if (!lastEvent)
      return
    const { dx, dy } = uCalcTranslateXY(lastEvent)
    const rotate = lastEvent.rotate
    viewStore.uSetStyle(target, { x: dx, y: dy, rotate })
  }

  function onScaleEnd({ lastEvent, target }: any) {
    if (!lastEvent)
      return
    const { dx, dy } = uCalcTranslateXY(lastEvent)
    const scale = [...lastEvent.dist] as [number, number]
    viewStore.uSetStyle(target, { scale, x: dx, y: dy })
  }

  /**
    * translateXY 转化成 position 的 left 和 top
    * @param lastEvent  moveable事件的一个属性，里面有一个tranform字符串
    */
  function uCalcTranslateXY<T extends { afterTransform: any }>(lastEvent: T) {
    const regex = /translate\(\s*(-?\d+(?:\.\d+)?)(px)?\s*,\s*(-?\d+(?:\.\d+)?)(px)?\s*\)/
    const match = regex.exec(lastEvent?.afterTransform)
    let dx = 0
    let dy = 0
    if (match) {
      dx = parseFloat(match[1])
      dy = parseFloat(match[3])
    }
    return { dx, dy }
  }

  return {
    singleEndHandler,
    onScaleEnd,
    onRotateEnd,
    onDragEnd,
  }
}
