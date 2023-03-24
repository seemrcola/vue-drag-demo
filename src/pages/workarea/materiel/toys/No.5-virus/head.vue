<script setup lang='ts'>
const props = defineProps<{
  day: number
}>()
</script>

<template>
  <strong>
    <div>已经与疫情共处{{ props.day }}天</div>
  </strong>
</template>
