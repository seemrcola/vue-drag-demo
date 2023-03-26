import { defineAsyncComponent } from 'vue'
import { toysComponentsConfig } from './comp.config'
import { compType } from '@/enum/materiel.enum'

const components = toysComponentsConfig.map(config => config.name)

export function setupToysComponents(app: any) {
  components.forEach(async (name) => {
    const instance = defineAsyncComponent(() => import(`./${name}/index.vue`))
    console.log('000000')
    await app.component(`${compType.TOYS}${name}`, instance)
  })
}
