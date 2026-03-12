<template>

<div>

<h1>系统数据概览</h1>

<div class="cards">

<div class="card">
<h3>总用户</h3>
<p>{{stats.totalUsers}}</p>
</div>

<div class="card">
<h3>今日注册</h3>
<p>{{stats.todayRegister}}</p>
</div>

<div class="card">
<h3>今日登录</h3>
<p>{{stats.todayLogin}}</p>
</div>

</div>

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

</div>

</template>

<script setup>

import {ref,onMounted,nextTick} from "vue"
import axios from "axios"
import * as echarts from "echarts"

const API="https://museum-api-z66b.onrender.com"

const stats=ref({})

const users=ref([])

const regionChart=ref(null)
const ageChart=ref(null)

let regionEchart=null
let ageEchart=null

onMounted(async()=>{

const resUsers=await axios.get(`${API}/users`)
users.value=resUsers.data

const resStats=await axios.get(`${API}/stats`)
stats.value=resStats.data

await nextTick()

drawRegionChart()
drawAgeChart()

})

function drawRegionChart(){

const map={}

users.value.forEach(u=>{

const r=u.region||"未知"

map[r]=(map[r]||0)+1

})

regionEchart=echarts.init(regionChart.value)

regionEchart.setOption({

tooltip:{},

xAxis:{type:"category",data:Object.keys(map)},

yAxis:{type:"value"},

series:[{type:"bar",data:Object.values(map)}]

})

}

function drawAgeChart(){

const map={}

users.value.forEach(u=>{

const a=u.age??"未知"

map[a]=(map[a]||0)+1

})

ageEchart=echarts.init(ageChart.value)

ageEchart.setOption({

tooltip:{},

xAxis:{type:"category",data:Object.keys(map)},

yAxis:{type:"value"},

series:[{type:"bar",data:Object.values(map)}]

})

}

</script>

<style scoped>

.cards{
display:flex;
gap:20px;
margin:20px 0;
}

.card{
flex:1;
background:white;
padding:25px;
border-radius:10px;
text-align:center;
box-shadow:0 5px 15px rgba(0,0,0,0.08);
}

.card p{
font-size:30px;
color:#2563eb;
font-weight:bold;
}

.charts{
display:flex;
gap:30px;
}

.chart-box{
flex:1;
background:white;
padding:20px;
border-radius:10px;
box-shadow:0 5px 15px rgba(0,0,0,0.08);
}

.chart{
height:350px;
}

</style>