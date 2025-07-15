import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: () => import('@/views/Auth/Login.vue')
  },
  {
    path: '/register',
    component: () => import('@/views/Auth/Register.vue')
  },
  {
    path: '/dashboard',
    component: () => import('@/views/Dashboard/TaskDashboard.vue')
  },
  {
    path: '/profile',
    component: () => import('@/views/Profile/ProfileView.vue')
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
