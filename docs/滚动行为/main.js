// 1. 定义路由组件.
const UsersLayout = {
  template: `<div>
    <h2>parent</h2>
    <router-view></router-view>
</div>`
}


// 2. 定义一些路由
/**
 * 1. 浏览器默认行为：滚动到底部后，切换路由会导致滚动条回到顶部，其他情况会保持scrollTop不变
 * 2. 每次滚动都是html标签的滚动，因为调用的是window.scrollTo函数
 * 3. 添加了el元素后，预期就是通过滚动window，让el显示在最顶部然后再加上top的偏移量，
 * 4. 如果el才是router-view的容器，想要实现el内部的内容每次滚动到顶部需要手动实现
 * 5. savedPosition是由vue-router内部记录的window的scrollX和scrollY，因此假如要实现的记录内部如el的滚动位置，则savedPosition不能实现
 * 6. 滚动到锚点和添加el元素是一样的效果
 * 7. 要记录滚动位置可以在导航守卫里面记录前一个页面的滚动位置，并恢复当前页面的滚动位置，滚动位置可以记录在meta里面
 */

const routes = [
  {
    path: '/foo',
    component: {template: '<div style="height: 200vh;">foo</div>'},
  },
  {
    path: '/bar',
    component: {template: '<div style="height: 300vh;">bar</div>'},
  },
]
// 3. 创建路由实例并传递 `routes` 配置
// 你可以在这里输入更多的配置，但我们在这里
// 暂时保持简单
const router = VueRouter.createRouter({
  // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
  history: VueRouter.createWebHashHistory(),
  routes, // `routes: routes` 的缩写
  scrollBehavior(to, from, savedPosition) {
    console.log('savedPosition', savedPosition)
    // 始终滚动到顶部
    // const el = document.querySelector('#router-wrapper')
    // el.scrollTo(0, 0)
    if(to.hash) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if(to.hash) {
            resolve({
              el: to.hash,
              behavior: 'smooth', // 滚动动画 smooth（有动画） | instant（瞬间滚动） | auto（依赖css的值）
            })
          } else {
            resolve()
          }
        }, 500)
      })
    }


    if(to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth', // 滚动动画 smooth（有动画） | instant（瞬间滚动） | auto（依赖css的值）
      }
    }

    if(savedPosition) {
      // console.log(savedPosition)
      return savedPosition
    }

    // 返回空对象和falsy等效于啥也没干
    return {
      // top: 0,
      // el: '#router-wrapper'
    }
  },
})

// 5. 创建并挂载根实例
const app = Vue.createApp({})
//确保 _use_ 路由实例使
//整个应用支持路由。
app.use(router)

app.mount('#app')

// 现在，应用已经启动了！
