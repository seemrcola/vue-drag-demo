import { rollupChunkSetup } from './chunk.rollup'
import { viteEslintSetup } from './eslint.vite'
import { rollupVisualizerSetup } from './visualizer.rollup'

export function vitePluginSetup() {
  return [
    ...viteEslintSetup(),
  ]
}

export function rollupPluginSetup() {
  return [
    ...rollupVisualizerSetup(),
  ]
}

export function rollupBuildSetup() {
  return {
    ...rollupChunkSetup(),
  }
}
