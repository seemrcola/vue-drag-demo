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
      for (const item of entries) {
        const target = item.target as HTMLElement
        const index = Number(target.dataset.index)
        if (item.intersectionRatio > 0) {
          requestAnimationFrame(() => {
            target.style.visibility = ''
            if (index >= 1)
              (elements[index - 1] as HTMLElement).style.visibility = ''
            if (index < elements.length - 1)
              (elements[index + 1] as HTMLElement).style.visibility = ''
          })
        }
        else {
          requestAnimationFrame(() => {
            target.style.visibility = 'hidden'
          })
        }
      }
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
    relative
    class="no-scroll-bar vitural"
  >
    <div
      w-full z--1 absolute bg="#fff"
      :style="{ height: `${components.length * 36}px` }"
    />
    <div
      v-for="(component, index) of components"
      :key="index"
      class=".list-item"
      :data-index="index"
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
