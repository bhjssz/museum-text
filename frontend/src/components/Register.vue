```vue
<template>
  <div class="page">
    <div class="card">

      <h2 class="title">Create Account</h2>
      <p class="subtitle">Register to access the Museum Experience</p>

      <div class="form">

        <div class="field">
          <label>Username</label>
          <input v-model="username" placeholder="Enter username"/>
        </div>

        <div class="field">
          <label>Password</label>
          <input type="password" v-model="password" placeholder="At least 6 characters"/>
        </div>

        <div class="field">
          <label>Confirm Password</label>
          <input type="password" v-model="confirmPassword"/>
        </div>

        <div class="field">
          <label>Age</label>
          <input type="number" v-model="age"/>
        </div>

        <!-- 国家选择 -->
        <div class="field">
          <label>Country</label>

          <select v-model="country">
            <option value="">Select country</option>
            <option v-for="c in countries" :key="c">
              {{c}}
            </option>
          </select>
        </div>

        <!-- 中国省份（自动出现） -->
        <transition name="fade">

          <div class="field" v-if="country === 'China'">
            <label>Province / Region</label>

            <select v-model="province">
              <option value="">Select province</option>

              <option v-for="p in chinaProvinces" :key="p">
                {{p}}
              </option>

            </select>
          </div>

        </transition>

        <p v-if="errorMsg" class="error">{{errorMsg}}</p>

        <button class="primary" :disabled="loading" @click="register">
          {{ loading ? "Registering..." : "Register" }}
        </button>

        <button class="link" @click="goLogin">
          Already have an account? Login
        </button>

      </div>

    </div>
  </div>
</template>

<script setup>
import {ref} from "vue"
import axios from "axios"
import {useRouter} from "vue-router"

const router = useRouter()

const username = ref("")
const password = ref("")
const confirmPassword = ref("")
const age = ref("")

const country = ref("")
const province = ref("")

const errorMsg = ref("")
const loading = ref(false)

const API = "https://museum-api-z66b.onrender.com"

/* 国家列表 */
const countries = [
  "China",
  "Canada",
  "United States",
  "United Kingdom",
  "France",
  "Germany",
  "Japan",
  "Australia",
  "Italy",
  "Spain"
]

/* 中国省级行政区（34个） */
const chinaProvinces = [
  "Beijing",
  "Shanghai",
  "Tianjin",
  "Chongqing",
  "Hebei",
  "Shanxi",
  "Liaoning",
  "Jilin",
  "Heilongjiang",
  "Jiangsu",
  "Zhejiang",
  "Anhui",
  "Fujian",
  "Jiangxi",
  "Shandong",
  "Henan",
  "Hubei",
  "Hunan",
  "Guangdong",
  "Hainan",
  "Sichuan",
  "Guizhou",
  "Yunnan",
  "Shaanxi",
  "Gansu",
  "Qinghai",
  "Taiwan",
  "Inner Mongolia",
  "Guangxi",
  "Tibet",
  "Ningxia",
  "Xinjiang",
  "Hong Kong",
  "Macau"
]

function validate(){

  if(!username.value){
    errorMsg.value="Enter username"
    return false
  }

  if(password.value.length < 6){
    errorMsg.value="Password must be at least 6 characters"
    return false
  }

  if(password.value !== confirmPassword.value){
    errorMsg.value="Passwords do not match"
    return false
  }

  if(!age.value || age.value <= 0){
    errorMsg.value="Enter valid age"
    return false
  }

  if(!country.value){
    errorMsg.value="Select country"
    return false
  }

  if(country.value === "China" && !province.value){
    errorMsg.value="Select province"
    return false
  }

  errorMsg.value=""
  return true
}

async function register(){

  if(!validate()) return

  loading.value=true

  let region = country.value

  if(country.value === "China"){
    region = `China - ${province.value}`
  }

  try{

    const res = await axios.post(`${API}/register`,{
      username: username.value,
      password: password.value,
      age: age.value,
      region
    })

    alert(res.data.msg)

    if(res.data.msg === "注册成功"){
      router.push("/login")
    }

  }catch(err){

    console.error(err)
    errorMsg.value="Registration failed"

  }

  loading.value=false
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
  font-family:Arial;
}

.card{
  width:420px;
  padding:40px;
  border-radius:16px;
  background:rgba(255,255,255,0.07);
  backdrop-filter:blur(20px);
  box-shadow:0 25px 60px rgba(0,0,0,0.6);
}

.title{
  color:white;
  margin-bottom:5px;
}

.subtitle{
  color:#cbd5f5;
  margin-bottom:25px;
  font-size:14px;
}

.field{
  display:flex;
  flex-direction:column;
  margin-bottom:16px;
}

label{
  color:#e2e8f0;
  font-size:13px;
  margin-bottom:6px;
}

input,select{
  padding:11px;
  border-radius:8px;
  border:none;
  outline:none;
}

.primary{
  width:100%;
  padding:12px;
  background:#22c55e;
  border:none;
  border-radius:8px;
  color:white;
  cursor:pointer;
}

.primary:hover{
  background:#16a34a;
}

.primary:disabled{
  background:#4ade80;
  cursor:not-allowed;
}

.link{
  margin-top:15px;
  background:none;
  border:none;
  color:#86efac;
  cursor:pointer;
}

.error{
  color:#f87171;
  font-size:13px;
}

.fade-enter-active{
  transition: all .3s ease;
}

.fade-enter-from{
  opacity:0;
  transform:translateY(-10px);
}

</style>
```
