<script setup lang='ts'>
import { computed, onMounted, ref } from 'vue'
const el = ref<HTMLCanvasElement>()
const ctx = computed(() => el.value!.getContext('2d')!)
let isDrawing = false
let start = { x: 0, y: 0 }

function initCanvas() {
  ctx.value.lineWidth = 5 // 线条 宽度
  ctx.value.strokeStyle = 'rgba(255,255,255,.5)' // 线的颜色
}

function onMouseDown(e: MouseEvent) {
  isDrawing = true
  ctx.value.beginPath() // 生成画笔
  const { clientX, clientY } = e
  const { left, top } = getRect()
  ctx.value.moveTo(clientX - left, clientY - top)// 将画笔放到移动到某起始个点；
  start = { x: clientX, y: clientY }
}

function onMouseMove(e: MouseEvent) {
  if (!isDrawing)
    return
  const { clientX, clientY } = e
  const { left, top } = getRect()
  ctx.value.lineTo(clientX - left, clientY - top)// 将画笔绘制到该点
  ctx.value.stroke()
  start = { x: clientX, y: clientY }
}

function onMouseUp() {
  isDrawing = false
}

function onMouseLeave() {
  isDrawing = false
}

function getRect(): DOMRect {
  return el.value!.getBoundingClientRect()
}

onMounted(() => initCanvas())
</script>

<template>
  <canvas
    ref="el" :height="500" :width="800" bg="#000"
    class="!cursor-pointer"
    @mousedown="onMouseDown"
    @mousemove="onMouseMove"
    @mouseup="onMouseUp"
    @mouseleave="onMouseLeave"
  />
</template>
