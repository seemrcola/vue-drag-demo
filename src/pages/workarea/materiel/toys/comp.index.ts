const requireComponent = import.meta.glob(
  './**/index.vue',
  { eager: true },
)

export const toysComponents
  = Object.keys(requireComponent).map(async (fileName) => {
    const component = await import(fileName)

    const name = fileName
      .replace(/^\.\//, '')
      .replace(/\/index.vue$/, '')

    return {
      name,
      component,
    }
  })
