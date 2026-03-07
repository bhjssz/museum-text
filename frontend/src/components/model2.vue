<template>
<div class="page">

  <!-- Three.js 渲染容器 -->
  <div ref="container"></div>

  <!-- 展品介绍卡 -->
  <div class="museum-card">
    <div class="card-header">
      <div class="card-title">土族传统服饰</div>
      <div class="card-subtitle">Tuzu Costume</div>
    </div>

    <div class="card-divider"></div>

    <div class="card-content">
      土族服饰包括长袍、腰带、帽子等多种元素，色彩鲜艳，
      纹样富有民族特色。展现出土族独特的文化和审美风格，
      常用于节庆、婚礼以及其他重要仪式。
    </div>

    <div class="card-footer">
      <span>材质：布料</span>
      <span>风格：传统</span>
      <span>产地：甘肃天祝</span>
    </div>
  </div>

  <!-- 关闭按钮 -->
  <button class="close-btn" @click="handleClose">×</button>

</div>
</template>

<script setup>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const container = ref(null)

let scene, camera, renderer, controls
let animationId

// 初始化Three.js
function initScene(){

  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x2e2e2e)

  const width = window.innerWidth
  const height = window.innerHeight

  camera = new THREE.PerspectiveCamera(45,width/height,1,1000)
  camera.position.set(200,200,200)
  camera.lookAt(0,0,0)

  renderer = new THREE.WebGLRenderer({ antialias:true })
  renderer.setSize(width,height)
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.outputColorSpace = THREE.SRGBColorSpace

  container.value.appendChild(renderer.domElement)

  renderer.domElement.style.position='fixed'
  renderer.domElement.style.top='0'
  renderer.domElement.style.left='0'
  renderer.domElement.style.zIndex='0'

  controls = new OrbitControls(camera,renderer.domElement)
  controls.enableDamping=true

  // HDR环境光
  new RGBELoader().load('/studio_small_08_1k.hdr',(hdr)=>{
    hdr.mapping = THREE.EquirectangularReflectionMapping
    scene.environment = hdr
  })

  // 模型加载
  const loader = new GLTFLoader()
  loader.load('https://raw.githubusercontent.com/bhjssz/museumimages/main/%E5%9C%9F%E6%97%8F%E6%9C%8D%E9%A5%B0.glb',(gltf)=>{

    gltf.scene.scale.set(150,150,150)

    gltf.scene.traverse(obj=>{
      if(obj.isMesh){

        if(obj.geometry.index){
          obj.geometry = obj.geometry.toNonIndexed()
        }

        obj.geometry.computeVertexNormals()

        obj.material.flatShading=false
        obj.material.roughness=0.55
        obj.material.metalness=0.95
        obj.material.envMapIntensity=1.3
        obj.material.needsUpdate=true
      }
    })

    scene.add(gltf.scene)

  })

  // 灯光系统
  const mainSpot = new THREE.SpotLight(0xffffff,2.2,800,Math.PI/6,0.4)
  mainSpot.position.set(0,300,120)
  mainSpot.target.position.set(0,100,0)

  scene.add(mainSpot)
  scene.add(mainSpot.target)

  scene.add(new THREE.AmbientLight(0x222222,0.4))

  const side1 = new THREE.PointLight(0x333333,0.5,600)
  side1.position.set(-300,80,0)

  const side2 = new THREE.PointLight(0x333333,0.5,600)
  side2.position.set(300,80,0)

  const backLight = new THREE.PointLight(0x222222,0.5,600)
  backLight.position.set(0,100,-300)

  scene.add(side1,side2,backLight)

  const floorBounce = new THREE.HemisphereLight(0xffffff,0x202020,0.3)
  scene.add(floorBounce)

  animate()

  window.addEventListener('resize',onWindowResize)
}

// 渲染循环
function animate(){
  animationId=requestAnimationFrame(animate)

  controls.update()
  renderer.render(scene,camera)
}

// 窗口变化
function onWindowResize(){

  const width = window.innerWidth
  const height = window.innerHeight

  camera.aspect = width/height
  camera.updateProjectionMatrix()

  renderer.setSize(width,height)

}

// 返回页面
function handleClose(){
  router.push('/App')
}

onMounted(()=>{
  initScene()
})

onBeforeUnmount(()=>{

  window.removeEventListener('resize',onWindowResize)

  cancelAnimationFrame(animationId)

  controls?.dispose()
  renderer?.dispose()

})
</script>

<style scoped>

.page{
  width:100%;
  height:100%;
}

.close-btn{
  position:fixed;
  top:30px;
  right:38px;
  width:40px;
  height:40px;
  border:none;
  background:rgba(0,0,0,0.6);
  color:white;
  font-size:28px;
  cursor:pointer;
  border-radius:50%;
  z-index:2000;
}

.close-btn:hover{
  background:rgba(0,0,0,0.9);
}

/* 信息卡 */

.museum-card{

  position:fixed;
  top:7vh;
  left:4vw;
  width:360px;

  padding:22px;

  background:rgba(20,20,20,0.75);
  backdrop-filter:blur(12px);

  color:#e8e8e8;

  border-radius:14px;
  border:1px solid rgba(138,122,90,0.22);

  box-shadow:0 18px 45px rgba(0,0,0,0.55);

  z-index:999;

}

.card-title{
  font-size:18px;
  font-weight:600;
}

.card-subtitle{
  font-size:12px;
  color:#7c9c88;
}

.card-divider{
  margin:14px 0;
  height:1px;
  background:linear-gradient(to right,#557364,#32463c);
}

.card-content{
  font-size:14px;
  line-height:1.8;
}

.card-footer{
  margin-top:16px;
  display:flex;
  justify-content:space-between;
  font-size:12px;
}

</style>