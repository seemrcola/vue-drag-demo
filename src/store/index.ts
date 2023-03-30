import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

export function setupStore(app: any) {
  console.log('pinia setup')
  const piniaInstance = createPinia()
  piniaInstance.use(piniaPluginPersistedstate)
  app.use(piniaInstance)
}
