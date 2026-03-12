<template>

<div>

<h1>账号管理</h1>

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

<td>{{u.age??"未知"}}</td>

<td>{{u.region||"未知"}}</td>

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

import {ref,onMounted} from "vue"
import axios from "axios"

const API="https://museum-api-z66b.onrender.com"

const users=ref([])

onMounted(loadUsers)

async function loadUsers(){

const res=await axios.get(`${API}/users`)

users.value=res.data

}

async function deleteUser(id){

if(!confirm("确定删除该用户？"))return

await axios.delete(`${API}/user/${id}`)

loadUsers()

}

</script>

<style scoped>

table{
width:100%;
border-collapse:collapse;
background:white;
border-radius:10px;
overflow:hidden;
box-shadow:0 5px 20px rgba(0,0,0,0.05);
}

th{
background:#2563eb;
color:white;
padding:12px 25px;
text-align:center;
}

td{
padding:10px;
border-bottom:1px solid #eee;
text-align:center;
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
