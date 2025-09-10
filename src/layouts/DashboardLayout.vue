<template>
  <div class="flex h-full relative">
    <!-- Hamburger Menu for Mobile -->
    <Button
      icon="pi pi-bars"
      class="md:hidden absolute top-3 left-3 z-5"
      @click="toggleSidebar"
    />

    <!-- Overlay for mobile sidebar -->
    <div
      v-if="isMobile && isSidebarVisible"
      class="fixed inset-0 z-3 overlay"
      @click="closeSidebar"
    />

    <!-- Sidebar -->
    <Transition name="slide">
      <aside
        v-if="!isMobile || isSidebarVisible"
        class="surface-200 py-4 px-3 flex flex-column justify-content-between border-right-1 surface-border w-18rem h-full z-4 fixed md:static"
      >
        <!-- Logo and Navigation -->
        <div>
          <div class="text-2xl font-bold mb-4 text-primary">🧠 TaskApp</div>
          <hr class="mb-3 w-full" />
          <div class="flex flex-column gap-3">
            <RouterLink
              to="/dashboard"
              class="p-2 border-round-lg text-color hover:bg-primary-100"
              :class="isActive('/dashboard')"
              @click="closeSidebar"
            >
              📋 Tasks
            </RouterLink>

            <RouterLink
              to="/dashboard/profile"
              class="p-2 border-round-lg text-color hover:bg-primary-100"
              :class="isActive('/dashboard/profile')"
              @click="closeSidebar"
            >
              👤 Profile
            </RouterLink>
          </div>
        </div>

        <Button
          icon="pi pi-sign-out"
          label="Logout"
          severity="danger"
          class="mx-2 mt-5"
          @click="handleLogout"
        />
      </aside>
    </Transition>

    <!-- Main Content -->
    <main class="flex-1 overflow-auto p-4 bg-surface-50">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "../store/sample.auth";
import Button from "primevue/button";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const isSidebarVisible = ref(false);
const screenWidth = ref(window.innerWidth);
const isMobile = computed(() => screenWidth.value < 768);

const handleResize = () => {
  screenWidth.value = window.innerWidth;
  if (!isMobile.value) {
    isSidebarVisible.value = false; // No sidebar toggling needed on desktop
  }
};

onMounted(() => {
  window.addEventListener("resize", handleResize);
});
onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
});

const toggleSidebar = () => {
  isSidebarVisible.value = !isSidebarVisible.value;
};

const closeSidebar = () => {
  isSidebarVisible.value = false;
};

const isActive = (path: string) => {
  return route.path === path ? "bg-primary text-white" : "";
};

const handleLogout = () => {
  authStore.logout();
  router.push("/login");
};
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}

.overlay {
  background-color: rgba(0, 0, 0, 0.6);
}
</style>
