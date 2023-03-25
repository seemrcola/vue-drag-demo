import { defineAsyncComponent } from 'vue'
import { compType } from '@/enum/materiel.enum'

const components = [
  'mines',
  'plum',
  'random',
  'automaton',
  'virus',
]

export function setupToysComponents(app: any) {
  components.forEach((name) => {
    const instance = defineAsyncComponent(() => import(`./${name}/index.vue`))
    app.component(`${compType.TOYS}${name}`, instance)
  })
}
