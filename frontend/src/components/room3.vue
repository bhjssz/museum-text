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

const renderLoop = () => {
  renderer.render(scene, camera);
  requestAnimationFrame(renderLoop);
};

// 添加球（全景纹理）
const geometry = new THREE.SphereGeometry(5, 32, 32);
const loader = new RGBELoader();
//https://cdn.jsdelivr.net/gh/bhjssz/museumimages@main   "./imgs/hdr/hall2.hdr"
loader.load("https://cdn.jsdelivr.net/gh/bhjssz/museumimages@main/hall2.hdr", (texture) => {
  const material = new THREE.MeshBasicMaterial({ map: texture });
  const sphere = new THREE.Mesh(geometry, material);
  sphere.geometry.scale(1, 1, -1);
  scene.add(sphere);
});


// ★ 交通实心箭头（可自定义颜色）
function createTrafficArrow(colorHex = 0xffffff) {
  const shape = new THREE.Shape();

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
    color: colorHex,     // ★ 箭头颜色
    transparent: true,
    opacity: 0.9         // ★ 箭头透明度（可调）
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.scale.set(0.15, 0.15, 0.15);

  return mesh;
}

// ★ 添加交通箭头（可跳转）
function addArrowMarker(colorHex, position, targetRoute = null) {
  const mesh = createTrafficArrow(colorHex);
  mesh.position.copy(position);

  mesh.userData.targetRoute = targetRoute;

  clickables.push(mesh);
  scene.add(mesh);

  return mesh;
}


function addMarker(colorHex, position, targetRoute = null) {
  const mat = new THREE.MeshBasicMaterial({ color: colorHex });
  const geom = new THREE.SphereGeometry(0.12, 16, 16);
  const mesh = new THREE.Mesh(geom, mat);
  mesh.position.copy(position);
  if (targetRoute) mesh.userData = { targetRoute };
  scene.add(mesh);
  clickables.push(mesh);
  return mesh;
}

let controls;
function onPointerDown(event) {
  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(clickables, false);
  if (intersects.length > 0) {
    // 点击图标：跳转到 App.vue (root)

    router.push('/App');
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

  // // 添加一个蓝色跳转图标（位置可调整），目标回到根 /
  // addMarker(0x4444ff, new THREE.Vector3(-1, -0.5, -0.5), '/');

  // ★ 用白色箭头替换蓝色圆点
const arrow = addArrowMarker(
  0xffffff,                         // 箭头颜色：白色
  new THREE.Vector3(-1, -0.46, -0.5), // 箭头位置（可调整）
  '/'                               // 点击跳转目标
);

// ★ 设置箭头方向（随便改）
arrow.rotation.x = 138 * Math.PI / 180;  // 上仰 20°
arrow.rotation.y = 120 * Math.PI / 180;  // 朝右偏 40°
arrow.rotation.z = 305 * Math.PI / 180;  // 稍微倾斜


  renderer.domElement.addEventListener('pointerdown', onPointerDown);
  window.addEventListener('resize', onWindowResize);

  renderLoop();
});

onBeforeUnmount(() => {
  try {
    renderer.domElement.removeEventListener('pointerdown', onPointerDown);
    window.removeEventListener('resize', onWindowResize);
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
