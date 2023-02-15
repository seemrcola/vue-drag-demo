import { createPinia } from 'pinia'

export function setupStore(app: any) {
  app.use(createPinia())
}
