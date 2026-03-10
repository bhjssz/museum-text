import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

// 创建一个基础 Three.js 场景并返回控制句柄
export function createScene(container, options = {}) {
  const { initialCamera = { x: 0, y: 1.6, z: 3 }, onClickPoint = null } = options;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.set(initialCamera.x, initialCamera.y, initialCamera.z);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.outputEncoding = THREE.sRGBEncoding;
  container.appendChild(renderer.domElement);

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(5, 10, 7.5);
  scene.add(light);

  // 一些辅助几何物体：地面 + 点击点
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({ color: 0x808080 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = 0;
  scene.add(ground);

  // 点击点（小球）
  const points = [];
  function makePoint(name, pos, color = 0xff0000) {
    const m = new THREE.Mesh(
      new THREE.SphereGeometry(0.08, 16, 16),
      new THREE.MeshStandardMaterial({ color })
    );
    m.position.set(pos.x, pos.y, pos.z);
    m.userData.name = name;
    scene.add(m);
    points.push(m);
    return m;
  }

  // 默认放三个点用于页面间跳转
  makePoint('toApp', { x: -1, y: 0.08, z: 0 }, 0xff4444);
  makePoint('toHome', { x: 0, y: 0.08, z: -1 }, 0x44ff44);
  makePoint('toBlog', { x: 1, y: 0.08, z: 0 }, 0x4444ff);

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  function onPointerDown(e) {
    const rect = renderer.domElement.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    mouse.set(x, y);
    raycaster.setFromCamera(mouse, camera);
    const hits = raycaster.intersectObjects(points, false);
    if (hits.length && typeof onClickPoint === 'function') {
      onClickPoint(hits[0].object.userData.name);
    }
  }

  renderer.domElement.addEventListener('pointerdown', onPointerDown);

  // resize handler
  function onResize() {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  }
  window.addEventListener('resize', onResize);

  let rafId = null;
  function animate() {
    rafId = requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
  animate();

  return {
    scene,
    camera,
    renderer,
    dispose() {
      cancelAnimationFrame(rafId);
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('resize', onResize);
      container.removeChild(renderer.domElement);
      // dispose simple geometries/materials
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
          else obj.material.dispose();
        }
      });
    }
  };
}
