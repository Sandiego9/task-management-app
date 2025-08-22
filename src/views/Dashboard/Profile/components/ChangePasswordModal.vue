<template>
  <Dialog
    v-model:visible="isVisible"
    header="Change Password"
    modal
    class="w-25rem"
    :draggable="false"
  >
    <form @submit.prevent="onSubmit" class="flex flex-column gap-3">
      <div>
        <div class="flex justify-content-between align-items-center">
          <label for="currentPassword">Current Password</label>
          <small class="p-error text-red-500 text-xs">{{ errors.currentPassword }}</small>
        </div>
        <Password v-model="currentPassword" v-bind="cPasswordAttrs" toggleMask class="w-full" />
      </div>

      <div>
        <div class="flex justify-content-between align-items-center">
          <label for="newPassword">New Password</label>
          <small class="p-error text-red-500 text-xs">{{ errors.newPassword }}</small>
        </div>
        <Password v-model="newPassword" v-bind="nPasswordAttrs" toggleMask class="w-full" />
      </div>

      <div>
        <div class="flex justify-content-between align-items-center">
          <label for="confirmPassword">Confirm Password</label>
          <small class="p-error text-red-500 text-xs">{{ errors.confirmPassword }}</small>
        </div>
        <Password v-model="confirmPassword" v-bind="confirmPasswordAttrs" :feedback="false" toggleMask class="w-full" />
      </div>

      <div class="flex justify-content-end gap-2 mt-4">
        <Button label="Cancel" icon="pi pi-times" severity="secondary" @click="emit('close')" />
        <Button type="submit" label="Update" icon="pi pi-check" :loading="loading" />
      </div>
    </form>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useForm } from "vee-validate";
import * as yup from "yup";
import Dialog from "primevue/dialog";
import Password from "primevue/password";
import Button from "primevue/button";

const emit = defineEmits(["save", "close"]);

const props = defineProps<{
  visible: boolean;
  loading?: boolean;
}>();

const isVisible = ref(props.visible);
watch(() => props.visible, (val) => (isVisible.value = val));

const schema = yup.object({
  currentPassword: yup.string().required("Current password is required"),
  newPassword: yup
    .string()
    .min(6, "Must have at least 6 characters")
    .required("New password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "Passwords must match")
    .required("Please confirm your password")
});

const { handleSubmit, errors, defineField, resetForm } = useForm({
  validationSchema: schema
});

const [currentPassword, cPasswordAttrs] = defineField("currentPassword");
const [newPassword, nPasswordAttrs] = defineField("newPassword");
const [confirmPassword, confirmPasswordAttrs] = defineField("confirmPassword");

watch(() => props.visible, (val) => {
  if (!val) resetForm();
});

const onSubmit = handleSubmit((values) => {
  emit("save", values);
});
</script>

<style scoped>
:deep(.p-inputtext) {
  width: 100%;
}
</style>
