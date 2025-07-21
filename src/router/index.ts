import { createRouter, createWebHistory } from "vue-router";
import { auth } from "../utils/firebase";

const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    component: () => import("@/views/Auth/Login.vue"),
  },
  {
    path: "/register",
    component: () => import("@/views/Auth/Register.vue"),
  },
  {
    path: "/forgot-password",
    component: () => import("@/views/Auth/ForgotPassword.vue"),
  },
  {
    path: "/dashboard",
    component: () => import("@/views/Dashboard/TaskDashboard.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/profile",
    component: () => import("@/views/Profile/ProfileView.vue"),
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const currentUser = auth.currentUser;
  const requiresAuth = to.meta.requiresAuth;

  if (requiresAuth && !currentUser) {
    next("/login");
  } else if (to.path === "/login" && currentUser) {
    next("/dashboard");
  } else {
    next();
  }
});

export default router;
