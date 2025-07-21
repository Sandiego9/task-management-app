<template>
  <div class="surface-900 text-gray-100 p-6 border-round-xl text-center">
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
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { auth } from "../../utils/firebase";
import { signOut } from "firebase/auth";
import Button from "primevue/button";

const router = useRouter();

const displayName = ref("");
const email = ref("");

onMounted(() => {
  const user = auth.currentUser;
  if (user) {
    displayName.value = user.displayName || "User";
    email.value = user.email || "user@gmail.com";
  }
});

const onLogout = async () => {
  await signOut(auth);
  router.push("/login");
};
</script>
