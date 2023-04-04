import { ref } from 'vue'
import { useViewStore } from '@/store/modules'
import type { IComponent } from '@/store/modules/view'

export function useCanvas() {
  const viewStore = useViewStore()
  const cacheComponents = ref<IComponent[]>([])
  // 上一层

  // 下一层

  return {

  }
}
