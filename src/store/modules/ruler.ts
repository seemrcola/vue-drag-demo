import { defineStore } from 'pinia'
import { ref } from 'vue'

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
    isShowReferLine: true, // 显示参考线

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

  // canvas样式配置, 样式的动态属性都由其他配置计算得来
  const canvasStyle = ref({
    height: `${500}px`,
    width: `${700}px`,
    transform: `scale(${rulerOptions.value.scale})`,
  })

  function setScale(scale: number) {
    rulerOptions.value.scale = scale
    /**
     * 改了rulerOptions.value.scale，
     * 但是canvasStyle.value.transform没有变，
     * 目前不知道为什么，只能再改一遍了
     */
    canvasStyle.value.transform = `scale(${scale})`
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
    canvasStyle,
    setScale,
    setStart,
    setRulerSize,
  }
})
