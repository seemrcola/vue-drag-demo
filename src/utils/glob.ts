import { compType } from '@/enum/materiel.enum'

type GlobResult = Record<string, unknown>

export function imgGlob(dir: compType): string[] {
  let ans: GlobResult
  switch (dir) {
    case compType.TOYS:
      ans = import.meta.glob('/src/assets/img/toys/*.png', { eager: true })
      break
    case compType.CHART:
      ans = import.meta.glob('/src/assets/img/charts/*.png', { eager: true })
      break
    case compType.SHAPE:
      ans = import.meta.glob('/src/assets/img/shape/*.png', { eager: true })
      break
    case compType.MEDIA:
      ans = import.meta.glob('/src/assets/img/media/*.png', { eager: true })
  }
  return toArray(ans)
}

export function toArray(record: GlobResult) {
  const ans: string[] = []
  Object.keys(record).forEach(key => ans.push((record[key] as any).default))
  return ans
}
