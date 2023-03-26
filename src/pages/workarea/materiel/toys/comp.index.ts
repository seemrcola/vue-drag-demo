import { defineAsyncComponent } from 'vue'
import { toysComponentsConfig } from './comp.config'
import { compType } from '@/enum/materiel.enum'
import Message from '@/components/message/index.vue'

const components = toysComponentsConfig.map(config => config.name)

export function setupToysComponents(app: any) {
  components.forEach((name) => {
    const instance = defineAsyncComponent({
      loader: () => import(`./${name}/index.vue`),
      loadingComponent: Message,
    })
    console.log('000000')
    app.component(`${compType.TOYS}${name}`, instance)
  })
}
