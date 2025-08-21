import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../store/auth";

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
    component: () => import("@/layouts/DashboardLayout.vue"),
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        component: () => import("@/views/Dashboard/Tasks/TaskDashboard.vue"),
      },
      {
        path: "profile",
        component: () => import("@/views/Dashboard/Profile/ProfileView.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore();

  if (authStore.isLoading) {
    const unwatch = authStore.$subscribe((_mutation, state) => {
      if (!state.isLoading) {
        unwatch(); // stop watching
        proceed();
      }
    });
  } else {
    proceed();
  }

  function proceed() {
    const requiresAuth = to.meta.requiresAuth;
    const isAuth = authStore.isAuthenticated;

    if (requiresAuth && !isAuth) {
      console.log(to.fullPath, isAuth);
      next("/login");
    } else {
      next();
    }
  }
});

export default router;
