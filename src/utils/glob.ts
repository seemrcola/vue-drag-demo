import { compType } from '@/enum/materiel.enum'

export interface ImgGlobResult {
  img: string // 图片本体
  name: string // 图片名称 图片名称要和组件文件夹名称一致
}

export type GlobResult = Record<string, unknown>

export function imgGlob(dir: compType): ImgGlobResult[] {
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
  return Object.keys(record).map((key) => {
    return {
      img: (record[key] as any).default,
      name: getImgName(key),
    }
  })
}

function getImgName(imgsrc: string) {
  const imgname = imgsrc.split('/').pop()?.split('.')[0]
  return imgname as string
}
