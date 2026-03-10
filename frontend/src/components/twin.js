//引入three.js
import * as THREE from 'three';
//相机控件扩展库OrbitControls
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
//引入gltf加载器扩展库
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
//3D场景对象scene
const scene = new THREE.Scene();
//长方体网格模型
// const geometry = new THREE.BoxGeometry(100, 100, 100);
// const material = new THREE.MeshBasicMaterial({ 
//     color: 0x00ff00 ,
//     transparent:true,
//     opacity:0.5
//  });
// const mesh=new THREE.Mesh(geometry,material);
// scene.add(mesh);

//创建一个gltf加载器对象
const loader = new GLTFLoader();
loader.load('./铜牛.glb', function(gltf){
    console.log('gltf',gltf);
    scene.add(gltf.scene);
})
//平行光
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
//光源方向：平行光从位置80，100，50执行坐标原点
directionalLight.position.set(80, 100, 50);
scene.add(directionalLight);
directionalLight.intensity = 3; //光照强度

//AxesHelper:辅助观察的坐标系
const axesHelper = new THREE.AxesHelper(150);
scene.add(axesHelper);
//three.js输出画布的尺寸
const width=window.innerWidth;
const height=window.innerHeight;
//透视投影相机
const camera=new THREE.PerspectiveCamera(45,width/height,1,1000);
camera.position.set(200,200,200);
camera.lookAt(0,0,0);

//WebGL渲染器
const renderer=new THREE.WebGLRenderer({
    antialias:true //抗锯齿
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(width,height);
document.body.appendChild(renderer.domElement);
//渲染循环
function render(){
    renderer.render(scene,camera);
    requestAnimationFrame(render);
}
render();

//设置相机控件OrbitControls
const controls=new OrbitControls(camera,renderer.domElement);

window.onresize=function(){
    renderer.setSize(window.innerWidth,window.innerHeight);
    camera.aspect=window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
}
