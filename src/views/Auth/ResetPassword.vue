<template>
  <AuthLayout cardTitle="Set New Password">
    <form @submit.prevent="onSubmit" class="flex flex-column w-20rem">
      <div class="text-left">
        <div class="flex justify-content-between align-items-center">
          <label class="font-medium">Token</label>
          <small v-if="errors.token" class="text-red-500 text-xs">{{
            errors.token
          }}</small>
        </div>
        <InputText v-model="token" class="w-full" />
      </div>

      <div class="mt-3">
        <div class="flex justify-content-between align-items-center">
          <label class="font-medium">New Password</label>
          <small v-if="errors.password" class="text-red-500 text-xs">{{
            errors.password
          }}</small>
        </div>
        <Password v-model="password" toggleMask class="w-full" />
      </div>

      <div class="mt-3">
        <div class="flex justify-content-between align-items-center">
          <label class="font-medium">Confirm Password</label>
          <small v-if="errors.confirmPassword" class="text-red-500 text-xs">{{
            errors.confirmPassword
          }}</small>
        </div>
        <Password
          v-model="confirmPassword"
          :feedback="false"
          toggleMask
          class="w-full"
        />
      </div>

      <div class="mt-4">
        <small v-if="apiError" class="text-red-500 text-xs mt-2 text-center">
          {{ apiError }}
        </small>
        <Button
          type="submit"
          class="w-full"
          :label="loading ? 'Resetting...' : 'Reset Password'"
          :loading="loading"
        />
      </div>
    </form>
  </AuthLayout>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import { useAuthStore } from "@/store/auth";
import Password from "primevue/password";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import AuthLayout from "./layout/AuthLayout.vue";

const token = ref("");
const password = ref("");
const confirmPassword = ref("");
const apiError = ref("");
const loading = ref(false);
const router = useRouter();
const toast = useToast();
const authStore = useAuthStore();

const errors = ref<{
  token?: string;
  password?: string;
  confirmPassword?: string;
}>({});

const validate = () => {
  errors.value = {};
  let valid = true;

  if (!token.value) {
    errors.value.token = "Token is required";
    valid = false;
  }
  if (password.value.length < 6) {
    errors.value.password = "Password must be at least 6 characters";
    valid = false;
  }
  if (password.value !== confirmPassword.value) {
    errors.value.confirmPassword = "Passwords do not match";
    valid = false;
  }
  return valid;
};

const onSubmit = async () => {
  apiError.value = "";

  if (!validate()) return;

  loading.value = true;
  const { success, errorMessage } = await authStore.resetPassword({
    token: token.value,
    password: password.value,
  });
  loading.value = false;

  if (success) {
    toast.add({
      severity: "success",
      summary: "Password Updated",
      detail: "Your password has been changed. Please login.",
      life: 3000,
    });
    router.push({ name: "Login" });
  } else {
    apiError.value = errorMessage || "Reset failed";
  }
};
</script>

<style scoped>
:deep(.p-inputtext) {
  width: 100%;
}
</style>
