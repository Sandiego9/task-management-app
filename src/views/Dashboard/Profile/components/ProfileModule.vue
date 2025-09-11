<template>
  <Dialog
    v-model:visible="isVisible"
    header="Edit Profile"
    modal
    class="w-30rem"
    :draggable="false"
  >
    <form @submit.prevent="onSubmit" class="flex flex-column gap-3">
      <div>
        <div class="flex justify-content-between align-items-center">
          <label for="fullName">Full Name</label>
          <small class="p-error text-red-500 text-xs">{{
            errors.fullName
          }}</small>
        </div>
        <InputText v-model="fullName" v-bind="fullNameAttrs" class="w-full" />
      </div>

      <div>
        <div class="flex justify-content-between align-items-center">
          <label for="profileImage">Profile Image URL</label>
          <small class="p-error text-red-500 text-xs">{{
            errors.profileImage
          }}</small>
        </div>
        <InputText
          v-model="profileImage"
          v-bind="profileImageAttrs"
          class="w-full"
        />
      </div>

      <div>
        <div class="flex justify-content-between align-items-center">
          <label for="email">Email</label>
          <small class="p-error text-red-500 text-xs">{{ errors.email }}</small>
        </div>
        <InputText
          v-model="email"
          v-bind="emailAttrs"
          class="w-full"
          disabled
        />
      </div>

      <div>
        <div class="flex justify-content-between align-items-center">
          <label for="jobTitle">Job Title</label>
          <small class="p-error text-red-500 text-xs">{{
            errors.jobTitle
          }}</small>
        </div>
        <InputText v-model="jobTitle" v-bind="jobTitleAttrs" class="w-full" />
      </div>

      <div>
        <div class="flex justify-content-between align-items-center">
          <label for="phoneNumber">Phone Number</label>
          <small class="p-error text-red-500 text-xs">{{
            errors.phoneNumber
          }}</small>
        </div>
        <InputText
          v-model="phoneNumber"
          v-bind="phoneNumberAttrs"
          class="w-full"
        />
      </div>

      <div>
        <label for="bio">Bio</label>
        <Textarea v-model="bio" v-bind="bioAttrs" class="w-full" rows="3" />
      </div>

      <div>
        <label for="location">Location</label>
        <InputText v-model="location" v-bind="locationAttrs" class="w-full" />
      </div>

      <div>
        <div class="flex justify-content-between align-items-center">
          <label for="portfolio">Portfolio</label>
          <small class="p-error text-red-500 text-xs">{{
            errors.portfolio
          }}</small>
        </div>
        <InputText v-model="portfolio" v-bind="portfolioAttrs" class="w-full" />
      </div>

      <div class="flex justify-content-end gap-2 mt-4">
        <Button
          label="Cancel"
          icon="pi pi-times"
          severity="secondary"
          @click="emit('close')"
        />
        <Button
          type="submit"
          label="Save"
          icon="pi pi-check"
          :loading="loading"
        />
      </div>
    </form>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import type { AuthenticatedUser } from "@/types/user";
import { useForm } from "vee-validate";
import * as yup from "yup";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import Button from "primevue/button";

const emit = defineEmits<{
  (e: "save", user: AuthenticatedUser): void;
  (e: "close"): void;
}>();

const props = defineProps<{
  visible: boolean;
  user: AuthenticatedUser | null;
  loading?: boolean;
}>();

const isVisible = ref(props.visible);
watch(
  () => props.visible,
  (val) => (isVisible.value = val)
);

const schema = yup.object({
  fullName: yup.string().required("Full name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  jobTitle: yup.string().required("Job title is required"),
  profileImage: yup.string().url("Must be a valid URL").nullable(),
  phoneNumber: yup.string().required("Phone number is required"),
  bio: yup.string().nullable(),
  location: yup.string().nullable(),
  portfolio: yup.string().url("Must be a valid URL").nullable(),
});

const { handleSubmit, errors, defineField, resetForm } = useForm({
  validationSchema: schema,
  initialValues: props.user || {},
});

const [fullName, fullNameAttrs] = defineField("fullName");
const [email, emailAttrs] = defineField("email");
const [profileImage, profileImageAttrs] = defineField("profileImage");
const [jobTitle, jobTitleAttrs] = defineField("jobTitle");
const [phoneNumber, phoneNumberAttrs] = defineField("phoneNumber");
const [bio, bioAttrs] = defineField("bio");
const [location, locationAttrs] = defineField("location");
const [portfolio, portfolioAttrs] = defineField("portfolio");

watch(
  () => props.user,
  (val) => {
    if (val) resetForm({ values: val });
  },
  { immediate: true }
);

const onSubmit = handleSubmit((values) => {
  emit("save", values as AuthenticatedUser);
});
</script>
