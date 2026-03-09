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




//新加的1
// ===== WASD 键盘状态 =====
const keys = {
  w: false,
  a: false,
  s: false,
  d: false,
};

const moveSpeed = 0.05; // 行走速度（可调）

// const renderLoop = () => {
//   renderer.render(scene, camera);
//   requestAnimationFrame(renderLoop);
// };

const renderLoop = () => {

  const time = performance.now() * 0.002;

  // 让所有 marker 呼吸发光（只有白色点效果会明显）
  clickables.forEach(obj => {
    const mat = obj.userData.material;
    if (mat) {
      // 透明度在 0.3 ~ 1.0 之间来回变化
      mat.opacity = 0.2 + Math.abs(Math.sin(time)) * 0.6;
    }
  });


//新加的3
  // ===== WASD 漫游核心代码（新加）=====
  const forward = new THREE.Vector3();
  camera.getWorldDirection(forward);
  forward.y = 0;           // 防止上下飞
  forward.normalize();

  const right = new THREE.Vector3();
  right.crossVectors(forward, camera.up).normalize();

  if (keys.w) camera.position.add(forward.clone().multiplyScalar(moveSpeed));
  if (keys.s) camera.position.add(forward.clone().multiplyScalar(-moveSpeed));
  if (keys.a) camera.position.add(right.clone().multiplyScalar(-moveSpeed));
  if (keys.d) camera.position.add(right.clone().multiplyScalar(moveSpeed));

  //新加的6
  const maxRadius = 3;
if (camera.position.length() > maxRadius) {
  camera.position.setLength(maxRadius);
}


  renderer.render(scene, camera);
  requestAnimationFrame(renderLoop);
};


// 添加球（全景纹理）
const geometry = new THREE.SphereGeometry(5, 32, 32);
const loader = new RGBELoader();
loader.load("https://cdn.jsdelivr.net/gh/bhjssz/museumimages@main/hall4.hdr", (texture) => {
  const material = new THREE.MeshBasicMaterial({ map: texture });
  const sphere = new THREE.Mesh(geometry, material);
  sphere.geometry.scale(1, 1, -1);
  scene.add(sphere);
});

// function addMarker(colorHex, position, targetRoute = null) {
//   const mat = new THREE.MeshBasicMaterial({ color: colorHex });
//   const geom = new THREE.SphereGeometry(0.46, 16, 16);
//   const mesh = new THREE.Mesh(geom, mat);
//   mesh.position.copy(position);
//   if (targetRoute) mesh.userData = { targetRoute };
//   scene.add(mesh);
//   clickables.push(mesh);
//   return mesh;
// }

