const { RouterLink, useLink } = VueRouter
const { computed } = Vue

// 自定义一个router-link
export const AppLink = {
  name: 'AppLink',

  props: {
    // 如果使用 TypeScript，请添加 @ts-ignore
    ...RouterLink.props,
    inactiveClass: String,
  },
  template: `
    <a v-if="isExternalLink" target="_blank" :href="to.slice(1)"><slot></slot></a>
    <a v-else v-bind="$attrs"  :href="href" @click="navigate"><slot></slot></a>
  `,

  setup(props) {
    const {
      // 解析出来的路由对象
      route,
      // 用在链接里的 href
      href,
      // 布尔类型的 ref 标识链接是否匹配当前路由
      isActive,
      // 布尔类型的 ref 标识链接是否严格匹配当前路由
      isExactActive,
      // 导航至该链接的函数
      navigate
    } = useLink(props)

    const isExternalLink = computed(
      () => {
        console.log(props.to)
        return typeof props.to === 'string' && props.to.startsWith('/http')
      }
    )

    return { isExternalLink, href, navigate, isActive }
  },
}
