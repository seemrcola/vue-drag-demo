<script setup lang='ts'>
import { computed, onMounted, ref } from 'vue'
import type { Line, Point } from './types'
const props = withDefaults(defineProps<{
  height?: number
  width?: number
}>(), {
  height: 400,
  width: 400,
})

const el = ref<HTMLCanvasElement>()
const ctx = computed(() => el.value!.getContext('2d')!)

const WIDTH = props.height
const HEIGHT = props.height

onMounted(() => {
  init()
})

const penddingTask: Function[] = []
let frameCount = 0

function init() {
  ctx.value.strokeStyle = '#fff'
  const root: Line = {
    start: { x: WIDTH / 2, y: HEIGHT },
    length: 10,
    theta: Math.PI / 2,
  }
  step(root)
}

function frame() {
  const task = [...penddingTask]
  penddingTask.length = 0
  task.forEach(fn => fn())
}

function startFrame() {
  requestAnimationFrame(() => {
    frameCount++
    if (frameCount % 10 === 0)
      frame()
    startFrame()
  })
}

startFrame()

let branches = 0
function step(b: Line) {
  branches++
  drawLine(b)
  const end = getEndPoint(b)
  if (branches < 3 || Math.random() > 0.5) {
    penddingTask.push(() => step({
      start: end,
      theta: b.theta - 0.2,
      length: b.length,
    }))
  }
  else { drawArc(end) }

  if (branches < 3 || Math.random() < 0.5) {
    penddingTask.push(() => step({
      start: end,
      theta: b.theta + 0.2,
      length: b.length,
    }))
  }
  else { drawArc(end) }
}

function getEndPoint({ start, length, theta }: Line): Point {
  return {
    x: ~~(start.x - length * Math.cos(theta)),
    y: ~~(start.y - length * Math.sin(theta)),
  }
}

function drawLine(l: Line) {
  lineTo(l.start, getEndPoint(l))
}
function drawArc(p: Point) {
  Math.random() > 0.6 && arcTo(p)
}

function lineTo(p1: Point, p2: Point) {
  ctx.value.beginPath()
  ctx.value.moveTo(p1.x, p1.y)
  ctx.value.lineTo(p2.x, p2.y)
  ctx.value.stroke()
}

function arcTo(p: Point) {
  const dertax = Math.random() * (6) - 3
  const dertay = Math.random() * (6) - 3

  ctx.value.fillStyle = 'pink'
  ctx.value.arc(p.x + dertax, p.y + dertay, 2, 0, Math.PI * 2)
  ctx.value.fill()
}
</script>

<template>
  <canvas ref="el" :height="400" :width="400" b color="#ccc" />
</template>
