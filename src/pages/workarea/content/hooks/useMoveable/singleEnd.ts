import { useHistoryStore, useSettingStore, useViewStore } from '@/store/modules'

export function useSingleEnd() {
  const { track } = useHistoryStore()
  const viewStore = useViewStore()
  const settingStore = useSettingStore()

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
    settingStore.setShowDataTargetForComp()
  }

  function onRotateEnd({ lastEvent, target }: any) {
    if (!lastEvent)
      return
    const { dx, dy } = uCalcTranslateXY(lastEvent)
    const rotate = lastEvent.rotate
    viewStore.uSetStyle(target, { x: dx, y: dy, rotate })
    settingStore.setShowDataTargetForComp()
  }

  function onScaleEnd({ lastEvent, target }: any) {
    if (!lastEvent)
      return
    const { dx, dy } = uCalcTranslateXY(lastEvent)
    const scale = [...lastEvent.dist] as [number, number]
    viewStore.uSetStyle(target, { scale, x: dx, y: dy })
    settingStore.setShowDataTargetForComp()
  }

  // translateXY 转化成 position 的 left 和 top
  /**
     * @param lastEvent    moveable事件的一个属性，里面有一个tranform字符串
     * @param directValue  直接量，用户直接需要处理的tranform字符串 //暂时用不上这个属性，只是写在这里
     * @returns
     */
  function uCalcTranslateXY<T extends { afterTransform: any }>(lastEvent: T, directValue?: string) {
    const regex = /translate\(\s*(-?\d+(?:\.\d+)?)(px)?\s*,\s*(-?\d+(?:\.\d+)?)(px)?\s*\)/
    const match = regex.exec((lastEvent?.afterTransform) || directValue)
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
