<!--
定义元胞状态：在此模型中，我们可以定义三种元胞状态：易感者、感染者和康复者。
定义邻居：每个元胞有8个邻居，它们是该元胞周围的八个相邻元胞。
初始状态：我们需要设置模型的初始状态。例如，可以选择在一个随机的格子中放置一个感染者，其余都是易感者。
定义传播规则：疾病可以通过接触传播，因此我们可以采用以下规则：
a. 如果元胞是易感者，并且有一个或多个相邻元胞是感染者，则该易感者有一定概率被感染。
b. 如果元胞是感染者，则在一定的时间后会变成康复者。
c. 如果元胞是康复者，则不再具有感染性，但可能会再次变为易感者。
定义模型参数：模型需要一些参数，例如感染概率、恢复时间和再感染概率等。这些参数需要根据具体情况进行设置。
模拟传播过程：通过重复应用传播规则，模拟传播过程。可以在每一步中记录感染者和康复者的数量，以便观察传播情况的变化。
结果分析：通过分析模拟结果，可以了解疾病传播的规律，并探索如何控制传播。

1.最开始有一个感染者V，其他都是易感者R
2.当周围的感染人数超过四个人时，易感者被感染
3.易感者在感染者周围有感染者时，三天后被感染
4.易感者感染后，七天后回恢复，不再具备感染性，且变为不易感者D
5.不易感者周围感染人数超过五个人时，不易感者被感染
6.不易感者周围存在感染者，不易感者一定几率变为易感者
 -->

<script setup lang='ts'>
import { reactive } from 'vue'
import { CellStatus } from './type'
import type { Person } from './type'

const HEIGHT = 40
const WIDTH = 40
const state = reactive(
  Array.from(
    { length: HEIGHT },
    (_, y) =>
      Array.from({ length: WIDTH }, (_, x): Person => ({
        status: CellStatus.R,
        x,
        y,
        days: 0,
      })),
  ),
)

state[10][10].status = CellStatus.V

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
    .filter(p => (p as CellStatus) === CellStatus.V)
    .length
}

function start() {
  state.forEach((list, _idx, _self) => {
    list.forEach((cell, __idx, __self) => {
      const count = getSiblings(cell)
      // 状态转移方案-----------------
      if (cell.status === CellStatus.V)
        dueToV(cell, count)
      if (cell.status === CellStatus.R)
        dueToR(cell, count)
      if (cell.status === CellStatus.D)
        dueToD(cell, count)
      // ------------------------------
    })
  })
}

function dueToV(cell: Person, count: number) {
  if (cell.days >= 7) {
    cell.status = CellStatus.D
    cell.days = 0
  }
  else { cell.days++ }
}

function dueToR(cell: Person, count: number) {
  if (count >= 4) {
    cell.status = CellStatus.V
    cell.days = 0
  }
  else if (count > 0) {
    if (cell.days >= 3)
      cell.status = CellStatus.V
    else cell.days += 1
  }
}

function dueToD(cell: Person, count: number) {
  if (count >= 5) {
    cell.status = CellStatus.V
    cell.days = 0
  }
  else if (count > 0) {
    if (Math.random() > 0.9) {
      cell.status = CellStatus.R
      cell.days = 0
    }
  }
}

let frameCounter = 0
function startFrame() {
  requestAnimationFrame(() => {
    frameCounter++
    if (frameCounter % 20 === 0) {
      frameCounter = 0
      start()
    }
    startFrame()
  })
}
startFrame()
</script>

<template>
  <div w-100 h-100 f-c-c border="1px solid #fff" bg="yellow">
    <div v-for="(list, index) of state" :key="index">
      <div v-for="(cell, idx) of list" :key="idx" flex>
        <div
          border="1px solid #fff" m-0.25 rounded-0.2 w-2 h-2
          :class="{
            R: cell.status === CellStatus.R,
            D: cell.status === CellStatus.D,
            V: cell.status === CellStatus.V,
          }"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.R {
  background-color: yellow;
}
.D {
  background-color: aquamarine;
}
.V {
  background-color: red;
}
</style>
