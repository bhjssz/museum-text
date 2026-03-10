<template>
<div class="admin-page">

  <div class="top-bar">
    <h1>数字博物馆后台管理</h1>
    <button class="logout-btn" @click="logout">退出</button>
  </div>

  <p class="welcome">管理员：{{ user.username }}</p>

  <!-- 数据卡片 -->
  <div class="stats-cards">

    <div class="card">
      <h3>总用户</h3>
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


  <!-- 图表 -->

  <div class="charts">

    <div class="chart-box">
      <h2>用户地区分布</h2>
      <div ref="regionChart" class="chart"></div>
    </div>

    <div class="chart-box">
      <h2>年龄分布</h2>
      <div ref="ageChart" class="chart"></div>
    </div>

  </div>


  <!-- 用户列表 -->

  <h2>用户列表</h2>

  <table>

    <thead>
      <tr>
        <th>用户名</th>
        <th>年龄</th>
        <th>地区</th>
        <th>操作</th>
      </tr>
    </thead>

    <tbody>

      <tr v-for="u in users" :key="u._id">

        <td>{{u.username}}</td>
        <td>{{u.age}}</td>
        <td>{{u.region}}</td>

        <td>
          <button class="delete-btn" @click="deleteUser(u._id)">
            删除
          </button>
        </td>

      </tr>

    </tbody>

  </table>

</div>
</template>

<script setup>

import {ref,onMounted,nextTick} from "vue"
import axios from "axios"
import {useRouter} from "vue-router"
import * as echarts from "echarts"

const router = useRouter()

const API = "https://museum-api-z66b.onrender.com"

const user = ref(JSON.parse(localStorage.getItem("user")||"{}"))

const users = ref([])
const stats = ref({})

const regionChart = ref(null)
const ageChart = ref(null)

onMounted(async()=>{

  try{

    const resUsers = await axios.get(`${API}/users`)
    users.value = resUsers.data

    const resStats = await axios.get(`${API}/stats`)
    stats.value = resStats.data

    await nextTick()

    drawRegionChart()
    drawAgeChart()

  }catch(err){

    console.error(err)
    alert("获取后台数据失败")

  }

})


/* 地区统计图 */

function drawRegionChart(){

  const map={}

  users.value.forEach(u=>{

    const r=u.region||"未知"

    map[r]=(map[r]||0)+1

  })

  const chart=echarts.init(regionChart.value)

  chart.setOption({

    tooltip:{},

    xAxis:{
      type:"category",
      data:Object.keys(map)
    },

    yAxis:{type:"value"},

    series:[{
      type:"bar",
      data:Object.values(map)
    }]

  })

}


/* 年龄统计图 */

function drawAgeChart(){

  const map={}

  users.value.forEach(u=>{

    const a=u.age||"未知"

    map[a]=(map[a]||0)+1

  })

  const chart=echarts.init(ageChart.value)

  chart.setOption({

    tooltip:{},

    xAxis:{
      type:"category",
      data:Object.keys(map)
    },

    yAxis:{type:"value"},

    series:[{
      type:"bar",
      data:Object.values(map)
    }]

  })

}


/* 删除用户 */

async function deleteUser(id){

  if(!confirm("确定删除该用户？")) return

  try{

    await axios.delete(`${API}/user/${id}`)

    alert("删除成功")

    location.reload()

  }catch(err){

    alert("删除失败")

  }

}


function logout(){

  localStorage.removeItem("user")

  router.push("/xuanze")

}

</script>

<style scoped>

.admin-page{
  padding:40px;
  background:#f4f6f9;
  font-family:Arial;
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

.welcome{
  margin:10px 0 20px 0;
}

/* 统计卡片 */

.stats-cards{
  display:flex;
  gap:20px;
  margin-bottom:30px;
}

.card{
  flex:1;
  background:white;
  padding:20px;
  border-radius:10px;
  text-align:center;
  box-shadow:0 3px 10px rgba(0,0,0,0.1);
}

.card p{
  font-size:28px;
  font-weight:bold;
  color:#3b82f6;
}


/* 图表 */

.charts{
  display:flex;
  gap:30px;
  margin-bottom:40px;
}

.chart-box{
  flex:1;
  background:white;
  padding:20px;
  border-radius:10px;
  box-shadow:0 3px 10px rgba(0,0,0,0.1);
}

.chart{
  height:350px;
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

.delete-btn{
  background:#ef4444;
  color:white;
  border:none;
  padding:6px 12px;
  border-radius:4px;
  cursor:pointer;
}

</style>