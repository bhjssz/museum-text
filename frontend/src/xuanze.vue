<template>

<div class="map">

<h2 class="title">天祝藏族文化数字展馆</h2>

<!-- 藏族服饰 -->
<div class="marker left" @click="goApp">
<img src="https://cdn.jsdelivr.net/gh/bhjssz/museumimages@main/choice1.png">
<p>藏族服饰</p>
</div>

<!-- 青铜耗牛 -->
<div class="marker center" @click="goRoom2">
<img src="https://cdn.jsdelivr.net/gh/bhjssz/museumimages@main/choice2.png">
<p>青铜耗牛</p>
</div>

<!-- 高原春秋 -->
<div class="marker right" @click="goRoom3">
<img src="https://cdn.jsdelivr.net/gh/bhjssz/museumimages@main/choice3.png">
<p>高原春秋</p>
</div>

</div>

</template>

<script setup>

import { useRouter } from "vue-router"

const router = useRouter()

const goApp = ()=>{
router.push("/App")
}

const goRoom2 = ()=>{
router.push("/room2")
}

const goRoom3 = ()=>{
router.push("/room3")
}

</script>

<style scoped>

.map{

width:100%;
height:100vh;

background:url("https://cdn.jsdelivr.net/gh/bhjssz/museumimages@main/background.png") no-repeat center center;

background-size:cover;

position:relative;

background-color:#0b0f1a;

}
.marker p{
margin-top:15px;
}

/* 标题 */

.title{

position:absolute;

top:60px;

left:50%;

transform:translateX(-50%);

font-size:38px;

color:#d4af37;

letter-spacing:4px;

text-shadow:0 0 12px rgba(212,175,55,0.8);

}

/* 选项 */

.marker{

position:absolute;

display:flex;

flex-direction:column;

align-items:center;

cursor:pointer;

color:#f2e3b6;

font-size:26px;

transition:0.3s;

}

/* 图片变大 */

.marker img{

width:240px;

filter:drop-shadow(0 0 10px rgba(212,175,55,0.7));

}

/* 悬停效果 */

.marker:hover{

transform:scale(1.15);

}

.marker:hover img{

filter:drop-shadow(0 0 25px gold);

}

/* 位置整体上移 */

.left{

top:40%;
left:15%;

}

.center{

top:40%;
left:42%;

}

.right{

top:40%;
left:69%;

}

</style>