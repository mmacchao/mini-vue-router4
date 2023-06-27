const User = {
  // 请确保添加一个与路由参数完全相同的 prop 名
  props: ['id'],
  template: '<div>User {{ id }}</div>'
}
const routes = [
  {path: '/', component: {template: 'home'}},
  { path: '/user/:id', component: User, props: true }
]

// 3. 创建路由实例并传递 `routes` 配置
// 你可以在这里输入更多的配置，但我们在这里
// 暂时保持简单
const router = VueRouter.createRouter({
  // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
  history: VueRouter.createWebHashHistory(),
  routes, // `routes: routes` 的缩写
})

// next可选, 返回false取消导航或者用next重定向
router.beforeEach((to, from, next) => {
  // ...
  // 返回 false 以取消导航
  // return false
  if(to.path === '/') {
    next('/user/next')
  } else {
    next()
  }
})

// 1 beforeRouteLeave
// 2
router.beforeEach
// 3 在重用的组件里调用 beforeRouteUpdate
// 4 在路由配置里调用 beforeEnter
// 5 在被激活的组件里调用 beforeRouteEnter
// 6
router.beforeResolve
// 7
router.afterEach
// 8 调用 beforeRouteEnter 守卫中传给 next 的回调函数，创建好的组件实例会作为回调函数的参数传入


// 5. 创建并挂载根实例
const app = Vue.createApp({})
//确保 _use_ 路由实例使
//整个应用支持路由。
app.use(router)

app.mount('#app')

// 现在，应用已经启动了！
