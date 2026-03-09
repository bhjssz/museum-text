const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const bcrypt = require("bcryptjs")

const app = express()

app.use(cors())
app.use(express.json())

mongoose.connect("mongodb+srv://museumUser:museum123456@cluster0.rx4hm40.mongodb.net/museum?retryWrites=true&w=majority")
.then(()=>{
 console.log("MongoDB connected")
})
.catch(err=>{
 console.log(err)
})

const User = mongoose.model("User",{
 username:String,
 password:String,
 age:Number,
 region:String
})

/* 注册 */

app.post("/register", async(req,res)=>{

 const {username,password,age,region} = req.body

 const exist = await User.findOne({username})

 if(exist){
  return res.send({msg:"用户已存在"})
 }

 const hash = await bcrypt.hash(password,10)

 const user = new User({
  username,
  password:hash,
  age,
  region
 })

 await user.save()

 res.send({msg:"注册成功"})
})

/* 登录 */

app.post("/login", async(req,res)=>{

 const {username,password} = req.body

 const user = await User.findOne({username})

 if(!user){
  return res.send({msg:"用户不存在"})
 }

 const valid = await bcrypt.compare(password,user.password)

 if(!valid){
  return res.send({msg:"密码错误"})
 }

 res.send({msg:"登录成功",user})
})

const PORT = process.env.PORT || 3000

app.listen(PORT,()=>{
 console.log("server running")
})