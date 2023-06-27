// import * as Vue from 'vue'
// import * as VueRouter from '../../router/index'
const User = {
  template: '<div>User {{ $route.params.id }}</div>',
  beforeRouteUpdate() {
    console.log(this.$route)
  }
}
const NotFound = {
  template: '<div>404</div>',
  beforeRouteUpdate() {
    console.log('404')
  }
}

// 每个path会被转化成正则，且会得到一个评分，评分高的优先匹配
const routes = [
  {path: '/users/a', component: {template: '<div>static A</div>'}},
  // 动态字段以冒号开始
  { path: '/users/:id', component: User },

  // 将匹配所有内容并将其放在 `$route.params.pathMatch` 下
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
  // 将匹配以 `/user-` 开头的所有内容，并将其放在 `$route.params.afterUser` 下
  // { path: '/user-:afterUser(.*)', component: UserGeneric },
]
// 3. 创建路由实例并传递 `routes` 配置
// 你可以在这里输入更多的配置，但我们在这里
// 暂时保持简单
const router = VueRouter.createRouter({
  // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
  history: VueRouter.createWebHashHistory(),
  routes, // `routes: routes` 的缩写
})

// 5. 创建并挂载根实例
const app = Vue.createApp({
  methods: {
    goto() {
      this.$router.push({
        path: '/userssgds/c436',
        // name: 'NotFound',
        // 保留当前路径并删除第一个字符，以避免目标 URL 以 `//` 开头。
        params: { pathMatch: this.$route.path.substring(1).split('/') },
        // 保留现有的查询和 hash 值，如果有的话
        query: this.$route.query,
        hash: this.$route.hash,
      })
    }
  }
})
//确保 _use_ 路由实例使
//整个应用支持路由。
app.use(router)

app.mount('#app')

// 现在，应用已经启动了！
