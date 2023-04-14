import { CompType } from '@/enum/materiel.enum'

export interface ImgGlobResult {
  img: string // 图片本体
  name: string // 图片名称 图片名称要和组件文件夹名称一致
}

export type GlobResult = Record<string, unknown>
/**
 * 这里要注意：我们如果ans直接返回一个src路径字符串 在打包之后会处理成一个base64
 * 后续我们需要根据src路径来拿到图片名称 并根据图片名称找到对应的组件
 * 如果变成base64就找不到了
 */
export function imgGlob(dir: CompType): ImgGlobResult[] {
  let ans: GlobResult
  switch (dir) {
    case CompType.TOYS:
      ans = import.meta.glob('/src/assets/img/toys/*.png', { eager: true })
      break
    case CompType.CHART:
      ans = import.meta.glob('/src/assets/img/charts/*.png', { eager: true })
      break
    case CompType.SHAPE:
      ans = import.meta.glob('/src/assets/img/shape/*.png', { eager: true })
      break
    case CompType.MEDIA:
      ans = import.meta.glob('/src/assets/img/media/*.png', { eager: true })
  }
  return toArray(ans)
}

function toArray(record: GlobResult) {
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
