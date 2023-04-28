import { toysComponentsConfig } from './toys/comp.config'
import { chartComponentsConfig } from './charts/comp.config'
import { CompType } from '@/enum/materiel.enum'

// todo 另外的几个类型还没有组件
export const componentsConfig = {
  [CompType.TOYS]: toysComponentsConfig,
  [CompType.CHART]: chartComponentsConfig,
  [CompType.SHAPE]: [],
  [CompType.MEDIA]: [],
}
