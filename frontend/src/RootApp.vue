<template>
  <div>
    <!-- 页面内容渲染在这里 -->
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
body, html, #app { 
  height: 100%; 
  margin: 0; 
}
</style>