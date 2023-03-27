import { useSettingStore } from '@/store/modules'

export function useSingle() {
  const settingStore = useSettingStore()

  function singleHandler(e: any, type: 'drag' | 'scale' | 'rotate') {
    if (type === 'scale')
      onScale(e)
    if (type === 'drag')
      onDrag(e)
    if (type === 'rotate')
      onRotate(e)
  }

  function onDrag({ transform, target, dist }: any) {
    target.style.transform = transform
    const [x, y] = dist
    settingStore.setShowDataTargetForComp({ x, y, id: target.id }, 'ing')
  }

  function onScale({ drag, target, dist }: any) {
    target.style.transform = drag.transform
    const scale = [...dist]
    settingStore.setShowDataTargetForComp({ scale, id: target.id }, 'ing')
  }

  function onRotate({ drag, target, dist }: any) {
    target.style.transform = drag.transform
    const rotate = dist
    settingStore.setShowDataTargetForComp({ rotate, id: target.id }, 'ing')
  }

  return {
    singleHandler,
  }
}
