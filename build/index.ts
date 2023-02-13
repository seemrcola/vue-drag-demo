import { antDesignSetup } from './ant'
import { viteEslintSetup } from './eslint'

export function pluginSetup() {
  return [
    ...antDesignSetup(),
    ...viteEslintSetup(),
  ]
}
