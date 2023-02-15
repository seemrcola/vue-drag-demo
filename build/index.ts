import { viteEslintSetup } from './eslint'

export function pluginSetup() {
  return [
    ...viteEslintSetup(),
  ]
}
