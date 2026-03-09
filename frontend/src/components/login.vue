<template>
  <div class="page">

    <div class="card">

      <h2 class="title">用户登录</h2>

      <input v-model="username" placeholder="用户名" />
      <input v-model="password" type="password" placeholder="密码" />

      <button class="primary" @click="login">登录</button>

      <button class="link" @click="goRegister">
        没有账号？去注册
      </button>

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

function login(){

  axios.post("https://museum-api-z66b.onrender.com/login",{
    username: username.value,
    password: password.value
  }).then(res=>{

    alert(res.data.msg)

    if(res.data.msg === "登录成功"){
      localStorage.setItem("user", JSON.stringify(res.data.user))
      router.push("/xuanze")
    }

  })

}

function goRegister(){
  router.push("/register")
}

</script>

<style scoped>

.page{
  height:100vh;
  display:flex;
  justify-content:center;
  align-items:center;
  background:linear-gradient(135deg,#0f172a,#1e293b);
}

.card{
  width:380px;
  padding:40px;
  border-radius:16px;
  background:rgba(255,255,255,0.06);
  backdrop-filter:blur(15px);
  box-shadow:0 20px 50px rgba(0,0,0,0.6);
  text-align:center;
}

.title{
  color:white;
  margin-bottom:25px;
}

input{
  width:100%;
  padding:12px;
  margin-bottom:16px;
  border-radius:8px;
  border:none;
  outline:none;
}

.primary{
  width:100%;
  padding:12px;
  border:none;
  border-radius:8px;
  background:#3b82f6;
  color:white;
  cursor:pointer;
  margin-top:10px;
}

.primary:hover{
  background:#2563eb;
}

.link{
  margin-top:15px;
  background:none;
  border:none;
  color:#93c5fd;
  cursor:pointer;
}

.link:hover{
  text-decoration:underline;
}

</style>