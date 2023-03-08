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
import { reactive } from 'vue'
import type { CellState } from './type'
import { CellStatus } from './type'

const HEIGHT = 40
const WIDTH = 40
const state = reactive(
  Array.from(
    { length: HEIGHT },
    (_, y) =>
      Array.from({ length: WIDTH }, (_, x): CellState => ({
        status: (Math.random() < 0.1) ? CellStatus.ALIVE : CellStatus.DEAD,
        x,
        y,
      })),
  ),
)

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
      return state[y][x].status
    })
    .filter(Boolean)
    .length
}

function start() {
  state.forEach((list, _idx, _self) => {
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
    })
  })
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
        <div border="1px solid #fff" m-0.25 rounded-0.2 w-2 h-2 :class="{ alive: cell.status }" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.alive {
  background-color: black;
}
</style>
