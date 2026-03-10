<template>
<div class="admin-page">

  <div class="top-bar">
    <h1>数字博物馆后台管理</h1>
    <button class="logout-btn" @click="logout">退出后台</button>
  </div>

  <p class="welcome">管理员：{{ user.username }}</p>

  <!-- 统计卡片 -->
  <div class="stats-cards">

    <div class="card">
      <h3>总用户数</h3>
      <p>{{ stats.totalUsers }}</p>
    </div>

    <div class="card">
      <h3>今日注册</h3>
      <p>{{ stats.todayRegister }}</p>
    </div>

    <div class="card">
      <h3>今日登录</h3>
      <p>{{ stats.todayLogin }}</p>
    </div>

  </div>

  <h2>用户地区统计</h2>

  <table class="stats-table">
    <thead>
      <tr>
        <th>地区</th>
        <th>用户数量</th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="(count, region) in regionStats" :key="region">
        <td>{{ region }}</td>
        <td>{{ count }}</td>
      </tr>
    </tbody>
  </table>

  <h2>用户列表</h2>

  <table>
    <thead>
      <tr>
        <th>用户名</th>
        <th>年龄</th>
        <th>地区</th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="u in users" :key="u._id">
        <td>{{ u.username }}</td>
        <td>{{ u.age }}</td>
        <td>{{ u.region }}</td>
      </tr>
    </tbody>
  </table>

</div>
</template>

<script setup>

import { ref, onMounted } from "vue"
import axios from "axios"
import { useRouter } from "vue-router"

const router = useRouter()

const API = "https://museum-api-z66b.onrender.com"

const user = ref(JSON.parse(localStorage.getItem("user") || "{}"))

const users = ref([])
const stats = ref({})

const regionStats = ref({})

onMounted(async()=>{

  try{

    const resUsers = await axios.get(`${API}/users`)
    users.value = resUsers.data

    const resStats = await axios.get(`${API}/stats`)
    stats.value = resStats.data

    calculateRegionStats()

  }catch(err){

    console.error(err)
    alert("获取后台数据失败")

  }

})

function calculateRegionStats(){

  const s = {}

  users.value.forEach(u=>{

    const region = u.region || "未知"

    if(s[region]){
      s[region]++
    }else{
      s[region] = 1
    }

  })

  regionStats.value = s

}

function logout(){

  localStorage.removeItem("user")

  router.push("/xuanze")

}

</script>

<style scoped>

.admin-page{
  padding:40px;
  font-family:Arial;
  background:#f4f6f9;
}

.top-bar{
  display:flex;
  justify-content:space-between;
  align-items:center;
}

.logout-btn{
  background:#ef4444;
  color:white;
  border:none;
  padding:10px 16px;
  border-radius:6px;
  cursor:pointer;
}

.logout-btn:hover{
  background:#dc2626;
}

.welcome{
  margin-top:10px;
  margin-bottom:20px;
}

/* 统计卡片 */

.stats-cards{
  display:flex;
  gap:20px;
  margin-bottom:30px;
}

.card{
  background:white;
  padding:20px;
  border-radius:10px;
  box-shadow:0 3px 10px rgba(0,0,0,0.1);
  flex:1;
  text-align:center;
}

.card h3{
  margin-bottom:10px;
}

.card p{
  font-size:28px;
  font-weight:bold;
  color:#3b82f6;
}

/* 表格 */

table{
  width:100%;
  border-collapse:collapse;
  background:white;
}

th,td{
  border:1px solid #ddd;
  padding:10px;
}

th{
  background:#3b82f6;
  color:white;
}

tr:nth-child(even){
  background:#f1f5f9;
}

.stats-table{
  max-width:400px;
  margin-bottom:30px;
}

</style>