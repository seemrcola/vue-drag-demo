// todo 这个分包操作不生效 一直有一堆报错 不知道为啥---------------------------------
import fs from 'fs'

function isLargeModule(id) {
  const f = fs.statSync(id)
  return f.size > 100 * 1024
}

export function rollupChunkSetup(): any {
  return {
    manualChunks(id) {
      if (isLargeModule(id))
        return 'large'
    },
    chunkFileNames: 'chunks/[name]-[hash].js',
  }
}
