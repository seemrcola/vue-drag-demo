<script setup lang='ts'>
const props = defineProps<{
  text: string
  value: string | number
}>()
</script>

<template>
  <label for="" flex-1 f-c-c>
    <div w-10 mr-2 font-700>{{ props.text }}</div>
    <input
      readonly input w-20 cursor-not-allowed
      :value="props.value"
    >
  </label>
</template>
