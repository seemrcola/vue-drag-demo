import { toysComponentsConfig } from './toys/comp.config'
import { compType } from '@/enum/materiel.enum'

// todo 另外的几个类型还没有组件
export const componentsConfig = {
  [compType.TOYS]: toysComponentsConfig,
  [compType.CHART]: [],
  [compType.SHAPE]: [],
  [compType.MEDIA]: [],
}
