const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const bcrypt = require("bcryptjs")

const app = express()

app.use(cors())
app.use(express.json())


/* MongoDB连接 */

mongoose.connect(
"mongodb+srv://museumUser:museum123456@cluster0.rx4hm40.mongodb.net/museum?retryWrites=true&w=majority"
)

.then(()=>{

    console.log("MongoDB connected")

})

.catch(err=>{

    console.log("MongoDB error:",err)

})


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



/* 注册接口 */

app.post("/register",async(req,res)=>{

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

    }

    catch(err){

        console.log(err)

        res.status(500).send({msg:"服务器错误"})

    }

})



/* 登录接口 */

app.post("/login",async(req,res)=>{

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

        user.lastLogin = new Date()

        await user.save()


        /* 管理员账号 */

        const adminUsers = ["bhjssz"]

        const isAdmin = adminUsers.includes(username)


        /* 不返回密码 */

        const {password:pw,...safeUser} = user.toObject()


        res.send({

            msg:"登录成功",

            user:safeUser,

            isAdmin

        })

    }

    catch(err){

        console.log(err)

        res.status(500).send({msg:"服务器错误"})

    }

})



/* 获取所有用户（后台） */

app.get("/users",async(req,res)=>{

    try{

        const users = await User.find({},{

            password:0

        })

        res.send(users)

    }

    catch(err){

        console.log(err)

        res.status(500).send({msg:"获取用户失败"})

    }

})



/* 删除用户 */

app.delete("/user/:id",async(req,res)=>{

    try{

        await User.findByIdAndDelete(req.params.id)

        res.send({msg:"删除成功"})

    }

    catch(err){

        console.log(err)

        res.status(500).send({msg:"删除失败"})

    }

})



/* 访客总数 */

app.get("/visitor-count",async(req,res)=>{

    try{

        const count = await User.countDocuments()

        res.send({count})

    }

    catch(err){

        console.log(err)

        res.status(500).send({msg:"统计失败"})

    }

})



/* 后台统计数据 */

app.get("/stats",async(req,res)=>{

    try{

        const totalUsers = await User.countDocuments()

        const today = new Date()

        today.setHours(0,0,0,0)


        /* 今日注册 */

        const todayRegister = await User.countDocuments({

            createdAt:{$gte:today}

        })


        /* 今日登录 */

        const todayLogin = await User.countDocuments({

            lastLogin:{$gte:today}

        })


        res.send({

            totalUsers,

            todayRegister,

            todayLogin

        })

    }

    catch(err){

        console.log(err)

        res.status(500).send({msg:"统计失败"})

    }

})



/* 服务器启动 */

const PORT = process.env.PORT || 3000

app.listen(PORT,()=>{

    console.log("Server running on port",PORT)

})