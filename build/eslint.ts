import viteEslint from 'vite-plugin-eslint'

export function viteEslintSetup() {
  return [
    viteEslint(),
  ]
}
