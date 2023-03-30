import { createRouter, createWebHashHistory } from 'vue-router'
import WorkArea from '@/pages/workarea/index.vue'
import Test from '@/pages/test/index.vue'
import Preview from '@/pages/preview/index.vue'

const routes = [
  {
    path: '/',
    name: 'workarea',
    component: WorkArea,
  },
  {
    path: '/test',
    name: 'test',
    component: Test,
  },
  {
    path: '/preview',
    name: 'preview',
    component: Preview,
  },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export function setupRouter(app: any) {
  app.use(router)
}
