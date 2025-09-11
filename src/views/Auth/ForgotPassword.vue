<template>
  <AuthLayout cardTitle="Reset Password">
    <form @submit.prevent="onResetPassword" class="flex flex-column">
      <div>
        <div class="flex justify-content-between">
          <label for="email" class="font-medium">Email</label>
          <small v-if="error" class="text-red-500 flex align-items-center">{{
            error
          }}</small>
        </div>
        <InputText id="email" v-model="email" class="w-full" />
      </div>

      <Button
        type="submit"
        class="w-full mt-3"
        :label="loading ? 'Sending...' : 'Send Reset Link'"
        :loading="loading"
      />
    </form>

    <p class="mt-3 mb-0 text-center">
      <router-link to="/login" class="text-blue-500">Back to Login</router-link>
    </p>
  </AuthLayout>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import { useAuthStore } from "@/store/auth";
import AuthLayout from "./layout/AuthLayout.vue";
import InputText from "primevue/inputtext";
import Button from "primevue/button";

const router = useRouter();
const toast = useToast();
const authStore = useAuthStore();

const email = ref("");
const error = ref("");
const loading = ref(false);

const onResetPassword = async () => {
  error.value = "";
  if (!email.value || !email.value.includes("@")) {
    error.value = "Enter a valid email";
    return;
  }

  loading.value = true;
  const { success, errorMessage } = await authStore.requestPasswordReset(
    email.value
  );
  loading.value = false;

  if (success) {
    toast.add({
      severity: "success",
      summary: "Email Sent",
      detail: "Check your inbox for the reset token.",
      life: 3000,
    });
    router.push("/reset-password");
  } else {
    error.value = errorMessage;
  }
};
</script>

<style scoped>
:deep(.p-inputtext) {
  width: 100%;
}
</style>
