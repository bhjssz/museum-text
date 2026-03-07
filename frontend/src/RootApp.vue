<template>
  <div>
    <!-- 简单根容器：路由页面将渲染在这里 -->
    <router-link to="/xuanze">选择展馆</router-link> |
    <router-link to="/App">App</router-link> |
    <router-link to="/room2">Room2</router-link> |
    <router-link to="/room3">Room3</router-link> |

    <router-view />
  </div>
</template>

<script>
export default {
  name: 'RootApp'
}
</script>

<style>
/* 根应用样式可在此扩展 */
body, html, #app { height: 100%; margin: 0; }
</style>
