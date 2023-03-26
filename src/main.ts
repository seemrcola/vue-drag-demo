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
// global components
import { setupToysComponents } from '@/pages/workarea/materiel/toys/comp.index'

useKeyboard()
useOS()

function setupApp() {
  const app = createApp(App)
  setupRouter(app)
  setupStore(app)
  setupToysComponents(app)
  console.log(app.component('toys-virus'))
  console.log(app.component('toys-automaton'))
  console.log(app.component('toys-plum'))
  console.log(app.component('toys-random'))
  console.log(app.component('toys-mines'))
  app.mount('#app')
}
setupApp()
