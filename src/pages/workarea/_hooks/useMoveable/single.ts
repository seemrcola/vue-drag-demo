import { useCoord } from '@/store/modules'

export function useSingle() {
  const coordStore = useCoord()

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
    coordStore.settingDataForSingle({ x: dx, y: dy })
  }

  function onScale({ drag, target, dist }: any) {
    target.style.transform = drag.transform
    const scale = dist
    coordStore.settingDataForSingle({ scale })
  }

  function onRotate({ drag, target, dist }: any) {
    target.style.transform = drag.transform
    const rotate = dist
    coordStore.settingDataForSingle({ rotate })
  }

  return {
    singleHandler,
  }
}
