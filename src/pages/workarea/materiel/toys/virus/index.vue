<!--
定义元胞状态：在此模型中，我们可以定义三种元胞状态：易感者、感染者和康复者。
定义邻居：每个元胞有8个邻居，它们是该元胞周围的八个相邻元胞。
初始状态：我们需要设置模型的初始状态。例如，可以选择在一个随机的格子中放置一个感染者，其余都是易感者。

模型中每个元胞有三种状态：易感者 (R)，感染者 (V) 和康复者 (D)。
a.在模型的初始状态中，所有元胞都是易感者，除了一个或多个被随机选择为感染者。
b.在每个时间步长中，模型会遍历所有元胞，并根据其周围八个邻居的状态更新其自身状态。
c.如果一个易感者的周围有感染者，则该易感者将以概率P被感染，概率P由传染率决定。
d.如果一个感染者已经感染了T个时间步长，那么他就会变为康复者。
e.康复者将保持免疫状态，不会再次感染。
f.如果一个康复者周围有感染者，那么他将以概率Q失去免疫力，每感染一次，失去免疫力几率减半。
g.如果一个感染者周围没有任何易感者，则他将在下一时间步长自动康复。
h.当所有感染者都康复时，模型停止。
 -->

<script setup lang='ts'>
import { onMounted, onUnmounted, reactive, ref } from 'vue'
import { CellStatus } from './type'
import type { Person } from './type'

const HEIGHT = 50
const WIDTH = 50
const CELL_SIZE = 8
const FRAME_RATE = 20

const P = 0.7 // 周围每一个感染者均70%几率传染给未感染过的元胞-奥米克戎
const T = 10 // 感染者10天后恢复正常
const Q = 0.1 // 康复者周围每有感染者，有10%概率失去免疫力。

const day = ref(0)

const state = reactive(
  Array.from(
    { length: HEIGHT },
    (_, y) =>
      Array.from({ length: WIDTH }, (_, x): Person => ({
        status: CellStatus.R,
        x,
        y,
        days: 0,
        v: 0,
      })),
  ),
)

// 设置一个感染母体
state[20][20].status = CellStatus.V

const siblings = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1], /* self */[0, 1],
  [1, -1], [1, 0], [1, 1],
]
function getSiblings(cell: Person) {
  return siblings
    .map(([dx, dy]) => {
      const y = cell.y + dy
      const x = cell.x + dx
      if (x < 0 || x >= WIDTH || y < 0 || y >= HEIGHT)
        return false
      return state[y][x].status
    })
    .filter(Boolean)
}
function getV(cell: Person) {
  const siblings = getSiblings(cell)
  return siblings.filter(s => s === CellStatus.V).length
}
function getR(cell: Person) {
  const siblings = getSiblings(cell)
  return siblings.filter(s => s === CellStatus.R).length
}

const canvas = ref<any>()
function draw(ctx: any) {
  state.forEach((list) => {
    list.forEach(cell => drawCell(ctx, cell))
  })
}
function drawCell(ctx: any, cell: Person) {
  let color = 'yellow'
  if (cell.status === CellStatus.V)
    color = '#f40'
  else if (cell.status === CellStatus.D)
    color = 'aquamarine'
  else if (cell.status === CellStatus.R)
    color = 'yellow'

  // 填充
  ctx.fillStyle = color
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
  state.forEach((list, _idx, _self) => {
    list.forEach((cell, __idx, __self) => {
      // 状态转移方案-------------------
      if (cell.status === CellStatus.V)
        dueToV(cell)
      if (cell.status === CellStatus.R)
        dueToR(cell)
      if (cell.status === CellStatus.D)
        dueToD(cell)
      // ------------------------------
      drawCell(ctx, cell)
    })
  })
}

function dueToV(cell: Person) {
  const rcount = getR(cell)
  // rule g
  if (rcount === 0) {
    cell.days = T
  }
  // rule d
  else if (cell.days >= T) {
    cell.status = CellStatus.D
    cell.days = 0
    cell.v += 1
  }
  else {
    cell.days += 1
  }
}

function dueToR(cell: Person) {
  const vcount = getV(cell)
  // rule c
  if (vcount) {
    const p = 1 - (1 - P) ** vcount // 感染概率
    if (Math.random() > p) {
      cell.status = CellStatus.V
      cell.days = 0
    }
  }
}

function dueToD(cell: Person) {
  const vcount = getV(cell)
  // rule f
  let p = Q // 失去免疫力概率
  let v = cell.v

  while (v > 0) {
    p = p / 2
    v -= 1
  }

  if (vcount > 0 && Math.random() < p) {
    cell.status = CellStatus.R
    cell.days = 0
  }
}

// 是否清零
function ifZero() {
  for (const list of state) {
    for (const cell of list) {
      if (cell.status === CellStatus.V)
        return false
    }
  }
  return true
}

let frameCounter = FRAME_RATE
let requestId: any
function startFrame(ctx: any) {
  requestId = requestAnimationFrame(() => {
    frameCounter--
    if (frameCounter === 0) {
      frameCounter = FRAME_RATE
      // 全部清零则停止
      if (ifZero()) {
        return
      }
      else {
        start(ctx)
        day.value++
      }
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
