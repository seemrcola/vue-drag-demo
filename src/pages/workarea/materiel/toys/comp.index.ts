const requireComponent = import.meta.glob(
  './**/index.vue',
  { eager: true },
)

export const toysComponents
  = Object.keys(requireComponent).map((fileName) => {
    const component = (requireComponent[fileName] as any).default

    const name = fileName
      .replace(/^\.\//, '')
      .replace(/\/index.vue$/, '')

    return {
      name,
      component,
    }
  })
