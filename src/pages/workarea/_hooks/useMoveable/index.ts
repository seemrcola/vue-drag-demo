import { ref } from 'vue'
import type { VueMoveableInstance } from 'vue3-moveable'
import { useGroup } from './group'
import { useSingle } from './single'
import { useSingleEnd } from './singleEnd'
import { useGroupEnd } from './groupEnd'
import { isEmpty } from '@/utils/is'
/*
 * uSetStyle 用来处理单个组件的位置【在拖拽操作结束之后处理】
 * view.setShowDataTarget 用来处理settings.vue文件展示的数值【在拖拽结束之后处理】
 * 这个hooks需要用到useKeyBoard
 * 这个hooks需要用到store 改变view里面的属性
 * 这种需要依赖外部store的函数组合，就不写进全局的hooks中
 */
import { useCoordStore, useViewStore } from '@/store/modules'

type SelectMode = 'click' | 'selecto'

// 被选中的元素
const selectTarget = ref<string[]>([])
const moveableRef = ref<VueMoveableInstance>()

// 这里主要做两个操作 选中和清空
export function useMoveable() {
  const viewStore = useViewStore()
  const coordStore = useCoordStore()

  const { groupHandler } = useGroup()
  const { singleHandler } = useSingle()
  const { groupEndHandler } = useGroupEnd()
  const { singleEndHandler } = useSingleEnd()

  function getKeyStatus() {
    return {
      isMeta: window.$KeyboardActive.meta,
      isCtrl: window.$KeyboardActive.ctrl,
      isSpace: window.$KeyboardActive.space,
    }
  }

  // 选中组件的方法有两种 一种是框选 还有一种是点击
  function selectComponent<T extends { id: string }>(comp: T | T[], type: SelectMode = 'click') {
    if (type === 'click')
      selectByClick(comp as T)
    if (type === 'selecto')
      selectBySelecto(comp as T[])
  }

  function selectBySelecto<T extends { id: string }>(comps: T[]) {
    if (isEmpty(comps))
      return
    selectTarget.value = comps.map(comp => `#${comp.id}`)

    viewStore.setTarget(selectTarget.value) // 同步给view
    coordStore.init() // 通知 setting
  }

  function selectByClick<T extends { id: string }>(comp: T) {
    const { isMeta, isCtrl } = getKeyStatus()
    const id = `#${(comp).id}`
    // 每次必须要更换数组指向 moveable 设计如此
    const noCtrl = !isCtrl && !isMeta
    // 不按住ctrl 或者按住ctrl但是target列表长度为0
    if (noCtrl || (!noCtrl && selectTarget.value.length === 0))
      selectTarget.value = [id]
    else
      selectTarget.value = [...selectTarget.value, id]

    viewStore.setTarget(selectTarget.value) // 同步给view
    coordStore.init() // 通知 setting
  }

  function clearSelect() {
    console.log('drop!!!')
    selectTarget.value = []
    viewStore.clearSelect() // 清空时同步给view
  }

  function setMoveableRef(ref: VueMoveableInstance) {
    moveableRef.value = ref
  }

  // 这个对应的是movebale的click-group API 可以拿到被moveable-area覆盖的被点击元素
  function clickGroup(e: any) {
    const targetId = e.inputTarget.id
    const ifSelected = viewStore.taregtSelect
      .find(comp => comp.id === targetId)
    if (!ifSelected) {
      selectTarget.value = [...selectTarget.value, `#${targetId}`]
      viewStore.setTarget(selectTarget.value)
    }
  }

  return {
    setMoveableRef,
    selectTarget,
    selectComponent,
    clearSelect,
    groupHandler,
    singleHandler,
    groupEndHandler,
    singleEndHandler,
    clickGroup,
  }
}
