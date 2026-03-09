<template>
  <div class="page">

    <div class="card">

      <h2 class="title">用户注册</h2>

      <input v-model="username" placeholder="用户名" />
      <input v-model="password" type="password" placeholder="密码" />
      <input v-model="age" placeholder="年龄" />
      <input v-model="region" placeholder="地域" />

      <button class="primary" @click="register">注册</button>

      <button class="link" @click="goLogin">
        已有账号？去登录
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
const age = ref("")
const region = ref("")

function register(){

  axios.post("https://museum-api-z66b.onrender.com/register",{
    username: username.value,
    password: password.value,
    age: age.value,
    region: region.value
  }).then(res=>{

    alert(res.data.msg)

    if(res.data.msg === "注册成功"){
      router.push("/login")
    }

  })

}

function goLogin(){
  router.push("/login")
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
  background:#22c55e;
  color:white;
  cursor:pointer;
  margin-top:10px;
}

.primary:hover{
  background:#16a34a;
}

.link{
  margin-top:15px;
  background:none;
  border:none;
  color:#86efac;
  cursor:pointer;
}

.link:hover{
  text-decoration:underline;
}

</style>