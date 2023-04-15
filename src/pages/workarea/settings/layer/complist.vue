<script setup lang='ts'>
import { computed, onMounted, ref } from 'vue'
import { useViewStore } from '@/store/modules'
import type { IComponent } from '@/store/types/view'
import { useVitrualList } from '@/hooks/useVitrualList'
import { useContextMenu } from '@/hooks/useContextMenu'
import ContextMenu from '@/components/contextMenu/index.vue'

const viewStore = useViewStore()
const components = computed(() => viewStore.components)
const { generateObserver, onObserve } = useVitrualList('list-item', components.value)

function getUrl({ thumbnail }: IComponent) {
  return new URL(`../../../../${thumbnail}`, import.meta.url).href
}

const { contextMenu: contextMenuHanlde, showmenu } = useContextMenu('#layerMenu')
const currentContext = ref(0)
function contextMenu(e: MouseEvent, index: number) {
  console.log(e)
  e.preventDefault()
  showmenu.value = true
  currentContext.value = index
  contextMenuHanlde(e)
}
const menuList = [
  { text: '上一层', type: 'up' },
  { text: '下一层', type: 'down' },
  { text: '置顶', type: 'ceil' },
  { text: '置底', type: 'floor' },
]
function layerHanlde(type: string) {
  viewStore.setLayer(type, currentContext.value)
  showmenu.value = false
}
function mouseEnterHandle(index: number) {
  viewStore.components[index].selecto = true
}
function mouseLeaveHandle(index: number) {
  viewStore.components[index].selecto = false
}

onMounted(() => {
  generateObserver()
  onObserve()
})
</script>

<template>
  <div
    h="500px" max-h="500px" overflow-auto
    relative
    class="no-scroll-bar vitural"
  >
    <div
      w-full z--1 absolute bg="#fff"
      :style="{ height: `${components.length * 36}px` }"
    />
    <Teleport to="body">
      <ContextMenu
        v-show="showmenu" id="layerMenu" :list="menuList"
        absolute
        @dispatch="layerHanlde"
      />
    </Teleport>
    <div
      v-for="(component, index) of components"
      :key="index"
      class="list-item"
      :data-index="index"
      flex items-center h="36px"
      bg="#555" b-b="1px solid #fff"
      @contextmenu.stop="contextMenu($event, index)"
      @mouseenter="mouseEnterHandle(index)"
      @mouseleave="mouseLeaveHandle(index)"
    >
      <img :src="getUrl(component)" h-6 w-6 mx-4>
      <p> {{ component.name.toLocaleUpperCase() }}</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
    /* 修改滚动条的颜色 */
    ::-webkit-scrollbar {
      width: 6px;
      background-color: #eee;
    }
    ::-webkit-scrollbar-thumb {
      width: 6px;
      background-color: rgb(245, 202, 150);
    }
    ::-webkit-scrollbar-thumb:hover {
      background-color: rgb(230, 162, 78);
    }
    .list-item {
      transition: all .3s;
      &:hover {
        cursor: pointer;
        background-color: aliceblue;
        color: #222
      }
    }
</style>
