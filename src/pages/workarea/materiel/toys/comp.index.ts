import type { Component } from 'vue'
import { defineAsyncComponent } from 'vue'
const requireComponent = import.meta.glob(
  './**/index.vue',
  {},
)

/**
 * requireComponent[fileName] 是一个() => import(path)函数，返回一个Promise
 * defineAsyncComponent文档地址 https://cn.vuejs.org/guide/components/async.html
 */

export const toysComponents: { name: string; component: Component }[]
  = Object.keys(requireComponent).map((fileName) => {
    const name = fileName
      .replace(/^\.\//, '')
      .replace(/\/index.vue$/, '')

    const component = defineAsyncComponent({
      loader: () => requireComponent[fileName]() as Promise<Component>,
    })

    return {
      name,
      component,
    }
  })
