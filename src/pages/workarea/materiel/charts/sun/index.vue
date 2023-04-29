<script setup lang='ts'>
import { onMounted, ref } from 'vue'
import * as echarts from 'echarts'
import Basic from '../basic.vue'
import { useChartResize } from '../../../_hooks/useChartResize'
import { option } from './options'

const main = ref<HTMLElement>()

onMounted(() => {
  const chart = echarts.init(main.value!)
  chart.setOption(option)
  // todo: 这个reszie其实不会成功 因为设计上我改变的是transform 而不是宽高 这个时候reszie会静默执行失败
  useChartResize(chart)
})
</script>

<template>
  <Basic>
    <div ref="main" wh-full />
  </Basic>
</template>
