import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { DertaData, IComponent } from '../types/view.d'
import { useRulerStore } from './ruler'
import { useHistoryStore } from './history'

/*
 * usemoveable 的selectTarget用来控制选中的效果，以及让target可以进行操作，里面只有一个id属性
 * view里面的selectTarget内的数据更多，是把component的全部属性都保存下来形成的数组
*/

export { DertaData, IComponent }

export const useViewStore = defineStore(
  'view',
  () => {
  // ruler
    const rulerStore = useRulerStore()
    // history
    const historyStore = useHistoryStore()
    // 画布上的全部单个图表
    const components = ref<IComponent[]>([])
    // 画布上被选中的图表
    const taregtSelect = ref<IComponent[]>([])

    function setTarget(targetId: string[]) {
      // 清空数组
      taregtSelect.value = []
      // 重新给数组赋值
      targetId.forEach((id) => {
        taregtSelect.value.push(getTarget(id)!)
      })
    }

    function getTarget(targetId: string) {
      return components.value.find(component => `#${component.id}` === targetId)
    }

    function clearSelect() {
      taregtSelect.value = []
    }

    function removeComponent<T extends IComponent>(component: T) {
      const index = components.value.findIndex(comp => comp.id === component.id)
      components.value.splice(index, 1)
    }

    function addComponent<T extends IComponent>(component: T) {
      components.value.push(component)
      setTimeout(() => historyStore.track())
    }

    function transformcomponent(componentId: string, data: DertaData) {
      const item = components.value.find(item => componentId === item.id)!
      const { x, y, rotate, scale } = data
      if (x)
        item.x += x
      if (y)
        item.y += y
      if (rotate)
        item.rotate = rotate % 360
      if (scale) {
        item.scale[0] *= scale[0]
        item.scale[1] *= scale[1]
        item.width *= scale[0]
        item.height *= scale[1]
      }
    }

    function initComponentStyle<T extends IComponent>(component: T) {
      return {
        position: 'absolute',
        left: `${component.x}px`,
        top: `${component.y}px`,
        transform: `rotate(${component.rotate}deg) scale(${component.scale[0]}, ${component.scale[1]})`,
      }
    }

    const setComponentStyle = computed(
      () => <T extends IComponent>(comp: T) => initComponentStyle(comp),
    )

    // 用来改变组件的样式 transform to absolute 以及改变views.components记录的值
    function uSetStyle(target: HTMLElement, delta: DertaData) {
      const id = target.id
      // 根据id修改componnets中对应的component
      // 只有操作结束的时候才需要去调用transformcomponent,此时才会有完整的delta数据, 用于记录组件相关的位置信息--------
      transformcomponent(id, delta)
    }

    return {
      components,
      removeComponent,
      addComponent,
      setTarget,
      getTarget,
      taregtSelect,
      transformcomponent,
      clearSelect,
      uSetStyle,
      setComponentStyle,
    }
  },
  {
    persist: true,
  })
