<script setup lang='ts'>

</script>

<template>
  <div h="100vh" w="100vw">
    <header w-full h="50px" f-c-c>
      Header
    </header>
    <div w-full h="[calc(100vh-50px)]" flex>
      <router-view v-slot="{ Component }">
        <transition mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
  </div>
</template>
