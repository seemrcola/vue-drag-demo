<script setup lang='ts'>
import { reactive, ref } from 'vue'
import type { BlockState } from './types'
import Block from './mineBlock.vue'

const props = withDefaults(defineProps<{
  WIDTH?: number
  HEIGHT?: number
}>(), {
  WIDTH: 10,
  HEIGHT: 10,
})

// 初始化--------------------------------------------------
const state = reactive(
  Array.from(
    { length: props.HEIGHT },
    (_, y) =>
      Array.from({ length: props.WIDTH }, (_, x): BlockState => ({
        x,
        y,
        adjacentMines: 0,
        revealed: false,
      })),
  ),
)

const minesCount = ref(0)
let mineGenerated = false
function initGenerate(block: BlockState) {
  if (mineGenerated)
    return
  mineGenerated = true
  generateMines(block)
}
function generateMines(init: BlockState) {
  for (const row of state) {
    for (const block of row) {
      if (Math.abs(block.x - init.x) < 1)
        continue
      if (Math.abs(block.y - init.y) < 1)
        continue
      block.mine = Math.random() < 0.2
      if (block.mine)
        minesCount.value++
    }
  }
  updateNumbers()
}
// ---------------------------------------------------------

// -炸弹及数字生成---------------------------------------------
const around = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]
function getSiblings(block: BlockState) {
  return around
    .map(([dx, dy]) => {
      const y = block.y + dy
      const x = block.x + dx
      if (x < 0 || x >= props.WIDTH || y < 0 || y >= props.HEIGHT)
        return undefined
      return state[y][x]
    })
    .filter(Boolean) as BlockState[]
}

function updateNumbers() {
  state.forEach((list) => {
    list.forEach((block) => {
      if (block.mine)
        return
      getSiblings(block).forEach((sibling) => {
        if (sibling.mine)
          block.adjacentMines++
      })
    })
  })
}
// ---------------------------------------------------------

// 翻开---------------------------------------- ----- ----
function blockClick(block: BlockState) {
  if (block.revealed)
    return
  if (block.mine)
    return failed()

  initGenerate(block)
  block.revealed = true
  expandZero(block)
  checkGameStatus()
}

function expandZero(block: BlockState) {
  if (block.adjacentMines)
    return
  getSiblings(block).forEach((s) => {
    if (!s.revealed) {
      s.revealed = true
      expandZero(s)
    }
  })
}

// 插旗做标记
function rightClick(block: BlockState) {
  if (block.revealed)
    return
  block.flag = !block.flag
  checkGameStatus()
}

// 失败-------------------------------------------------------
function failed() {
  state.forEach((list) => {
    list.forEach(block => block.revealed = true)
  })
}

// 监听游戏进度
function checkGameStatus() {
  if (!mineGenerated)
    return
  const blocks = state.flat()
  if (blocks.every(block => block.revealed || block.flag)) {
    if (blocks.some(block => block.flag && !block.mine))
      console.log('YOU CHEAT')
    else
      console.log('YOU WIN')
  }
}
</script>

<template>
  <div border="2px solid #666" bg="#fff" p-1 rounded-2>
    <p text-sm mb-4 color="#000" w-full text-center>
      炸弹已生成：「{{ minesCount }}」
    </p>
    <div v-for="(list, index) of state" :key="index" flex="~">
      <Block
        v-for="(block, idx) of list" :key="idx"
        :block="block"
        @block-click="blockClick"
        @right-click="rightClick"
      />
    </div>
  </div>
</template>
