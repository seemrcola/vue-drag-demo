<script setup lang='ts'>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import html2canvas from 'html2canvas'
import { useDel } from '../_hooks/useEclipse/del'
import { useCVX } from '../_hooks/useEclipse/cvx'
import { useMoveable } from '../_hooks/useMoveable/index'
import { useHistory } from '../_hooks/useEclipse/history'
import { useViewStore } from '@/store/modules'
import Snapshoot from '@/components/snapshoot/index.vue'
const { clear } = useViewStore()
const { redo, undo } = useHistory()
const { clearSelect } = useMoveable()
const { del } = useDel()
const { copy, paste } = useCVX()

const router = useRouter()

// github 地址
function goto() {
  window.open('https://github.com/seemrcola/datav')
}
// preview 新开tab
function preview() {
  const { href: link } = router.resolve({
    path: '/preview',
  })
  window.open(link, '_blank')
}
// 快照
const showSnapshoot = ref(false)
function snapshoot() {
  showSnapshoot.value = true
}
// 截图
async function screenshot() {
  const canvas = await html2canvas(document.querySelector('#canvas')!)
  const img = document.createElement('a')
  img.href = canvas
    .toDataURL('image/jpeg')
    .replace('image/jpeg', 'image/octet-stream')
  img.download = 'case.jpg'
  img.click()
}
// 清空
function clearCanvas() {
  clear()
  clearSelect()
}
</script>

<template>
  <Snapshoot v-if="showSnapshoot" @close="showSnapshoot = false" />

  <div v-else h-full w-full bg="#222" color="#fff" flex>
    <div h-full flex items-center cursor-pointer w="220px">
      <div i-prime:github text-2xl hover="color-#789" @click="goto" />
      <div text-xs p-2>
        VUE-DRAG-DEMO
      </div>
    </div>
    <div class="icons" flex items-center text-xl flex-1>
      <div w-14 i-ion:arrow-undo-circle-outline @click="undo" />
      <div w-14 i-ion:arrow-redo-circle-outline @click="redo" />
      <div w-14 i-material-symbols:file-copy-outline @click="copy" />
      <div w-14 i-ic:outline-content-paste-go @click="paste" />
      <div w-14 i-codicon:open-preview @click="snapshoot" />
      <div data-red w-14 i-ic:outline-delete-forever @click="del" />
    </div>
    <div class="icons" h-full w="300px" flex items-center text-xl>
      <div i-icon-park-outline:clear-format mx-4 @click="clearCanvas" />
      <div i-ion:paper-plane-outline mx-4 @click="preview" />
      <div i-iconoir:screenshot mx-4 @click="screenshot" />
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
