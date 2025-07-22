<template>
  <AuthLayout
    cardTitle="Reset Password"
  >
    <form @submit.prevent="onResetPassword" class="flex flex-column">
      <div>
        <div class="flex justify-content-between">
          <label for="email" class="font-medium">Email</label>
          <small v-if="error" class="text-red-500 flex align-items-center">{{ error }}</small>
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
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../utils/firebase';
import { useToast } from 'primevue/usetoast';
import AuthLayout from "./layouts/AuthLayout.vue";
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';

const router = useRouter();
const toast = useToast();

const email = ref('');
const error = ref('');
const loading = ref(false);

const onResetPassword = async () => {
  error.value = '';

  if (!email.value || !email.value.includes('@')) {
    error.value = 'Please enter a valid email';
    return;
  }

  try {
    loading.value = true;
    await sendPasswordResetEmail(auth, email.value);
    toast.add({
      severity: 'success',
      summary: 'Email Sent',
      detail: 'Password reset link has been sent!',
      life: 3000
    });

    router.push('/login');
  } catch (err: any) {
    const code = err?.code;
    let message = 'Password reset failed';

    if (code === 'auth/user-not-found') {
      message = 'No account found with this email';
    } else if (code === 'auth/invalid-email') {
      message = 'Invalid email address';
    }

    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: message,
      life: 3000
    });
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
:deep(.p-inputtext) {
  width: 100%;
}
</style>
