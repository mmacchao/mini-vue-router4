<template>
  <div class="home">
    主页
    <router-link to="/a">A页面</router-link>
    <router-link to="/b">B页面</router-link>
    <router-view></router-view>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'HomeView',
  components: {
    HelloWorld
  }
}
</script>
