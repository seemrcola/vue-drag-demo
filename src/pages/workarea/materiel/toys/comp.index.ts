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
