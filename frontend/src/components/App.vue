<!-- <template>
<router-link to="/home">首页</router-link> |
<router-link to="/blog">博客</router-link>
<router-view></router-view>
</template>

<script>
import { routerKey } from 'vue-router';


export default {
  name: 'App',
 
}
</script> -->




<template>
  <div class="container" ref="container"></div>
</template>

<script setup>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from 'vue-router';

const router = useRouter();

// 初始化场景
const scene = new THREE.Scene();
// 初始化相机
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
// 设置相机位置
camera.position.set(0, 0, 0.1);
// 初始化渲染器
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio || 1);

const container = ref(null);

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const clickables = [];
let lastHovered = null;

const renderLoop = () => {
  const time = performance.now() * 0.002;
  // animate any breathing markers (those storing material)
  clickables.forEach(obj => {
    const mat = obj.userData && obj.userData.breathMaterial;
    if (mat) {
      mat.opacity = 0.2 + Math.abs(Math.sin(time)) * 0.6;
    }
  });
  renderer.render(scene, camera);
  requestAnimationFrame(renderLoop);
};

// 添加球（全景纹理）
const geometry = new THREE.SphereGeometry(5, 32, 32);
const loader = new RGBELoader();
loader.load("https://cdn.jsdelivr.net/gh/bhjssz/museumimages@main/hall1.hdr", (texture) => {
  const material = new THREE.MeshBasicMaterial({ map: texture });
  const sphere = new THREE.Mesh(geometry, material);
  sphere.geometry.scale(1, 1, -1);
  scene.add(sphere);
});


// ★ 漂亮的交通实心箭头（推荐）
function createTrafficArrowSolid() {

  const shape = new THREE.Shape();

  // 一个好看的实心箭头轮廓
  shape.moveTo(0, 0.5);
  shape.lineTo(0.3, 0);
  shape.lineTo(0.1, 0);
  shape.lineTo(0.1, -0.5);
  shape.lineTo(-0.1, -0.5);
  shape.lineTo(-0.1, 0);
  shape.lineTo(-0.3, 0);
  shape.lineTo(0, 0.5);

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.05,
    bevelEnabled: false
  });

  const material = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  transparent: true,   // 开启透明
  opacity: 0.80        // 透明度（0完全透明，1完全不透明）
});

  const mesh = new THREE.Mesh(geometry, material);

  mesh.scale.set(0.8, 0.8, 0.8);
  mesh.lookAt(camera.position);

  return mesh;
}


// // ========== 新增：创建实心交通白色箭头（双箭头） ==========
// function createTrafficArrowSolid() {
//   const group = new THREE.Group();
//   const material = new THREE.MeshBasicMaterial({ color: 0xffffff });

//   // 创建一条厚实的箭头线条（实心立方体）
//   function makeBar(angleDeg, yOffset) {
//     const geom = new THREE.BoxGeometry(1.2, 0.25, 0.05); // 长、厚度、高度
//     const bar = new THREE.Mesh(geom, material);

//     // rotateZ 角度转换
//     bar.rotation.z = (angleDeg * Math.PI) / 180;

//     bar.position.y = yOffset;
//     return bar;
//   }

//   // 上箭头
//   const upper = makeBar(30, 0.28);
//   // 下箭头
//   const lower = makeBar(-30, -0.28);

//   group.add(upper);
//   group.add(lower);

//   // 缩放为合适大小
//   group.scale.set(0.35, 0.35, 0.35);

//   return group;
// }

// function addMarker(colorHex, position, targetRoute = null) {
//   const mat = new THREE.MeshBasicMaterial({ color: colorHex });
//   const geom = new THREE.SphereGeometry(0.12, 16, 16);
//   const mesh = new THREE.Mesh(geom, mat);
//   mesh.position.copy(position);
//   if (targetRoute) mesh.userData = { targetRoute };
//   scene.add(mesh);
//   clickables.push(mesh);
//   return mesh;
// }
// ========== 修改 addMarker：使用交通白色箭头 ==========
// function addMarker(position, targetRoute = null) {
//   const mesh = createTrafficArrowSolid(); // 使用上面创建的实心箭头
//   mesh.position.copy(position);

//   if (targetRoute) {
//     mesh.userData = { targetRoute };
//   }

//   scene.add(mesh);
//   clickables.push(mesh);

//   return mesh;
// }
// function addMarker(position, targetRoute = null) {
//   const group = createTrafficArrowSolid();
//   group.position.copy(position);

