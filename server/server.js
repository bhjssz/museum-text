// server.js

const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const bcrypt = require("bcryptjs")

const app = express()

app.use(cors())
app.use(express.json())

// 连接 MongoDB
mongoose.connect(
  "mongodb+srv://museumUser:museum123456@cluster0.rx4hm40.mongodb.net/museum?retryWrites=true&w=majority"
)
.then(()=> console.log("MongoDB connected"))
.catch(err=> console.log(err))


/* 用户模型 */

const User = mongoose.model("User",{

  username:String,

  password:String,

  age:Number,

  region:String,

  createdAt:{
    type:Date,
    default:Date.now
  },

  lastLogin:Date

})


/* 注册 */

app.post("/register", async(req,res)=>{

  const {username,password,age,region} = req.body

  try{

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

  }catch(err){

    console.log(err)

    res.status(500).send({msg:"服务器错误"})

  }

})


/* 登录 */

app.post("/login", async(req,res)=>{

  const {username,password} = req.body

  try{

    const user = await User.findOne({username})

    if(!user){
      return res.send({msg:"用户不存在"})
    }

    const valid = await bcrypt.compare(password,user.password)

    if(!valid){
      return res.send({msg:"密码错误"})
    }

    // 更新最后登录时间
    user.lastLogin = new Date()

    await user.save()

    // 管理员账户
    const adminUsers = ["admin","bhjss"]

    const isAdmin = adminUsers.includes(username)

    res.send({

      msg:"登录成功",

      user,

      isAdmin

    })

  }catch(err){

    console.log(err)

    res.status(500).send({msg:"服务器错误"})

  }

})


/* 获取所有用户（后台） */

app.get("/users", async(req,res)=>{

  try{

    const users = await User.find({},{

      password:0

    })

    res.send(users)

  }catch(err){

    console.log(err)

    res.status(500).send({msg:"获取用户失败"})

  }

})


/* 获取访客总数 */

app.get("/visitor-count", async(req,res)=>{

  try{

    const count = await User.countDocuments()

    res.send({count})

  }catch(err){

    console.log(err)

    res.status(500).send({msg:"统计失败"})

  }

})


/* 获取统计数据 */

app.get("/stats", async(req,res)=>{

  try{

    const totalUsers = await User.countDocuments()

    const today = new Date()

    today.setHours(0,0,0,0)

    // 今日注册人数
    const todayRegister = await User.countDocuments({

      createdAt:{$gte:today}

    })

    // 今日登录人数
    const todayLogin = await User.countDocuments({

      lastLogin:{$gte:today}

    })

    res.send({

      totalUsers,

      todayRegister,

      todayLogin

    })

  }catch(err){

    console.log(err)

    res.status(500).send({msg:"统计失败"})

  }

})



/* 启动服务器 */

const PORT = process.env.PORT || 3000

app.listen(PORT,()=>{

  console.log("Server running on port",PORT)

})