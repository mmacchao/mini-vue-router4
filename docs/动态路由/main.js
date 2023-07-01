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
  { path: '/:articleName', component: {template: '<div>{{$route.params.articleName}}</div>'} },
  {
    path: '/admin',
    name: 'admin',
    component: {template: `<h1>admin</h1><router-view></router-view>`},
    children: [
      {path: 'a', component: {template: 'admin A'}},
      {path: 'b', component: {template: 'admin B'}},
    ]
  }
]

// 3. 创建路由实例并传递 `routes` 配置
// 你可以在这里输入更多的配置，但我们在这里
// 暂时保持简单
const router = VueRouter.createRouter({
  // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
  history: VueRouter.createWebHashHistory(),
  routes, // `routes: routes` 的缩写
})

let needAdd = false
router.beforeEach(to => {
  if (to.query.dynamic && !needAdd) {
    router.addRoute({path: '/about', name: 'about', component: {template: '<div>new about</div>'}})
    needAdd = true
    // 触发重定向
    return to.fullPath
  }
  needAdd = false
})

// 5. 创建并挂载根实例
const app = Vue.createApp({
  methods: {
    addRoute() {
      this.$router.addRoute({path: '/about', name: 'about', component: {template: '<div>new about</div>'}})
      this.$router.replace('/about')
    },
    removeRoute() {
      this.$router.removeRoute('about')
    },
    addRoute2() {
      if(!this.$router.hasRoute('admin-c')) {
        /**
         * 同一个name的形式可以删除旧的，创建新的
         * 不加name则可以创建多个相同的路由
         */
        this.$router.addRoute('admin', {path: 'c', name: 'admin-c', component: {template: 'admin C'}})
        this.$router.replace('/admin/c')
        console.log(this.$router.getRoutes())
      }

    }
  }
})
//确保 _use_ 路由实例使
//整个应用支持路由。
app.use(router)

app.mount('#app')

// 现在，应用已经启动了！
