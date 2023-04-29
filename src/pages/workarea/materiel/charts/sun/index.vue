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
  useChartResize(chart)
})
</script>

<template>
  <Basic>
    <div ref="main" wh-full />
  </Basic>
</template>
