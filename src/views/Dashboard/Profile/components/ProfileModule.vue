<template>
  <Dialog
    v-model:visible="isVisible"
    header="Edit Profile"
    modal
    class="w-30rem"
    :draggable="false"
  >
    <form @submit.prevent="handleSubmit" class="flex flex-column gap-3">
      <div>
        <label for="fullName">Full Name</label>
        <InputText id="fullName" v-model="form.fullName" class="w-full" />
      </div>

      <div>
        <label for="profileImage">Profile Image URL</label>
        <InputText
          id="profileImage"
          v-model="form.profileImage"
          class="w-full"
        />
      </div>

      <div>
        <label for="email">Email</label>
        <InputText id="email" v-model="form.email" class="w-full" disabled />
      </div>

      <div>
        <label for="phoneNumber">Phone Number</label>
        <InputText
          id="phoneNumber"
          v-model="form.phoneNumber"
          class="w-full"
        />
      </div>

      <div>
        <label for="bio">Bio</label>
        <Textarea id="bio" v-model="form.bio" class="w-full" rows="3" />
      </div>

      <div>
        <label for="location">Location</label>
        <InputText id="location" v-model="form.location" class="w-full" />
      </div>

      <div>
        <label for="portfolio">Portfolio</label>
        <InputText id="portfolio" v-model="form.portfolio" class="w-full" />
      </div>

      <div class="flex justify-content-end gap-2 mt-4">
        <Button label="Cancel" icon="pi pi-times" severity="secondary" @click="emit('close')" />
        <Button type="submit" label="Save" icon="pi pi-check" :loading="loading" />
      </div>
    </form>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useAuthStore } from "@/store/auth";
import type { AuthenticatedUser } from "@/types/user";
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

const authStore = useAuthStore();

const isVisible = ref(props.visible);
watch(() => props.visible, (val) => (isVisible.value = val));

const form = ref<AuthenticatedUser>({
  id: "",
  fullName: "",
  profileImage: "",
  email: authStore.user?.email || "",
  phoneNumber: "",
  bio: "",
  location: "",
  portfolio: "",
  isAdmin: false,
});

watch(
  () => props.user,
  (val) => {
    if (val) form.value = { ...val };
  },
  { immediate: true }
);

const handleSubmit = () => {
  emit("save", form.value);
};
</script>
