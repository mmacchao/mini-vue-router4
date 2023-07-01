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
  {path: '/', component: {template: 'Home'}},
  {path: '/bar', component: {template: 'bar'}},
  {path: '/bar2', component: {template: 'bar2'}},
  {path: '/bar3', component: {template: 'bar3'}},
  {path: '/bar4', component: {template: 'bar4'}},
  {path: '/bar5', redirect: '/redirect'},
  {path: '/foo', component: {template: 'foo'}},
  {path: '/redirect', component: {template: 'redirect'}},
]

// 3. 创建路由实例并传递 `routes` 配置
// 你可以在这里输入更多的配置，但我们在这里
// 暂时保持简单
const router = VueRouter.createRouter({
  // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
  history: VueRouter.createWebHashHistory(),
  routes, // `routes: routes` 的缩写
})

router.beforeEach((to, form) => {
  // console.log(to)
  if(to.query.isFail) {
    return false
  }
  if(to.query.async) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve()
      }, 2000)
    })
  }
  if(to.query.redirect) {
    return '/redirect'
  }
})


// 5. 创建并挂载根实例
const {isNavigationFailure, NavigationFailureType} = VueRouter
const app = Vue.createApp({
  methods: {
    async goto(path, query = {}) {
      const failure = await this.$router.push({
        path,
        query,
        // hash: '#test'
      })
      /**
       * 重定向检测，包括路由配置重定向和导航守卫中重定向
       */
      if(this.$router.currentRoute.value.redirectedFrom) {
        console.log('检测到重定向')
      }

      /**
       * 导航故障检测
       */
      if (isNavigationFailure(failure, NavigationFailureType.aborted)) {
        alert('在导航守卫中终止了导航')
      } else if(isNavigationFailure(failure, NavigationFailureType.cancelled)) {
        alert('在当前导航还没有完成之前又有了一个新的导航')
      } else if(isNavigationFailure(failure, NavigationFailureType.duplicated)) {
        alert('导航重复，因为我们已经在目标位置了')
      } else if(failure) {
        alert('其他导航失败情况')
      }
    }
  }
})
//确保 _use_ 路由实例使
//整个应用支持路由。
app.use(router)

app.mount('#app')

// 现在，应用已经启动了！
