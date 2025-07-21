<template>
  <div v-if="authStore.isLoading">Loading...</div>
  <div
    v-else-if="isLoggedIn"
    class="surface-900 text-gray-100 p-6 border-round-xl text-center"
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
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { auth } from "../../utils/firebase";
import { signOut } from "firebase/auth";
import { useAuthStore } from "../../store/auth";
import { useToast } from "primevue";
import Button from "primevue/button";

const router = useRouter();
const toast = useToast();
const authStore = useAuthStore();

const displayName = ref("");
const email = ref("");
const isLoggedIn = computed(() => authStore.isAuthenticated);

onMounted(() => {
  const user = authStore.user;
  if (user) {
    displayName.value = user.displayName || "User";
    email.value = user.email || "user@gmail.com";
  }
});

const onLogout = async () => {
  await signOut(auth);
  authStore.clearUser();
  toast.add({
    severity: "success",
    summary: "Logout Successful",
    detail: "You have been logged out successfully.",
  });
  router.push("/login");
};
</script>
