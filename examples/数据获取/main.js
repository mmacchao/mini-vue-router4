// 1. 定义路由组件.
const Post = {
  data() {
    return {
      loading: false,
      error: null,
      post: null
    }
  },
  created() {
    // watch 路由的参数，以便再次获取数据
    this.$watch(
      () => this.$route.params,
      () => {
        this.fetchData()
      },
      // 组件创建完后获取数据，
      // 此时 data 已经被 observed 了
      { immediate: true }
    )
  },
  methods: {
    fetchData() {
      this.error = this.post = null
      this.loading = true
      // replace `getPost` with your data fetching util / API wrapper
      this.getPost(this.$route.params.id, (err, post) => {
        console.log(err, post)
        this.loading = false
        if (err) {
          this.error = err.toString()
        } else {
          this.post = post
        }
      })
    },
    getPost(id, cb) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const res = {title: 'title', body: id}
          if(cb) {
            cb(null, res)
          }
          resolve(res)
        }, 1000)
      })
    }
  },
  template: `
  <div class="post">
    <div v-if="loading" class="loading">Loading...</div>

    <div v-if="error" class="error">{{ error }}</div>

    <div v-if="post" class="content">
      <h2>{{ post.title }}</h2>
      <p>{{ post.body }}</p>
    </div>
  </div>`
}
function getPost(id, cb) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const res = {title: 'post2', body: id}
      if(cb) {
        cb(null, res)
      }
      resolve(res)
    }, 1000)
  })
}

// 在导航完成前获取数据，可能要写两遍
const Post2 = {
  data() {
    return {
      loading: false,
      error: null,
      post: null
    }
  },
  beforeRouteEnter(to, from, next) {
    console.log('beforeRouteEnter')
    getPost(to.params.id, (err, post) => {
      next(vm => vm.setData(err, post))
    })
  },
  // 路由改变前，组件就已经渲染完了
  // 逻辑稍稍不同
  async beforeRouteUpdate(to, from) {
    console.log('beforeRouteUpdate')
    this.post = null
    try {
      this.post = await getPost(to.params.id)
    } catch (error) {
      this.error = error.toString()
    }
  },
  methods: {
    setData(err, post) {
      this.post = post
      this.error = err
    }
  },
  template: `
  <div class="post">
    <div v-if="loading" class="loading">Loading...</div>

    <div v-if="error" class="error">{{ error }}</div>

    <div v-if="post" class="content">
      <h2>{{ post.title }}</h2>
      <p>{{ post.body }}</p>
    </div>
  </div>`
}


// 2. 定义一些路由
// 发现相对重定向的一个bug
const routes = [
  {path: '/', component: {template: 'Home'}},
  {path: '/post/:id', component: Post},
  {path: '/post2/:id', component: Post2},
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
