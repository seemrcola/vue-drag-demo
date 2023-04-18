<script setup lang='ts'>
import { onMounted } from 'vue'
import { useVitrualList } from '@/hooks/useVitrualList'
import img from '@/assets/vue.svg'

const components: any[] = []
for (let i = 0; i < 50000; i++)
  components.push({ url: img, text: '1000' })

const { generateObserver, onObserve } = useVitrualList(
  '.list-item',
  components,
  { cacheLength: 50, rootSelector: '.vitural' },
)

onMounted(() => {
  generateObserver()
  onObserve()
})
</script>

<template>
  <div
    h="500px" max-h="500px" w-full overflow-auto
    relative
    class="no-scroll-bar vitural"
  >
    <div
      v-for="(component, index) of components"
      :key="index"
      class=".list-item"
      :data-index="index"
      flex items-center h="36px"
      bg="#555" b-b="1px solid #fff"
    >
      <img :src="component.url" h-6 w-6 mx-4>
      <p> {{ component.text.toLocaleUpperCase() }}</p>
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
</style>
