<script setup lang='ts'>
import { computed, onMounted, watch } from 'vue'
import { useViewStore } from '@/store/modules'
import type { IComponent } from '@/store/types/view'
const viewStore = useViewStore()
const components = computed(() => viewStore.components)

let intersectionObserver: any
let elements: Element[]

function getUrl({ thumbnail }: IComponent) {
  return new URL(`../../../../${thumbnail}`, import.meta.url).href
}

function generateObserver() {
  intersectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((item) => {
        if (item.intersectionRatio <= 0)
          return
        console.log(entries, 'load') // 这里面有很多坐标相关属性，可以在这里做点文章
      })
    },
    { root: document.querySelector('.vitural') },
  )
}

function onObserve() {
  elements = Array.from(document.getElementsByClassName('.list-item'))
  for (const ele of elements)
    intersectionObserver.observe(ele)
}

function updateObserver() {
  elements = Array.from(document.getElementsByClassName('.list-item'))
  const len = elements.length
  intersectionObserver.observe(elements[len - 1])
}

onMounted(() => {
  generateObserver()
  onObserve()
})

watch(
  () => components.value.length,
  (nlength, olength) => {
    if (nlength < olength)
      return
    requestAnimationFrame(() => {
      updateObserver()
    })
  },
)
</script>

<template>
  <div
    h="500px" max-h="500px" overflow-auto
    class="no-scroll-bar vitural"
  >
    <div
      v-for="(component, index) of components"
      :key="index"
      class=".list-item"
      flex items-center h="36px"
      bg="#555" b-b="1px solid #fff"
    >
      <img :src="getUrl(component)" h-6 w-6 mx-4>
      <p> {{ component.name.toLocaleUpperCase() }}</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  ::-webkit-scrollbar {
    width: 0px; /* 宽度设置为0，隐藏滚动条 */
    background-color: transparent; /* 滚动条背景色 */
  }
  /* 特定于火狐浏览器的样式 */
  mozilla::-moz-scrollbar {
    width: 0px;
    background-color: transparent;
  }
  mozilla::-moz-scrollbar-thumb {
    display: none; /* 隐藏火狐滚动条的thumb部分 */
  }
</style>
