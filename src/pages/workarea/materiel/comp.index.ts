import { setupToysComponents } from './toys/comp.index'
import { setupChartsComponents } from './charts/comp.index'

export function materielSetup(app: any) {
  setupToysComponents(app)
  setupChartsComponents(app)
}
