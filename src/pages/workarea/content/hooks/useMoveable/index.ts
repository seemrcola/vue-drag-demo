import { nextTick, ref } from 'vue'
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
import { useSettingStore, useViewStore } from '@/store/modules'

// 被选中的元素
const selectTarget = ref<string[]>([])

export function useMoveable() {
  const viewStore = useViewStore()
  const settingStore = useSettingStore()

  const { groupHandler } = useGroup()
  const { singleHandler } = useSingle()
  const { groupEndHandler } = useGroupEnd()
  const { singleEndHandler } = useSingleEnd()

  let oprateMode: 'comp' | 'group' // 操作类型 是分组操作还是单个操作

  function getKeyStatus() {
    return {
      isMeta: window.$KeyboardActive.meta,
      isCtrl: window.$KeyboardActive.ctrl,
      isSpace: window.$KeyboardActive.space,
    }
  }

  function isGroup() {
    return oprateMode === 'group'
  }

  // 选中组件的方法有两种 一种是框选 还有一种是点击
  function selectComponent<T extends { id: string }>(
    comp: T | T[],
    type: 'click' | 'selecto' = 'click',
  ) {
    if (type === 'click')
      selectByClick(comp as T)
    if (type === 'selecto')
      selectBySelecto(comp as T[])
  }

  function selectBySelecto<T extends { id: string }>(comps: T[]) {
    if (isEmpty(comps))
      return
    selectTarget.value = comps.map(comp => `#${comp.id}`)
    if (selectTarget.value.length > 1)
      oprateMode = 'group'
    else
      oprateMode = 'comp'
    DuetoSelectedInView()
  }

  function selectByClick<T extends { id: string }>(comp: T) {
    const { isMeta, isCtrl } = getKeyStatus()
    const id = `#${(comp).id}`
    // 每次必须要更换数组指向，否则不生效，就离谱----
    const noCtrl = !isCtrl && !isMeta
    if (noCtrl || (!noCtrl && selectTarget.value.length === 0)) { // 不按住ctrl 或者按住ctrl但是target列表长度为0
      oprateMode = 'comp'
      selectTarget.value = [id]
      DuetoSelectedInView()
    }
    else {
      oprateMode = 'group'
      selectTarget.value = [...selectTarget.value, id]
      DuetoSelectedInView()
    }
  }

  function DuetoSelectedInView() {
    viewStore.setTarget(selectTarget.value) // 选择时同步给view
    if (isGroup()) {
      nextTick(() => { // 这里要这么套才行，原因未知 fixme
        setTimeout(() => { // 这里用定时器是为了保证能获取到movable-area元素
          // view中的展示数组处理 针对组合选中
          const { x, y } = uCalcXY()
          settingStore.setShowDataTargetForGroup({ x, y, change: true })
        })
      })
    }
    else { // view中的展示数组处理
      settingStore.setShowDataTargetForComp()
    }
  }

  function clearSelect() {
    console.log('drop')
    selectTarget.value = []
    viewStore.clearSelect() // 清空时同步给view
    settingStore.setShowDataTargetForGroup({ change: true })
  }

  // 用来计算组合操作的xy坐标值
  function uCalcXY() {
    const area = document.getElementsByClassName('moveable-area')[0]!
    const areaRect = area?.getBoundingClientRect()
    const canvas = document.querySelector('#canvas')!
    const canvasRect = canvas.getBoundingClientRect()
    return {
      x: areaRect.left - canvasRect.left,
      y: areaRect.top - canvasRect.top,
    }
  }

  return {
    selectTarget,
    selectComponent,
    clearSelect,
    groupHandler,
    singleHandler,
    groupEndHandler,
    singleEndHandler,
  }
}
