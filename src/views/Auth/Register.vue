<template>
  <AuthLayout cardTitle="Create an Account">
    <form @submit.prevent="onSubmit" class="flex flex-column">
      <div class="flex gap-2">
        <div class="w-full">
          <div class="flex justify-content-between align-items-center">
            <label for="firstName" class="font-medium text-left"
              >First Name</label
            >
            <small v-if="errors.firstName" class="text-red-500 text-xs">
              {{ errors.firstName }}
            </small>
          </div>
          <InputText id="firstName" v-model="firstName" class="w-full" />
        </div>

        <div class="w-full">
          <div class="flex justify-content-between align-items-center">
            <label for="lastName" class="font-medium text-left"
              >Last Name</label
            >
            <small v-if="errors.lastName" class="text-red-500 text-xs">
              {{ errors.lastName }}
            </small>
          </div>
          <InputText id="lastName" v-model="lastName" class="w-full" />
        </div>
      </div>

      <div class="mt-3">
        <div class="flex justify-content-between align-items-center">
          <label for="email" class="font-medium">Email</label>
          <small v-if="errors.email" class="text-red-500 text-xs">
            {{ errors.email }}
          </small>
        </div>
        <InputText id="email" v-model="email" class="w-full" />
      </div>

      <div class="mt-3">
        <div class="flex justify-content-between align-items-center">
          <label for="jobTitle" class="font-medium">Job Title</label>
          <small v-if="errors.jobTitle" class="text-red-500 text-xs">
            {{ errors.jobTitle }}
          </small>
        </div>
        <InputText id="jobTitle" v-model="jobTitle" class="w-full" />
      </div>

      <div class="mt-3">
        <label for="accountType" class="font-medium">Account Type</label>
        <Dropdown
          id="accountType"
          v-model="accountType"
          :options="['User', 'Admin']"
          class="w-full"
          disabled
        />
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
import { useAuthStore } from "@/store/sample.auth";
import AuthLayout from "./layout/AuthLayout.vue";
import InputText from "primevue/inputtext";
import Dropdown from "primevue/dropdown";
import Button from "primevue/button";

const router = useRouter();
const toast = useToast();
const authStore = useAuthStore();

const firstName = ref("");
const lastName = ref("");
const email = ref("");
const jobTitle = ref("");
const accountType = ref("User");

const errors = reactive({
  firstName: "",
  lastName: "",
  email: "",
  jobTitle: "",
});

const validateForm = () => {
  let valid = true;
  errors.firstName = errors.lastName = errors.email = errors.jobTitle = "";

  if (!firstName.value.trim()) {
    errors.firstName = "First name is required";
    valid = false;
  }
  if (!lastName.value.trim()) {
    errors.lastName = "Last name is required";
    valid = false;
  }
  if (!email.value.trim() || !email.value.includes("@")) {
    errors.email = "Valid email is required";
    valid = false;
  }
  if (!jobTitle.value.trim()) {
    errors.jobTitle = "Job title is required";
    valid = false;
  }
  return valid;
};

const onSubmit = async () => {
  if (!validateForm()) return;

  const payload = {
    email: email.value,
    firstName: firstName.value,
    lastName: lastName.value,
    jobTitle: jobTitle.value,
    accountType: accountType.value,
  };

  const { success, errorMessage } = await authStore.registerUser(payload);

  if (success) {
    toast.add({
      severity: "success",
      summary: "Registration Successful",
      detail: "Your account has been created.",
      life: 3000,
    });
    router.push("/login");
  } else {
    toast.add({
      severity: "error",
      summary: "Registration Failed",
      detail: errorMessage || "An error occurred during registration.",
      life: 3000,
    });
  }
};
</script>

<style scoped>
@media (min-width: 1280px) {
  .flex-direction-column {
    flex-direction: column;
  }
}
</style>
