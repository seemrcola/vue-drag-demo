import { visualizer } from 'rollup-plugin-visualizer'

export function rollupVisualizerSetup(): any[] {
  return [
    visualizer(),
  ]
}
