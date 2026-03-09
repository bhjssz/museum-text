<template>
  <div class="admin-page">
    <h1>后台管理页面</h1>
    <p>欢迎管理员：{{ user.username }}</p>

    <h2>总注册用户数：{{ visitorCount }}</h2>

    <h2>用户列表</h2>
    <table>
      <thead>
        <tr>
          <th>用户名</th>
          <th>年龄</th>
          <th>地域</th>
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

// 从 localStorage 获取登录用户信息
const user = ref(JSON.parse(localStorage.getItem("user")) || {})

// 保护路由：非管理员跳回选择页
onMounted(() => {
  const adminUsers = ["admin", "bhjss", "bhjssz"]
  if (!user.value.username || !adminUsers.includes(user.value.username)) {
    alert("你没有权限访问后台")
    router.push("/xuanze")
  } else {
    fetchData()
  }
})

// 数据状态
const users = ref([])
const visitorCount = ref(0)

// 拉取用户信息和访客量
async function fetchData() {
  try {
    const resUsers = await axios.get(`${API}/users?username=${user.value.username}`)
    users.value = resUsers.data

    const resCount = await axios.get(`${API}/visitor-count?username=${user.value.username}`)
    visitorCount.value = resCount.data.count
  } catch (err) {
    console.error(err)
    alert("获取数据失败")
  }
}
</script>

<style scoped>
.admin-page {
  padding: 20px;
  font-family: Arial, sans-serif;
  background: #f5f7fa;
  min-height: 100vh;
}
h1 { color: #111827; margin-bottom: 10px; }
h2 { color: #1f2937; margin-top: 20px; }
table { width: 100%; border-collapse: collapse; margin-top: 10px; }
th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
th { background-color: #3b82f6; color: white; }
tr:nth-child(even) { background-color: #f0f4f8; }
</style>