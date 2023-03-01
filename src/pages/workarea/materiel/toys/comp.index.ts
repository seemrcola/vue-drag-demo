import { defineComponent } from 'vue'
const requireComponent = import.meta.glob('./**/index.vue')

export default Object.keys(requireComponent).map((fileName) => {
  const componentConfig = defineComponent(() => requireComponent[fileName]())

  const componentName = fileName
    .replace(/^\.\//, '')
    .replace(/\/index.vue$/, '')

  return {
    name: componentName,
    component: componentConfig,
  }
})
