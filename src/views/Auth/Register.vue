<template>
  <div class="surface-200 text-gray-900 p-4 w-22rem border-round-2xl">
    <h2 class="text-2xl font-bold mt-0 mb-4 text-center">Create an Account</h2>

    <form @submit.prevent="onSubmit" class="flex flex-column">
      <!-- Full Name -->
      <div>
        <div class="flex justify-content-between">
          <label for="name" class="font-medium text-left">Full Name</label>
          <small v-if="errors.email" class="text-red-500 flex align-items-center">{{ errors.email }}</small>
        </div>
        <InputText id="name" v-model="name" class="w-full" />
      </div>

      <!-- Email -->
      <div class="mt-3">
        <div class="flex justify-content-between">
          <label for="email" class="mb-1 font-medium">Email</label>
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
        <Password id="password" v-model="password" toggleMask class="w-full" />
      </div>

      <!-- Confirm Password -->
      <div class="mt-3">
        <div class="flex justify-content-between">
          <label for="confirmPassword" class="font-medium">Confirm Password</label>
          <small v-if="errors.confirmPassword" class="text-red-500 flex align-items-center">{{ errors.confirmPassword }}</small>
        </div>
        <Password
          id="confirmPassword"
          v-model="confirmPassword"
          :feedback="false"
          toggleMask
          class="w-full"
        />
      </div>

      <!-- Submit -->
      <Button
        type="submit"
        class="w-full mt-4"
        :label="loading ? 'Creating account...' : 'Register'"
        :loading="loading"
      />
    </form>

    <p class="mt-4 mb-0 text-center">
      Already have an account?
      <router-link to="/login" class="text-blue-500">Login</router-link>
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../utils/firebase";
import { useToast } from "primevue/usetoast";
import { useAuthStore } from "../../store/auth";
import InputText from "primevue/inputtext";
import Password from "primevue/password";
import Button from "primevue/button";

const router = useRouter();
const toast = useToast();
const authStore = useAuthStore();

const name = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const loading = ref(false);

const errors = reactive({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
});

const validateForm = () => {
  let valid = true;

  // Reset errors
  errors.name = errors.email = errors.password = errors.confirmPassword = "";

  if (!name.value) {
    errors.name = "Full name is required";
    valid = false;
  }

  if (!email.value || !email.value.includes("@")) {
    errors.email = "Valid email is required";
    valid = false;
  }

  if (password.value.length < 6) {
    errors.password = "Password must be at least 6 characters";
    valid = false;
  }

  if (confirmPassword.value !== password.value) {
    errors.confirmPassword = "Passwords do not match";
    valid = false;
  }

  return valid;
};

const onSubmit = async () => {
  if (!validateForm()) return;

  try {
    loading.value = true;
    const userCred = await createUserWithEmailAndPassword(
      auth,
      email.value,
      password.value
    );

    // Update display name
    if (userCred.user) {
      await updateProfile(userCred.user, {
        displayName: name.value,
      });
    }

    toast.add({
      severity: "success",
      summary: "Success",
      detail: "Registration successful!",
      life: 3000,
    });

    router.push("/dashboard");
  } catch (err: any) {
    let errorMessage = "Registration failed";

    const code = err?.code;

    if (code === "auth/email-already-in-use") {
      errorMessage = "Email is already in use";
    } else if (code === "auth/invalid-email") {
      errorMessage = "Invalid email address";
    } else if (code === "auth/weak-password") {
      errorMessage = "Password is too weak";
    }

    toast.add({
      severity: "error",
      summary: "Error",
      detail: errorMessage,
      life: 4000,
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
