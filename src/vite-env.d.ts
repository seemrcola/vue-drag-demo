/// <reference types="vite/client" />

// https://juejin.cn/post/6968364365237993479 用于解决main文件import App报错
declare module '*.vue' {
  import { defineComponent } from 'vue'
  const Component: ReturnType<typeof defineComponent>
  export default Component
}
