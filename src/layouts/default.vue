<template>
  <div h="100vh" w="100vw">
    <div w-full h-full flex>
      <router-view v-slot="{ Component }">
        <transition mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
  </div>
</template>
