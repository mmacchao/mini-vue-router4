// 1. 定义路由组件.
const UsersLayout = {
  template: `<div>
    <h2>parent</h2>
    <router-view></router-view>
</div>`
}


// 2. 定义一些路由
// 发现相对重定向的一个bug
const routes = [
  { path: '/home', redirect: '/' },
  {path: '/', component: {template: 'Home'}},
  {path: '/users/abc', component: {template: '/users/abc'}},
  {path: '/users/:id/posts', redirect(to) {
    // 相对路径不推荐使用，因为是相对于from.path，而不是to.path，理解起来有负担
    return 'profile'
  }},
  {path: '/users/:id/profile', component: {template: '/users/:id/profile'}},
  {
    path: '/users',
    component: UsersLayout,
    children: [
      // 为这 3 个 URL 呈现 UserList
      // - /users
      // - /users/list
      // - /people
      { path: '', component: {template: '<div>{{JSON.stringify($route)}}</div>'}, alias: ['/people', 'list'] },
    ],
  },
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
const app = Vue.createApp({})
//确保 _use_ 路由实例使
//整个应用支持路由。
app.use(router)

app.mount('#app')

// 现在，应用已经启动了！
