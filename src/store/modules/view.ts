import { defineStore } from 'pinia'
import { markRaw, ref } from 'vue'

export interface IComponent {
  id: string
  type: string
  name: string
  x: number
  y: number
  rotate: number
  scale: number[]
  height: number
  width: number
  component: {
    component: any
    name: string
  }
}

interface ShowData {
  x: number
  y: number
  rotate: number
  scale: [number, number]
}

interface XYMap {
  [propname: string]: { x: number; y: number }
}

// 这五个缩放方向会改变中心点坐标
const SCALEDIRECTION = ['-1,-1', '0,-1', '1,-1', '-1,0', '-1,1']

export const useViewStore = defineStore('view', () => {
  // 画布上的全部图表
  const components = ref<IComponent[]>([])
  // 画布上被选中的图表
  const taregtSelect = ref<IComponent[]>([])
  // 被选中图表的偏差记录
  const transformXYMap = ref<XYMap>({})
  // 右侧用于展示的数据
  const initData: ShowData = { x: 0, y: 0, rotate: 0, scale: [1, 1] }
  const showDataTarget = ref<ShowData>({ x: 0, y: 0, rotate: 0, scale: [1, 1] })

  // 右侧栏setting的展示
  /**
   * @param data 缩放的时的xy值
   * @param direction 缩放的方向
   * @description 组件坐标 = seeting展示的坐标 + 偏差值
  */
  function setShowDataTargetForComp(data: any = undefined, direction = '') {
    // 选择和变换两种情况 选择data和direction都是空 变换时都有值
    const { x, y, rotate, scale, id } = taregtSelect.value[0]
    // debugger
    // case 选择 选择时要记得减去偏差map中的xy值
    if (x)
      showDataTarget.value.x = x - transformXYMap.value[id].x
    if (y)
      showDataTarget.value.y = y - transformXYMap.value[id].y
    if (rotate)
      showDataTarget.value.rotate = rotate
    if (scale) {
      showDataTarget.value.scale[0] = scale[0]
      showDataTarget.value.scale[1] = scale[1]
      // case 2
      if (data) {
        // 拿到从translate那里分离出来的值，这个代表的是组件坐标中心点的位移
        const { dx, dy } = data
        // 1.此时showDataTarget.value.x拿到的是上一次操作结束的位置 我们将上一次的位置处理正确 就可以递推每一次都正确
        // 2.如果减掉位移 此时又回到上一次的结束位置 所以我们需要知道什么时候要保持不变
        // 3.如果加上位移，则显示我们处理之后的位置
        // 4.保持不变即不在SCALEDIRECTION方向 SCALEDIRECTION的都需要改变
        // todo : 旋转状态下做缩放的问题
        if (!SCALEDIRECTION.includes(direction)) {
          showDataTarget.value.x -= dx
          showDataTarget.value.y -= dy
          // 累加偏差
          transformXYMap.value[id].x += dx
          transformXYMap.value[id].y += dy
        }
        else {
          showDataTarget.value.x += dx
          showDataTarget.value.y += dy
          // 累加偏差
          transformXYMap.value[id].x -= dx
          transformXYMap.value[id].y -= dy
        }
      }
    }
  }

  /**
   * @param data 数据
   * @param direction 缩放的方向
  */
  function setShowDataTargetForGroup(data: any, direction = '') {
    // 如果组合被改变了，则重制
    if (data.change)
      return showDataTarget.value = { ...initData, ...data }

    // 组合没有被改变， 则在基础上运算
    const { x, y, rotate, scale } = data
    if (x)
      showDataTarget.value.x += x
    if (y)
      showDataTarget.value.y += y
    if (rotate)
      showDataTarget.value.rotate = rotate
    if (scale) {
      showDataTarget.value.scale[0] *= scale[0]
      showDataTarget.value.scale[1] *= scale[1]
    }
  }

  function setTarget(targetId: string, isGroup = false) {
    if (!isGroup)
      taregtSelect.value.length = 0
    taregtSelect.value.push(getTarget(targetId)!)
  }

  function getTarget(targetId: string) {
    return components.value.find(component => `#${component.id}` === targetId)
  }

  function addComponent<T extends IComponent>(component: T) {
    // 把compnent属性变成非响应式
    component.component = markRaw(component.component)
    components.value.push(component)
    // 同时也将这个组件的偏差进行初始化
    transformXYMap.value[component.id] = { x: 0, y: 0 }
  }

  function removeComponent<T extends IComponent>(component: T) {
    const index = components.value.findIndex(comp => comp.id === component.id)
    components.value.splice(index, 1)
  }

  function initComponentStyle<T extends IComponent>(component: T) {
    return {
      position: 'absolute',
      left: `${component.x}px`,
      top: `${component.y}px`,
      transform: `rotate(${component.rotate}))`,
    }
  }

  return {
    components,
    removeComponent,
    addComponent,
    initComponentStyle,
    setTarget,
    getTarget,
    taregtSelect,
    showDataTarget,
    setShowDataTargetForComp,
    setShowDataTargetForGroup,
  }
})
