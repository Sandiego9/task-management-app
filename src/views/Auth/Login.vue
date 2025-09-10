<template>
  <AuthLayout cardTitle="Welcome Back">
    <form @submit.prevent="onLogin" class="flex flex-column">
      <div>
        <div class="flex justify-content-between">
          <label for="email" class="font-medium text-left">Email</label>
          <small v-if="errors.email" class="text-red-500 flex align-items-center">{{ errors.email }}</small>
        </div>
        <InputText id="email" v-model="email" class="w-full" />
      </div>

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

      <Button
        type="submit"
        class="w-full mt-1"
        :label="authStore.isLoading ? 'Signing in...' : 'Login'"
        :loading="authStore.isLoading"
      />
    </form>

    <p class="mt-4 mb-0 text-center">
      Don’t have an account?
      <router-link to="/register" class="text-blue-500">Register</router-link>
    </p>
  </AuthLayout>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import { useAuthStore } from "../../store/sample.auth";
import AuthLayout from "./layout/AuthLayout.vue";
import InputText from "primevue/inputtext";
import Password from "primevue/password";
import Button from "primevue/button";

const router = useRouter();
const toast = useToast();
const authStore = useAuthStore();

const email = ref("");
const password = ref("");

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

  const { success, errorMessage } = await authStore.login(
    email.value,
    password.value
  );

  if (success) {
    toast.add({
      severity: "success",
      summary: "Login Successful",
      detail: "Welcome back!",
      life: 3000
    });
    router.push("/dashboard");
  } else {
    toast.add({
      severity: "error",
      summary: "Login failed",
      detail: errorMessage || "An error occured during login.",
      life: 3000
    });
  }
};
</script>

<style scoped>
:deep(.p-password-input) {
  width: 100%;
}
</style>
