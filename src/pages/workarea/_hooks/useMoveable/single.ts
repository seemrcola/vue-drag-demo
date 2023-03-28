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
    const [dx, dy] = dist
    settingStore.settingDataForSingle({ x: dx, y: dy })
  }

  function onScale({ drag, target, dist }: any) {
    target.style.transform = drag.transform
    const scale = dist
    settingStore.settingDataForSingle({ scale })
  }

  function onRotate({ drag, target, dist }: any) {
    target.style.transform = drag.transform
    const rotate = dist
    settingStore.settingDataForSingle({ rotate })
  }

  return {
    singleHandler,
  }
}
