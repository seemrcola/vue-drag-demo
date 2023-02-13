// 自动导入ui-组件 比如说ant-design-vue  element-plus等
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'

export function antDesignSetup(): any[] {
  return [
    Components({
      // importStyle = false 样式就没了
      resolvers: [
        AntDesignVueResolver({ importStyle: true, resolveIcons: true }),
      ],
    }),
  ]
}
