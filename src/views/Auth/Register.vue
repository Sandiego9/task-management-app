<template>
  <AuthLayout cardTitle="Create an Account">
    <form @submit.prevent="onSubmit" class="flex flex-column">
      <div class="flex gap-2">
        <div>
          <div class="flex justify-content-between">
            <label for="firstName" class="font-medium text-left">First Name</label>
            <small v-if="errors.firstName" class="text-red-500 flex align-items-center text-xs">{{ errors.firstName }}</small>
          </div>
          <InputText id="firstName" v-model="firstName" class="w-full" />
        </div>

        <div class="2xl:mt-3">
          <div class="flex justify-content-between">
            <label for="lastName" class="font-medium text-left">Last Name</label>
            <small v-if="errors.lastName" class="text-red-500 flex align-items-center text-xs">{{ errors.lastName }}</small>
          </div>
          <InputText id="lastName" v-model="lastName" class="w-full" />
        </div>
      </div>

      <div class="flex gap-2 flex-direction-column">
        <div class="mt-3">
          <div class="flex justify-content-between">
            <label for="email" class="mb-1 font-medium">Email</label>
            <small v-if="errors.email" class="text-red-500 flex align-items-center text-xs">{{ errors.email }}</small>
          </div>
          <InputText id="email" v-model="email" class="w-full" />
        </div>

        <div class="mt-3">
          <div class="flex justify-content-between">
            <label for="phoneNumber" class="mb-1 font-medium">Phone Number</label>
          </div>
          <InputText id="phoneNumber" v-model="phoneNumber" class="w-full" />
        </div>
      </div>

      <div class="mt-3">
        <div class="flex justify-content-between">
          <label for="password" class="font-medium text-left">Password</label>
          <small v-if="errors.password" class="text-red-500 flex align-items-center text-xs">{{ errors.password }}</small>
        </div>
        <Password id="password" v-model="password" toggleMask class="w-full" />
      </div>

      <div class="mt-3">
        <div class="flex justify-content-between">
          <label for="confirmPassword" class="font-medium">Confirm Password</label>
          <small v-if="errors.confirmPassword" class="text-red-500 flex align-items-center text-xs">{{ errors.confirmPassword }}</small>
        </div>
        <Password id="confirmPassword" v-model="confirmPassword" :feedback="false" toggleMask class="w-full" />
      </div>

      <Button
        type="submit"
        class="w-full mt-4"
        :label="authStore.isLoading ? 'Creating account...' : 'Register'"
        :loading="authStore.isLoading"
      />
    </form>

    <p class="mt-4 mb-0 text-center">
      Already have an account?
      <router-link to="/login" class="text-blue-500">Login</router-link>
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

const firstName = ref("");
const lastName = ref("");
const email = ref("");
const phoneNumber = ref("");
const password = ref("");
const confirmPassword = ref("");

const errors = reactive({
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
});

const validateForm = () => {
  let valid = true;

  // Reset errors
  errors.firstName = errors.lastName = errors.email = errors.password = errors.confirmPassword = "";

  if (!firstName.value) {
    errors.firstName = "First name is required";
    valid = false;
  }

    if (!lastName.value) {
    errors.lastName = "Last name is required";
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

  const payload = {
    firstName: firstName.value,
    lastName: lastName.value,
    email: email.value,
    phoneNumber: phoneNumber.value || "",
    password: password.value,
    isAdmin: true
  };

  const { success, errorMessage } = await authStore.register(payload);

  if (success) {
    toast.add({
      severity: "success",
      summary: "Registration Successful",
      detail: "Welcome! Your account has been created.",
      life: 3000
    });
    router.push("/dashboard");
  } else {
    toast.add({
      severity: "error",
      summary: "Registration Failed",
      detail: errorMessage || "An error occured during registration.",
      life: 3000
    });
  }
};
</script>

<style scoped>
:deep(.p-password-input) {
  width: 100%;
}

@media (min-width: 1280px) {
  .flex-direction-column {
    flex-direction: column;
  }
}
</style>
