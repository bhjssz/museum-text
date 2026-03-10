<template>
  <div class="page">
    <div class="overlay"></div>

    <div class="card">
      <!-- 卡片顶部装饰 -->
      <div class="card-decor-top">
        <span class="cloud cloud-left">☁</span>
        <span class="cloud cloud-right">☁</span>
      </div>

      <h2 class="title">天祝藏族数字博物馆登录</h2>

      <input v-model="username" placeholder="用户名" />
      <input v-model="password" type="password" placeholder="密码" />

      <button class="primary" @click="login">登录</button>
      <button class="link" @click="goRegister">没有账号？去注册</button>

      <!-- 卡片底部装饰 -->
      <div class="card-decor-bottom">
        <span class="pattern pattern-left">༺</span>
        <span class="pattern pattern-right">༻</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"
import axios from "axios"
import { useRouter } from "vue-router"

const router = useRouter()
const username = ref("")
const password = ref("")
const API = "https://museum-api-z66b.onrender.com"

function login() {
  if (!username.value || !password.value) {
    alert("请输入用户名和密码")
    return
  }

  axios.post(`${API}/login`, {
    username: username.value,
    password: password.value
  })
  .then(res => {
    alert(res.data.msg)
    if(res.data.msg === "登录成功") {
      localStorage.setItem("user", JSON.stringify(res.data.user))
      if(res.data.isAdmin){
        router.push("/admin")
      } else {
        router.push("/xuanze")
      }
    }
  })
  .catch(err => {
    console.error(err)
    alert("登录失败，请检查网络或服务器")
  })
}

function goRegister() {
  router.push("/register")
}
</script>

<style scoped>
.page {
  position: relative;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url("https://cdn.jsdelivr.net/gh/bhjssz/museumimages@main/loginbg.png") center/cover no-repeat;
  font-family: "Microsoft YaHei", Arial, sans-serif;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 15, 50, 0.6); /* 更深蓝遮罩 */
  z-index: 1;
}

.card {
  position: relative;
  z-index: 2;
  width: 420px;
  padding: 60px 40px 50px;
  border-radius: 25px;
  background: linear-gradient(145deg, #0a1f4f, #1e3a8a);
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.8);
  text-align: center;
  border: 2px solid #FFD700; /* 金色边框 */
  overflow: hidden;
}

/* 顶部祥云装饰 */
.card-decor-top {
  position: absolute;
  top: 10px;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  font-size: 28px;
  color: #FFD700;
  z-index: 3;
}

.cloud {
  user-select: none;
}

/* 底部藏族纹饰 */
.card-decor-bottom {
  position: absolute;
  bottom: 10px;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  font-size: 24px;
  color: #FFD700;
  z-index: 3;
}

.pattern {
  user-select: none;
}

.title {
  color: #FFD700;
  margin-bottom: 30px;
  font-weight: 700;
  font-size: 28px;
  text-shadow: 2px 2px 6px #000;
}

input {
  width: 90%;
  padding: 14px;
  margin-bottom: 20px;
  border-radius: 10px;
  border: none;
  outline: none;
  font-size: 16px;
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
  text-align: center;
}

input::placeholder {
  color: #FFD700;
}

.primary {
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(90deg, #1e3a8a, #3b82f6);
  color: #FFD700;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
  margin-top: 10px;
  transition: all 0.3s;
}

.primary:hover {
  background: linear-gradient(90deg, #3b82f6, #1e3a8a);
  transform: translateY(-2px);
}

.link {
  margin-top: 15px;
  background: none;
  border: none;
  color: #F59E0B;
  cursor: pointer;
  font-weight: 500;
}

.link:hover {
  text-decoration: underline;
  color: #FFD700;
}
</style>