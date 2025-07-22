<template>
  <div class="surface-200 text-gray-900 p-4 w-22rem border-round-2xl">
    <h2 class="text-2xl font-bold mt-0 mb-4 text-center">Welcome Back</h2>

    <form @submit.prevent="onLogin" class="flex flex-column">
      <!-- Email -->
      <div>
        <div class="flex justify-content-between">
          <label for="email" class="font-medium text-left">Email</label>
          <small v-if="errors.email" class="text-red-500 flex align-items-center">{{ errors.email }}</small>
        </div>
        <InputText id="email" v-model="email" class="w-full" />
      </div>

      <!-- Password -->
      <div class="mt-3">
        <div class="flex justify-content-between">
          <label for="password" class="font-medium text-left">Password</label>
          <small v-if="errors.password" class="text-red-500 flex align-items-center">{{ errors.password }}</small>
        </div>
        <Password
          id="password"
          v-model="password"
          :feedback="false"
          toggleMask
          class="w-full"
        />
      </div>

      <div class="mt-3 text-right">
        <router-link to="/forgot-password" class="text-sm text-blue-500">Forgot Password?</router-link>
      </div>

      <!-- Submit -->
      <Button
        type="submit"
        class="w-full mt-1"
        :label="loading ? 'Signing in...' : 'Login'"
        :loading="loading"
      />
    </form>

    <p class="mt-4 mb-0 text-center">
      Don’t have an account?
      <router-link to="/register" class="text-blue-500">Register</router-link>
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../utils/firebase";
import { useToast } from "primevue/usetoast";
import { useAuthStore } from "../../store/auth";
import InputText from "primevue/inputtext";
import Password from "primevue/password";
import Button from "primevue/button";

const router = useRouter();
const toast = useToast();
const authStore = useAuthStore();

const email = ref("");
const password = ref("");
const loading = ref(false);

const errors = reactive({
  email: "",
  password: "",
});

const validateForm = () => {
  let valid = true;

  errors.email = errors.password = "";

  if (!email.value || !email.value.includes("@")) {
    errors.email = "Valid email is required";
    valid = false;
  }

  if (!password.value) {
    errors.password = "Password is required";
    valid = false;
  }

  return valid;
};

const onLogin = async () => {
  if (!validateForm()) return;

  try {
    loading.value = true;
    const auth = getAuth();
    const userCred = await signInWithEmailAndPassword(auth, email.value, password.value);

    authStore.setUser(userCred.user);

    toast.add({
      severity: "success",
      summary: "Success",
      detail: "Login successful!",
      life: 3000
    });

    router.push("/dashboard");
  } catch (err: any) {
    let errorMessage = "Login failed";

    const code = err?.code;

    if (code === "auth/user-not-found") {
      errorMessage = "No user found with this email";
    } else if (code === "auth/wrong-password") {
      errorMessage = "Incorrect password";
    } else if (code === "auth/invalid-credential") {
      errorMessage = "Invalid email address or password";
    }

    toast.add({
      severity: "error",
      summary: "Error",
      detail: errorMessage,
      life: 3000
    });
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
:deep(.p-password-input) {
  width: 100%;
}
</style>
