import { createRouter, createWebHashHistory } from "vue-router";

// 使用懒加载（动态 import）来避免与根组件产生循环依赖
const routes = [
 { path: '/', redirect: '/login' },
  // 登录页面
  { path: '/login', name: 'login', component: () => import('./components/login.vue') },
  // 注册页面
  { path: '/register', name: 'register', component: () => import('./components/Register.vue') },
  { path: '/xuanze', name: 'xuanze', component: () => import('./xuanze.vue') },  // network link should land on xuanze page
  { path: '/network', redirect: '/denglu' },
  // use lowercase path to match links in RootApp.vue
  { path: '/App', name: 'App', component: () => import('./components/App.vue') },
  { path: "/room2", name: 'room2', component: () => import("./components/room2.vue") },
  { path: "/room3", name: 'room3', component: () => import("./components/room3.vue") },
  { path: "/model2", name: 'model2', component: () => import("./components/model2.vue") },
  { path: "/model", name: 'model', component: () => import("./components/model.vue") },
];


const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;