import { onUnmounted, watch } from 'vue'
import { useViewStore } from '@/store/modules'

export function useChartResize(chart: any) {
  const viewStore = useViewStore()
  const component = viewStore.components[viewStore.components.length - 1]
  let height = 0
  let width = 0
  let cancel = Infinity

  const unwatch = watch(
    () => component,
    (n) => {
      if (!n)
        return
      if (height !== n.height || width !== n.width) {
        height = n.height
        width = n.width
        clearTimeout(cancel)
        cancel = setTimeout(() => {
          chart.resize()
        }, 500)
      }
    },
    { deep: true },
  )

  onUnmounted(() => {
    unwatch()
    clearTimeout(cancel)
  })
}
