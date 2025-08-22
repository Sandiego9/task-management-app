<template>
  <Dialog
    v-model:visible="isVisible"
    header="Change Password"
    modal
    class="w-20rem"
    :draggable="false"
  >
    <form @submit.prevent="handleSubmit" class="flex flex-column gap-3">
      <div>
        <label for="currentPassword">Current Password</label>
        <Password
          id="currentPassword"
          v-model="form.currentPassword"
          class="w-full"
          toggleMask
        />
      </div>

      <div>
        <label for="newPassword">New Password</label>
        <Password
          id="newPassword"
          v-model="form.newPassword"
          class="w-full"
          toggleMask
        />
      </div>

      <div>
        <label for="confirmPassword">Confirm Password</label>
        <Password
          id="confirmPassword"
          v-model="form.confirmPassword"
          class="w-full"
          toggleMask
          :feedback="false"
        />
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
import Dialog from "primevue/dialog";
import Password from "primevue/password";
import Button from "primevue/button";

const emit = defineEmits<{
  (e: "save", payload: { currentPassword: string; newPassword: string }): void;
  (e: "close"): void;
}>();

const props = defineProps<{
  visible: boolean;
  loading?: boolean;
}>();

const isVisible = ref(props.visible);
watch(() => props.visible, (val) => (isVisible.value = val));

const form = ref({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const handleSubmit = () => {
  if (form.value.newPassword !== form.value.confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  emit("save", {
    currentPassword: form.value.currentPassword,
    newPassword: form.value.newPassword,
  });
};
</script>

<style scoped>
:deep(.p-inputtext) {
  width: 100%;
}
</style>
