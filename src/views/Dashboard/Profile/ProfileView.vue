<template>
  <div class="px-4">
    <h2 class="text-2xl font-bold mb-4">My Profile</h2>

    <Card class="mb-4">
      <template #content>
        <div class="flex flex-column align-items-center gap-4">
          <Avatar
            :image="user?.profileImage || ''"
            icon="pi pi-user"
            shape="circle"
            size="xlarge"
            class="border-1 border-300"
          />
          <div>
            <h3 class="m-0 text-xl font-bold">
              {{ user?.fullName || "Your Full Name" }}
            </h3>
            <p class="m-0 text-gray-500">
              {{ authStore.user?.email || "user@email.com" }}
            </p>
            <p class="m-0 text-sm text-gray-500">
              {{ user?.jobTitle || "Job title not provided" }}
            </p>
            <Tag
              :value="!authStore.user?.accountType ? 'Admin' : 'User'"
              :severity="authStore.user?.accountType ? 'info' : 'success'"
              class="mt-2"
            />
          </div>
        </div>
      </template>
    </Card>

    <div class="grid gap-3">
      <div class="border-1 border-300 border-round-2xl col-8 md:col-4">
        <strong>Phone:</strong>
        <p class="mt-0">{{ user?.phoneNumber || "Not yet provided" }}</p>
      </div>
      <div class="border-1 border-300 border-round-2xl col-8 md:col-4">
        <strong>Location:</strong>
        <p class="mt-0">{{ user?.location || "Not yet provided" }}</p>
      </div>
      <div class="border-1 border-300 border-round-2xl col-8">
        <strong>Bio:</strong>
        <p class="mt-0">{{ user?.bio || "Not yet provided" }}</p>
      </div>
      <div class="border-1 border-300 border-round-2xl col-8">
        <strong>Portfolio:</strong>
        <p class="mt-0">
          <a v-if="user?.portfolio" :href="user.portfolio" target="_blank">
            {{ user.portfolio }}
          </a>
          <span v-else>Not yet provided</span>
        </p>
      </div>
    </div>

    <div class="flex justify-content-end gap-3 mt-4">
      <Button label="Edit Profile" icon="pi pi-pencil" @click="openEditModal" />
      <Button
        label="Change Password"
        icon="pi pi-lock"
        severity="warning"
        @click="openPasswordModal"
      />
    </div>

    <ProfileModal
      :visible="isModalVisible"
      :user="user"
      :loading="isModalLoading"
      @save="handleSave"
      @close="closeModal"
    />

    <ChangePasswordModal
      :visible="isPasswordModalVisible"
      :loading="isPasswordLoading"
      @close="closePasswordModal"
      @save="handlePasswordChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useAuthStore } from "@/store/auth";
import { useToast } from "primevue/usetoast";
import type { AuthenticatedUser } from "@/types/user";
import userServices from "@/services/userServices";
import Button from "primevue/button";
import Avatar from "primevue/avatar";
import Tag from "primevue/tag";
import Card from "primevue/card";
import ProfileModal from "./components/ProfileModule.vue";
import ChangePasswordModal from "./components/ChangePasswordModal.vue";

const authStore = useAuthStore();
const toast = useToast();

const user = computed(() => authStore.user);
const isModalVisible = ref(false);
const isModalLoading = ref(false);
const isPasswordLoading = ref(false);
const isPasswordModalVisible = ref(false);

const openEditModal = () => {
  isModalVisible.value = true;
};

const closeModal = () => {
  isModalVisible.value = false;
};

const openPasswordModal = () => {
  isPasswordModalVisible.value = true;
};

const closePasswordModal = () => {
  isPasswordModalVisible.value = false;
};

const handleSave = async (updatedUser: AuthenticatedUser) => {
  isModalLoading.value = true;
  try {
    if (!user.value?.id) throw new Error("User ID is missing.");

    const updated = await userServices.updateUser(user.value.id, {
      fullName: updatedUser.fullName,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      jobTitle: updatedUser.jobTitle,
      profileImage: updatedUser.profileImage,
      email: updatedUser.email,
      phoneNumber: updatedUser.phoneNumber,
      bio: updatedUser.bio,
      location: updatedUser.location,
      portfolio: updatedUser.portfolio,
      accountType: updatedUser.accountType,
    });

    authStore.user = updated;
    localStorage.setItem("user", JSON.stringify(updated));

    toast.add({
      severity: "success",
      summary: "Profile Updated",
      detail: "Your profile information has been updated.",
      life: 3000,
    });
    closeModal();
  } catch {
    toast.add({
      severity: "error",
      summary: "Update Failed",
      detail: "Could not update profile.",
      life: 3000,
    });
  } finally {
    isModalLoading.value = false;
  }
};

const handlePasswordChange = async (payload: {
  currentPassword: string;
  newPassword: string;
}) => {
  isPasswordLoading.value = true;
  try {
    const { success, errorMessage } = await authStore.changePassword(payload);

    if (success) {
      toast.add({
        severity: "success",
        summary: "Password Changed",
        detail: "Your password has been successfully updated.",
        life: 3000,
      });
      closePasswordModal();
    } else {
      throw new Error(errorMessage);
    }
  } catch (error: any) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: error?.message || "Failed to change password.",
      life: 3000,
    });
  } finally {
    isPasswordLoading.value = false;
  }
};
</script>

<style scoped>
.grid {
  place-content: center;
}
</style>
