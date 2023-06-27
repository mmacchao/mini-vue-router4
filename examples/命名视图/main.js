// 1. 定义路由组件.
const Home = {template: '<div>Home</div>'}
const LeftSidebar = {template: 'LeftSidebar'}
const RightSidebar = {template: `
  <!-- UserSettings.vue -->
  <div>
    <h1>User Settings</h1>
     <router-link to="/emails">go to emails</router-link>
      <router-link to="/profile">go to profile</router-link><br>
    <router-view /><br>
    <router-view name="helper" />
  </div>
`}

// 2. 定义一些路由
const routes = [
  {
    path: '/',
    components: {
      default: Home,
      // LeftSidebar: LeftSidebar 的缩写
      LeftSidebar,
      // 它们与 `<router-view>` 上的 `name` 属性匹配
      RightSidebar,
    },
    children: [
      {
        path: 'emails',
        component: {template: 'child emails'}
      },
      {
        path: 'profile',
        components: {
          default: {template: 'child default'},
          helper: {template: 'child helper'}
        }
      }
    ]
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
