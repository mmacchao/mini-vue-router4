// 1. 定义路由组件.


// 2. 定义一些路由
// $route.meta会合并父子级meta
const routes = [
  {
    path: '/post',
    component: {
      template: `<div>
  <h1>parent</h1>
  <router-view></router-view>
</div>`,

    },
    meta: {
      abc: false,
      // requiresAuth: false
    },
    children: [
      {
        path: 'new',
        component: {template: '<div>new</div>'},
        // 只有经过身份验证的用户才能创建帖子
        meta: {requiresAuth: true}
      },
      {
        path: ':id',
        component: {template: ':id'},
        // 任何人都可以阅读文章
        meta: {requiresAuth: false}
      }
    ]
  },
  {path: '/login', component: {template: 'login page'}}
]

// 3. 创建路由实例并传递 `routes` 配置
// 你可以在这里输入更多的配置，但我们在这里
// 暂时保持简单
const router = VueRouter.createRouter({
  // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
  history: VueRouter.createWebHashHistory(),
  routes, // `routes: routes` 的缩写
})

router.beforeEach((to, from) => {
  if(to.path !== '/login')
    console.log(to.meta)
  // 而不是去检查每条路由记录
  // to.matched.some(record => record.meta.requiresAuth)
  if (to.meta.requiresAuth) {
    // 此路由需要授权，请检查是否已登录
    // 如果没有，则重定向到登录页面
    return {
      path: '/login',
      // 保存我们所在的位置，以便以后再来
      query: {redirect: to.fullPath},
    }
  }
})

// 5. 创建并挂载根实例
const app = Vue.createApp({})
//确保 _use_ 路由实例使
//整个应用支持路由。
app.use(router)

app.mount('#app')

// 现在，应用已经启动了！
