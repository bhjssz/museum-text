import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'login', component: () => import('./components/login.vue') },
  { path: '/register', name: 'register', component: () => import('./components/Register.vue') },
  { path: '/xuanze', name: 'xuanze', component: () => import('./xuanze.vue') },
  { path: '/network', redirect: '/denglu' },
  { path: '/App', name: 'App', component: () => import('./components/App.vue') },
  { path: '/room2', name: 'room2', component: () => import('./components/room2.vue') },
  { path: '/room3', name: 'room3', component: () => import('./components/room3.vue') },
  { path: '/model2', name: 'model2', component: () => import('./components/model2.vue') },
  { path: '/model', name: 'model', component: () => import('./components/model.vue') },

  // 后台管理页面
  { path: '/admin', name: 'admin', component: () => import('./components/Admin.vue') },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

// 管理员保护
router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}")
  const adminUsers = ["admin", "bhjss", "bhjssz"]

  if (to.path === '/admin') {
    if (!user.username || !adminUsers.includes(user.username)) {
      alert("你没有权限访问后台")
      return next("/xuanze")
    }
  }

  next()
})

export default router;