import fs from 'fs'
import { visualizer } from 'rollup-plugin-visualizer'

function isLargeModule(id) {
  const { size } = fs.statSync(id)
  return size > 100 * 1024
}

export function rollupVisualizerSetup(): any[] {
  return [
    visualizer(),
  ]
}
