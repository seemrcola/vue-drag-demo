import { createApp } from 'vue'
// 基本样式
import './style.scss'
// 标尺样式
import 'vue3-sketch-ruler/lib/style.css'
// unocss
import 'uno.css'
import App from './App.vue'
import { setupRouter } from './router'
import { setupStore } from './store'
// global hooks
import { useKeyboard } from '@/hooks/useFnKeyboard'
import { useOS } from '@/hooks/useOS'
import { useIfWebkit } from '@/hooks/useIfWebkit'
// global components
import { materielSetup } from '@/pages/workarea/materiel/comp.index'

useKeyboard()
useOS()
useIfWebkit()

function setupApp() {
  const app = createApp(App)
  setupRouter(app)
  setupStore(app)
  materielSetup(app)
  app.mount('#app')

  if (!window.$ifwebkit)
    alert('为了更好的体验，建议使用Chrome， Edge或者Arc浏览器')
}
setupApp()
