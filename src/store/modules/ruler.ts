import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useRulerStore = defineStore('ruler', () => {
  // 比例尺相关配置
  const rulerOptions = ref({
    scale: 1.0, // 默认缩放
    startX: 0, // 尺子开始坐标
    startY: 0,
    height: 0, // 尺子大小,这个大小动态赋值
    width: 0,
    thick: 20, // 尺子厚度，即标尺本身所占宽度
    isShowRuler: true, // 显示标尺
    isShowReferLine: false, // 显示参考线
    max: 3.0,
    min: 0.4,

    palette: { // 基础样式
      bgColor: '#181b24',
      longfgColor: '#BABBBC',
      shortfgColor: '#9C9C9C',
      fontColor: '#DEDEDE',
      shadowColor: '#525252',
      lineColor: '#EB5648',
      borderColor: '#B5B5B5',
      cornerActiveColor: '#fff',
    },
  })

  const canvasOptions = ref({
    width: 1920,
    height: 1080,
  })

  // canvas样式配置, 样式的动态属性都由其他配置计算得来
  // computed返回一个普通对象，这个对象会被处理成reactive类型，对象里的原始类型处理成ref，引用类型处理成shallowRef
  // 所以如果将这个值解构出来去赋值给:style的话会丢失响应式
  const canvasStyle = computed(
    () => {
      return {
        height: `${canvasOptions.value.height}px`,
        width: `${canvasOptions.value.width}px`,
        transform: `scale(${rulerOptions.value.scale})`,
      }
    },
  )

  function setScale(scale: number) {
    if (scale > rulerOptions.value.max || scale < rulerOptions.value.min)
      return
    rulerOptions.value.scale = scale
  }

  function setStart(x: number, y: number) {
    rulerOptions.value.startX = x
    rulerOptions.value.startY = y
  }

  function setRulerSize({ height, width }: DOMRect) {
    rulerOptions.value.height = height
    rulerOptions.value.width = width
  }

  return {
    rulerOptions,
    canvasOptions,
    canvasStyle,
    setScale,
    setStart,
    setRulerSize,
  }
})
