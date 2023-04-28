import { defineAsyncComponent } from 'vue'
import { chartComponentsConfig } from './comp.config'
import { CompType } from '@/enum/materiel.enum'

const components = chartComponentsConfig.map(config => config.name)

export function setupChartsComponents(app: any) {
  components.forEach((name) => {
    const instance = defineAsyncComponent({
      loader: () => import(`./${name}/index.vue`),
      onError: () => { console.log('[Error] chart render failed') },
    })
    app.component(`${CompType.CHART}-${name}`, instance)
  })
}
