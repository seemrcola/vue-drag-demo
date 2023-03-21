import { createPinia } from 'pinia'

export function setupStore(app: any) {
  console.log('pinia setup')
  app.use(createPinia())
}
