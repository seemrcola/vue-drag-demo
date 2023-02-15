import { createRouter, createWebHashHistory } from 'vue-router'
import WorkArea from '@/pages/workarea/index.vue'

const routes = [
  {
    path: '/',
    name: 'workarea',
    component: WorkArea,
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export function setupRouter(app: any) {
  app.use(router)
}
