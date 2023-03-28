import { useViewStore } from '@/store/modules'

export function useGroup() {
  const viewStore = useViewStore()

  // note: https://daybrush.com/moveable/storybook/?path=/story/snap-bound--bound-drag-rotate-group
  function groupHandler(e: any, type: 'drag' | 'scale' | 'rotate') {
    if (viewStore.taregtSelect.some(comp => comp.lock))
      return

    if (type === 'scale')
      onScaleGroup(e)
    if (type === 'drag')
      onDragGroup(e)
    if (type === 'rotate')
      onRotateGroup(e)
  }
  function onDragGroup({ events, dist }: any) {
    events.forEach((event: any) => {
      event.target.style.transform = event.style.transform
    })
  }

  function onScaleGroup({ events, dist }: any) {
    events.forEach((event: any) => {
      const transformString = event.style.transform
      event.target.style.transform = transformString // fixme 应该 不允许翻转 moveable的组合完全翻转存在bug
    })
  }

  function onRotateGroup({ events, dist }: any) {
    events.forEach((event: any) => {
      event.target.style.transform = event.style.transform
    })
  }

  return {
    groupHandler,
  }
}