// ★ 交通实心箭头（可自定义颜色）
function createTrafficArrow(colorHex = 0xffffff) {

  const shape = new THREE.Shape();

  // 一个流畅的实心箭头形状
  shape.moveTo(0, 0.5);
  shape.lineTo(0.3, 0);
  shape.lineTo(0.12, 0);
  shape.lineTo(0.12, -0.5);
  shape.lineTo(-0.12, -0.5);
  shape.lineTo(-0.12, 0);
  shape.lineTo(-0.3, 0);
  shape.lineTo(0, 0.5);

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.05,
    bevelEnabled: false
  });

  const material = new THREE.MeshBasicMaterial({
    color: colorHex,
    transparent: true,
    opacity: 0.7,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.scale.set(0.9, 0.9, 0.9);

  return mesh;
}


// ★ 专门用于添加交通箭头（绿色的那个）
function addArrowMarker(colorHex, position, targetRoute = null, lookAtTarget = null) {
  const mesh = createTrafficArrow(colorHex); // 创建箭头

  mesh.position.copy(position);              // 设置位置

  // 设置箭头朝向（可选）
  if (lookAtTarget) {
    mesh.lookAt(lookAtTarget);
  }

  // 存储路由
  if (targetRoute) mesh.userData = { targetRoute };

  // 加入射线检测列表
  clickables.push(mesh);

  scene.add(mesh);
  return mesh;
}


function addMarker(colorHex, position, targetRoute = null) {
  const mat = new THREE.MeshBasicMaterial({
    color: colorHex,
    transparent: true,
    opacity: 0.85
  });

  const geom = new THREE.SphereGeometry(0.06, 16, 16);
  const mesh = new THREE.Mesh(geom, mat);

  mesh.position.copy(position);

  // 存储路由
  if (targetRoute) mesh.userData = { targetRoute };

  // 存储材质，后面动画要用
  mesh.userData.material = mat;

  scene.add(mesh);
  clickables.push(mesh);
  return mesh;
}


let controls;
// function onPointerDown(event) {
//   const rect = renderer.domElement.getBoundingClientRect();
//   mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
//   mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
//   raycaster.setFromCamera(mouse, camera);
//   const intersects = raycaster.intersectObjects(clickables, false);
//   if (intersects.length > 0) {
//     // 点击图标：跳转到 room3
//     router.push('/room3');
//   }
// }
function onPointerDown(event) {
  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(clickables, false);
  if (intersects.length > 0) {
    const route = intersects[0].object.userData?.targetRoute;
    if (route) router.push(route);   // 自动跳到对应路由
  }
}



function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}


//新加的2
function onKeyDown(e) {
  if (e.code === 'KeyW') keys.w = true;
  if (e.code === 'KeyA') keys.a = true;
  if (e.code === 'KeyS') keys.s = true;
  if (e.code === 'KeyD') keys.d = true;
}

function onKeyUp(e) {
  if (e.code === 'KeyW') keys.w = false;
  if (e.code === 'KeyA') keys.a = false;
  if (e.code === 'KeyS') keys.s = false;
  if (e.code === 'KeyD') keys.d = false;
}




onMounted(() => {
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  container.value.appendChild(renderer.domElement);

  // // 添加一个绿色跳转图标（位置可调整），目标 room3
  // addMarker(0x44ff44, new THREE.Vector3(-1.5, 0, 2), '/room3');

  // ★ 添加绿色箭头，但我们现在用透明白箭头替代
  const arrow = addArrowMarker(
    0xffffff,
    new THREE.Vector3(-2.2, -1.5, 3.8),
    '/room3'
  );

  // ★ ★ ★ 在这里设置箭头方向（方法 2）
  // 例子：45° → 朝右上

// arrow.rotation.z = 330 * Math.PI / 180;   // 朝右偏下
arrow.rotation.x = 138 * Math.PI / 180;  // 上仰 20°
arrow.rotation.y = 5 * Math.PI / 180;  // 朝右偏 40°
arrow.rotation.z = 225 * Math.PI / 180;  // 稍微倾斜



//   addArrowMarker(
//   0xffffff,                       // 箭头颜色是绿色
//   new THREE.Vector3(-1.5, 0, 2),  // 位置
//   '/room3',                       // 点击跳转
//   new THREE.Vector3(0, 0, 0)      // 箭头朝向（可调整）
// );

  // 添加一个白色跳转图标（位置可调整），目标 model
  addMarker(0xffffff, new THREE.Vector3(-1.7, -0.2, -2.5), '/model');

  renderer.domElement.addEventListener('pointerdown', onPointerDown);
  window.addEventListener('resize', onWindowResize);

  //新加的4
  // ===== 新加：键盘监听 =====
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);

  renderLoop();
});

onBeforeUnmount(() => {
  try {
    renderer.domElement.removeEventListener('pointerdown', onPointerDown);
    window.removeEventListener('resize', onWindowResize);

    //新加的5
    // ===== 新加：移除键盘监听 =====
    window.removeEventListener('keydown', onKeyDown);
    window.removeEventListener('keyup', onKeyUp);


    controls?.dispose();
    renderer.dispose();
  } catch (e) {}
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
