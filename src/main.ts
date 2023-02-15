import { createApp } from 'vue'
// 基本样式
import './style.css'
// 标尺样式
import 'vue3-sketch-ruler/lib/style.css'
// unocss
import 'uno.css'
import App from './App.vue'
import { setupRouter } from './router'
import { setupStore } from './store'

function setupApp() {
  const app = createApp(App)
  setupRouter(app)
  setupStore(app)
  app.mount('#app')
}
setupApp()