//   // 把两个箭头条（BoxMesh）全部加入 clickables
//   group.children.forEach(child => {
//     child.userData = { targetRoute };  // 每个孩子带上路由
//     clickables.push(child);
//   });

//   scene.add(group);
//   return group;
// }

// function addMarker(position, targetRoute = null) {
//   const mesh = createTrafficArrowSolid();  // 返回 Mesh
//   mesh.position.copy(position);

//   if (targetRoute) {
//     mesh.userData = { targetRoute };
//   }

//   scene.add(mesh);
//   clickables.push(mesh);   // ← 关键：直接把 Mesh 加入可点击列表

//   return mesh;
// }
// original arrow marker function remains unchanged
function addMarker(position, targetRoute = null, lookAtTarget = null) {
  const arrow = createTrafficArrowSolid();  
  arrow.position.copy(position);

  // 设置朝向
  if (lookAtTarget) {
    arrow.lookAt(lookAtTarget);
    arrow.rotation.z += Math.PI;  // 若方向反了，可删掉或修改
  }

  // ★ 关键：把箭头自身加入可点击列表
  arrow.userData = { targetRoute };
  clickables.push(arrow);

  scene.add(arrow);
  return arrow;
}

// 新函数：添加呼吸圆球（类似 room2 里的效果）
function addBreathingMarker(position, targetRoute = null) {
  const mat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.5
  });
  const geom = new THREE.SphereGeometry(0.12, 16, 16);
  const mesh = new THREE.Mesh(geom, mat);
  mesh.position.copy(position);
  if (targetRoute) mesh.userData = { targetRoute };
  // 保存材质用于动画
  mesh.userData.breathMaterial = mat;
  scene.add(mesh);
  clickables.push(mesh);
  return mesh;
}



let controls;
function performRaycastAndHandleClick(event, doNavigate = true) {
  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(clickables, false);
  console.log('raycast intersects:', intersects.length);
  if (intersects.length > 0) {
    const hit = intersects[0].object;
    console.log('hit object', hit);
    if (doNavigate) {
      const target = hit.userData && hit.userData.targetRoute ? hit.userData.targetRoute : '/room3';
      // 支持传入 name 或 path
      if (target.startsWith('/')) {
        router.push(target)
          .then(() => console.log(`router: navigation to ${target} successful`))
          .catch((e) => console.warn('router.push error', e));
      } else {
        // 名称导航
        router.push({ name: target })
          .then(() => console.log(`router: navigation to name ${target} successful`))
          .catch((e) => console.warn('router.push error', e));
      }
    }
    return hit;
  }
  return null;
}

function onPointerDown(event) {
  performRaycastAndHandleClick(event, true);
}

function onPointerMove(event) {
  const hit = performRaycastAndHandleClick(event, false);
  if (hit && lastHovered !== hit) {
    renderer.domElement.style.cursor = 'pointer';
    lastHovered = hit;
  } else if (!hit && lastHovered !== null) {
    renderer.domElement.style.cursor = '';
    lastHovered = null;
  }
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

onMounted(() => {
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  container.value.appendChild(renderer.domElement);



  addMarker(
    new THREE.Vector3(3.2, -1, 2.3),
    '/room2',
    new THREE.Vector3(2, -20, 2)   // ★ 目标方向
  );

  // breathing-style circular icon jumping to model2 page
  addBreathingMarker(
    new THREE.Vector3(-1, -0.5, -3.5),
    '/model2'
  );

  // // 添加一个红色跳转图标（位置可调整），目标 room2
  // addMarker(0xff4444, new THREE.Vector3(-2, -1, 1.5), '/room2');
  // addMarker(new THREE.Vector3(-2, -1, 1.5), '/room2');
  // ensure pointer events behave consistently
  renderer.domElement.style.touchAction = 'none';
  renderer.domElement.addEventListener('pointerdown', onPointerDown);
  renderer.domElement.addEventListener('click', onPointerDown);
  renderer.domElement.addEventListener('pointermove', onPointerMove);
  window.addEventListener('resize', onWindowResize);

  renderLoop();
});

onBeforeUnmount(() => {
  try {
    renderer.domElement.removeEventListener('pointerdown', onPointerDown);
    window.removeEventListener('resize', onWindowResize);
    controls?.dispose();
    renderer.dispose();
  } catch (e) {
    // 忽略清理时的错误
  }
});
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
.container {
  height: 100vh;
  width: 100vw;
  background-color: #f0f0f0;
}
</style>
