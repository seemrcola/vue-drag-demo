import { instances as ToysInstances, setupToysComponents } from './toys/comp.index'

export function materielSetup(app: any) {
  setupToysComponents(app)
}

export function getInstances() {
  return [
    ...ToysInstances,
  ]
}
