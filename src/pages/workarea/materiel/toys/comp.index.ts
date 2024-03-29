import { defineAsyncComponent } from 'vue'
import { toysComponentsConfig } from './comp.config'
import { CompType } from '@/enum/materiel.enum'

const components = toysComponentsConfig.map(config => config.name)

export function setupToysComponents(app: any) {
  components.forEach((name) => {
    const instance = defineAsyncComponent({
      loader: () => import(`./${name}/index.vue`),
      onError: () => { console.log('[Error] toys render failed') },
    })
    app.component(`${CompType.TOYS}-${name}`, instance)
  })
}
