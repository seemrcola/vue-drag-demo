import { createRouter, createWebHashHistory } from 'vue-router'
import WorkArea from '@/pages/workarea/index.vue'
import Test from '@/pages/test/index.vue'

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
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export function setupRouter(app: any) {
  app.use(router)
}
