<script setup lang='ts'>
import { useDel } from '../_hooks/useEclipse/del'
import { useCVX } from '../_hooks/useEclipse/cvx'
import { useHistory } from '../_hooks/useEclipse/history'
const { redo, undo } = useHistory()
const { del } = useDel()
const { copy, paste } = useCVX()
function goto() {
  window.open('https://github.com/seemrcola/datav')
}
</script>

<template>
  <div h-full w-full bg="#333" color="#fff" flex>
    <div h-full flex items-center cursor-pointer w="220px">
      <div i-prime:github text-2xl hover="color-#789" @click="goto" />
      <div text-xs p-2>
        VUE-DRAG-DEMO
      </div>
    </div>
    <div class="icons" w-full flex items-center text-xl flex-1>
      <div w-14 i-ion:arrow-undo-circle-outline @click="undo" />
      <div w-14 i-ion:arrow-redo-circle-outline @click="redo" />
      <div w-14 i-material-symbols:file-copy-outline @click="copy" />
      <div w-14 i-ic:outline-content-paste-go @click="paste" />
      <div data-red w-14 i-ic:outline-delete-forever @click="del" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.icons {
  > div {
    transition: all .3s;
    cursor: pointer;;
    &:hover {
      color: rgb(95, 134, 225);
    }
    &[data-red]:hover{
      color: rgb(220, 94, 66);
    }
  }
}
</style>
