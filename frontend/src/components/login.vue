<template>

<div class="login-page">

<h2>VR数字博物馆登录</h2>

<input v-model="username" placeholder="请输入账号">

<input v-model="password" type="password" placeholder="请输入密码">

<button @click="login">登录</button>

<button @click="register">注册</button>

</div>

</template>

<script setup>

import {ref} from "vue"
import {useRouter} from "vue-router"

const router = useRouter()

const username = ref("")
const password = ref("")

// 登录
const login = async ()=>{

const res = await fetch("http://localhost:3000/login",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
username:username.value,
password:password.value
})

})

const data = await res.json()

if(data.success){

alert("登录成功")

router.push("/xuanze")

}else{

alert("账号或密码错误")

}

}

// 注册
const register = async ()=>{

const res = await fetch("http://localhost:3000/register",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
username:username.value,
password:password.value
})

})

const data = await res.json()

alert(data.message)

}

</script>

<style scoped>

.login-page{

display:flex;

flex-direction:column;

align-items:center;

justify-content:center;

height:100vh;

background:#0b0f1a;

color:white;

}

input{

margin:10px;

padding:10px;

width:220px;

}

button{

margin:10px;

padding:10px;

width:120px;

}

</style>