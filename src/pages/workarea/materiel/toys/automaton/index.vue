<!--
我们以康威生命游戏为例
规则如下：
1.如果一个细胞周围有三个细胞是活的，则该细胞在下一个时刻会变成活的。
2.如果一个细胞周围的活细胞少于两个，则该细胞在下一个时刻会死亡。
3.如果一个细胞周围的活细胞多于三个，则该细胞在下一个时刻会死亡。

即：
> 3 死于拥挤
= 3 存活
= 2 保持当前状态
< 2 孤独而死
-->
<script setup lang='ts'>
import { onMounted, onUnmounted, ref } from 'vue'
import type { CellState } from './type'
import { CellStatus } from './type'

const HEIGHT = 40
const WIDTH = 40
const FRAME_RATE = 20
const CELL_SIZE = 10

const state = ref<CellState[][]>(init())

function init() {
  return Array.from(
    { length: HEIGHT },
    (_, y) =>
      Array.from(
        { length: WIDTH },
        (_, x): CellState => ({
          status: (Math.random() < 0.1) ? CellStatus.ALIVE : CellStatus.DEAD,
          x,
          y,
        })),
  )
}

const siblings = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1], /* self */[0, 1],
  [1, -1], [1, 0], [1, 1],
]

function getSiblings(cell: CellState) {
  return siblings
    .map(([dx, dy]) => {
      const y = cell.y + dy
      const x = cell.x + dx
      if (x < 0 || x >= WIDTH || y < 0 || y >= HEIGHT)
        return false
      return state.value[y][x].status
    })
    .filter(Boolean)
    .length
}

const canvas = ref<any>()
function draw(ctx: any) {
  state.value.forEach((list) => {
    list.forEach(cell => drawCell(ctx, cell))
  })
}
function drawCell(ctx: any, cell: CellState) {
  // 填充
  ctx.fillStyle = cell.status === CellStatus.ALIVE ? 'black' : 'white'
  ctx.fillRect(cell.x * CELL_SIZE, cell.y * CELL_SIZE, CELL_SIZE, CELL_SIZE)
  // 画线
  ctx.strokeStyle = 'gray'
  ctx.strokeRect(
    cell.x * CELL_SIZE + 1,
    cell.y * CELL_SIZE + 1,
    CELL_SIZE - 2,
    CELL_SIZE - 2,
  )
}

function start(ctx: any) {
  state.value.forEach((list, _idx, _self) => {
    list.forEach((cell, __idx, __self) => {
      const count = getSiblings(cell)
      // 状态转移方案-----------------
      if (count < 2)
        cell.status = CellStatus.DEAD
      if (count === 2)
        return
      if (count === 3)
        cell.status = CellStatus.ALIVE
      if (count > 3)
        cell.status = CellStatus.DEAD
      // ------------------------------
      drawCell(ctx, cell)
    })
  })
}

// 按帧更新
let frameCounter = FRAME_RATE
let requestId: any
function startFrame(ctx: any) {
  requestId = requestAnimationFrame(() => {
    frameCounter--
    if (frameCounter === 0) {
      frameCounter = FRAME_RATE
      start(ctx)
    }
    startFrame(ctx)
  })
}

onMounted(() => {
  const ctx = canvas.value.getContext('2d')
  draw(ctx)
  startFrame(ctx)
})
onUnmounted(() => {
  cancelAnimationFrame(requestId)
})
</script>

<template>
  <div b>
    <canvas ref="canvas" height="400" width="400" />
  </div>
</template>

<style lang="scss" scoped>
.alive {
  background-color: black;
}
</style>
