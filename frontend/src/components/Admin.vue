<template>
<div class="admin-layout">

  <!-- 左侧导航 -->
  <aside class="sidebar">

    <h2>后台管理</h2>

    <div 
      class="menu-item"
      :class="{active:tab==='dashboard'}"
      @click="tab='dashboard'"
    >
      数据概览
    </div>

    <div 
      class="menu-item"
      :class="{active:tab==='users'}"
      @click="tab='users'"
    >
      账号管理
    </div>

    <button class="logout-btn" @click="logout">
      退出登录
    </button>

  </aside>

  <!-- 内容区 -->
  <main class="content">

    <Dashboard v-if="tab==='dashboard'" />

    <UserManage v-if="tab==='users'" />

  </main>

</div>
</template>

<script setup>

import {ref} from "vue"
import {useRouter} from "vue-router"

import Dashboard from "./Dashboard.vue"
import UserManage from "./UserManage.vue"

const router = useRouter()

const tab = ref("dashboard")

function logout(){

  localStorage.removeItem("user")

  router.push("/xuanze")

}

</script>

<style scoped>

.admin-layout{
display:flex;
height:100vh;
background:#f4f6f9;
}

/* 左侧导航 */

.sidebar{
width:220px;
background:#1f2937;
color:white;
padding:20px;
}

.sidebar h2{
margin-bottom:30px;
}

.menu-item{
padding:12px;
margin-bottom:10px;
cursor:pointer;
border-radius:6px;
}

.menu-item:hover{
background:#374151;
}

.active{
background:#2563eb;
}

.logout-btn{
margin-top:40px;
width:100%;
padding:10px;
background:#ef4444;
border:none;
color:white;
border-radius:6px;
cursor:pointer;
}

/* 右侧内容 */

.content{
flex:1;
padding:30px;
overflow:auto;
}

</style>