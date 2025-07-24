<template>
  <div
    v-if="authStore.isLoading"
    class="flex align-items-center justify-content-center h-screen"
  >
    <ProgressSpinner />
  </div>
  
  <template v-else>
    <div
      v-if="isLoggedIn"
      class="surface-900 text-gray-100 p-6 border-round-xl text-center w-screen h-screen"
    >
      <h2 class="text-2xl font-bold mb-2">Welcome, {{ displayName }}!</h2>
      <p class="text-md mb-4">Your email address is: {{ email }}</p>

      <Button
        label="Logout"
        icon="pi pi-sign-out"
        severity="danger"
        @click="onLogout"
      />
    </div>

    <div v-else>
      <p class="p-5 text-center">
        You are not authorized to view this page.
      </p>
    </div>
  </template>
</template>

<script setup lang="ts">
import { computed, onMounted, watch, ref } from "vue";
import { useRouter } from "vue-router";
import { auth } from "../../utils/firebase";
import { signOut } from "firebase/auth";
import { useAuthStore } from "../../store/auth";
import { useToast } from "primevue";
import ProgressSpinner from "primevue/progressspinner";
import Button from "primevue/button";

const router = useRouter();
const toast = useToast();
const authStore = useAuthStore();

const displayName = computed(() => authStore.user?.displayName || "User");
const email = computed(() => authStore.user?.email || "user@gmail.com");
const isLoggedIn = computed(() => authStore.isAuthenticated);

watch(() => authStore.isAuthenticated, (authenticated) => {
  if (!authenticated && !authStore.isLoading) {
    router.push("/login")
  }
});

const onLogout = async () => {
  try {
    await signOut(auth);
    toast.add({
      severity: "success",
      summary: "Logout Successful",
      detail: "You have been logged out successfully.",
      life: 3000
    });
    router.push("/login");
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Logout Failed",
      detail: "There was an error logging out.",
      life: 3000
    });
  }
  authStore.clearUser();
};
</script>

<style scoped></style>
