import { defineAsyncComponent } from 'vue'
import { toysComponentsConfig } from './comp.config'
import { compType } from '@/enum/materiel.enum'

const components = toysComponentsConfig.map(config => config.name)

export function setupToysComponents(app: any) {
  components.forEach((name) => {
    const instance = defineAsyncComponent({
      loader: () => import(`./${name}/index.vue`),
      onError: () => { console.log('[Error] render failed') },
    })
    app.component(`${compType.TOYS}-${name}`, instance)
  })
}

// 测试打包文件差异
// import Virus from './virus/index.vue'
// import Random from './random/index.vue'
// import Plum from './plum/index.vue'
// import Mines from './mines/index.vue'
// import Automaton from './automaton/index.vue'

// export function setupToysComponents(app: any) {
//   app.component('ToysVirus', Virus)
//   app.component('ToysRandom', Random)
//   app.component('ToysPlum', Plum)
//   app.component('ToysMines', Mines)
//   app.component('ToysAutomaton', Automaton)
// }
