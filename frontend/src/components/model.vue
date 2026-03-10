<template>
<div class="page">

  <div ref="container"></div>

  <div class="museum-card">
    <div class="card-header">
      <div class="card-title">天祝青铜牦牛</div>
      <div class="card-subtitle">Bronze Yak</div>
    </div>

    <div class="card-divider"></div>

    <div class="card-content">
      雕塑身长118厘米，重75公斤，整体造型以静立姿态呈现，
      双目圆睁，结构紧凑而富有张力。艺术家通过对肌理、
      体量与比例的精准把控，使作品在稳定中蕴含动态，
      展现出力量感与生命张力并存的审美特征。
    </div>

    <div class="card-footer">
      <span>材质：铜</span>
      <span>尺寸：长118cm</span>
      <span>重量：75kg</span>
    </div>
  </div>

  <button class="close-btn" @click="handleClose">×</button>

</div>
</template>

<script setup>

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import { ref,onMounted,onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const container = ref(null)

let scene,camera,renderer,controls
let animationId

function initScene(){

  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x2e2e2e)

  const width = window.innerWidth
  const height = window.innerHeight

  camera = new THREE.PerspectiveCamera(45,width/height,1,1000)
  camera.position.set(200,200,200)

  renderer = new THREE.WebGLRenderer({antialias:true})
  renderer.setSize(width,height)
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.outputColorSpace = THREE.SRGBColorSpace

  container.value.appendChild(renderer.domElement)

  renderer.domElement.style.position="fixed"
  renderer.domElement.style.top="0"
  renderer.domElement.style.left="0"

  controls = new OrbitControls(camera,renderer.domElement)
  controls.enableDamping=true

  // HDR环境光
  new RGBELoader().load('/studio_small_08_1k.hdr',(hdr)=>{
      hdr.mapping = THREE.EquirectangularReflectionMapping
      scene.environment = hdr
  })

  // 加载模型
  const loader = new GLTFLoader()

  loader.load('https://cdn.jsdelivr.net/gh/bhjssz/museumimages@main/tongniu.glb',(gltf)=>{

      gltf.scene.scale.set(150,150,150)

      gltf.scene.traverse((obj)=>{

          if(obj.isMesh){

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

  // 灯光

  const mainSpot = new THREE.SpotLight(0xffffff,2.2,800,Math.PI/6,0.4)
  mainSpot.position.set(0,300,120)
  scene.add(mainSpot)

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

  window.addEventListener("resize",onWindowResize)

}

function animate(){

  animationId=requestAnimationFrame(animate)

  controls.update()

  renderer.render(scene,camera)

}

function onWindowResize(){

  const width = window.innerWidth
  const height = window.innerHeight

  camera.aspect = width/height
  camera.updateProjectionMatrix()

  renderer.setSize(width,height)

}

function handleClose(){

  router.push('/room2')

}

onMounted(()=>{

  if(container.value){

      initScene()

  }

})

onBeforeUnmount(()=>{

  cancelAnimationFrame(animationId)

  window.removeEventListener("resize",onWindowResize)

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

.museum-card{

position:fixed;
top:7vh;
left:4vw;
width:360px;

padding:22px;

background:linear-gradient(
180deg,
rgba(24,24,24,0.78),
rgba(10,10,10,0.68)
);

color:#e8e8e8;

border-radius:14px;

border:1px solid rgba(138,122,90,0.22);

box-shadow:0 18px 45px rgba(0,0,0,0.55);

backdrop-filter:blur(12px);

z-index:999;

}

.card-title{
font-size:18px;
font-weight:600;
}

.card-subtitle{
font-size:12px;
color:rgba(85,115,100,0.8);
}

.card-divider{
margin:14px 0;
height:1px;
background:linear-gradient(
to right,
rgba(85,115,100,0.85),
rgba(50,70,60,0.25)
);
}

.card-content{
font-size:14px;
line-height:1.8;
}

.card-footer{
margin-top:18px;
display:flex;
justify-content:space-between;
font-size:12px;
}

</style>