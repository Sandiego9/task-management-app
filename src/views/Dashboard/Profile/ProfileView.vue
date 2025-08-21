<template>
  <div class="p-4">
    <h2 class="text-2xl font-bold mb-4">My Profile</h2>

    <Card class="mb-4">
      <template #content>
        <div class="flex align-items-center gap-4">
          <Avatar
            :image="user?.profileImage || ''"
            icon="pi pi-user"
            shape="circle"
            size="xlarge"
          />
          <div>
            <h3 class="m-0 text-xl font-bold">{{ user?.fullName || "Your Full Name" }}</h3>
            <p class="m-0 text-gray-500">{{ authStore.user?.email || "user@email.com" }}</p>
            <Tag
              :value="authStore.user?.isAdmin ? 'Admin' : 'User'"
              :severity="authStore.user?.isAdmin ? 'info' : 'success'"
              class="mt-2"
            />
          </div>
        </div>
      </template>
    </Card>

    <div class="grid gap-3">
      <div class="col-12 md:col-6">
        <strong>Phone:</strong>
        <p>{{ user?.phoneNumber || "Not yet provided" }}</p>
      </div>
      <div class="col-12 md:col-6">
        <strong>Location:</strong>
        <p>{{ user?.location || "Not yet provided" }}</p>
      </div>
      <div class="col-12">
        <strong>Bio:</strong>
        <p>{{ user?.bio || "Not yet provided" }}</p>
      </div>
      <div class="col-12">
        <strong>Portfolio:</strong>
        <p>
          <a v-if="user?.portfolio" :href="user.portfolio" target="_blank">
            {{ user.portfolio }}
          </a>
          <span v-else>Not yet provided</span>
        </p>
      </div>
    </div>

    <div class="flex justify-content-end gap-3 mt-4">
      <Button
        label="Edit Profile"
        icon="pi pi-pencil"
        @click="openEditModal"
      />
      <Button
        label="Logout"
        icon="pi pi-sign-out"
        severity="danger"
        @click="onLogout"
      />
    </div>

    <ProfileModal
      :visible="isModalVisible"
      :user="user"
      :loading="isModalLoading"
      @save="handleSave"
      @close="closeModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import type { AuthenticatedUser } from "@/types/user";
import userServices from "@/services/userServices";
import Button from "primevue/button";
import Avatar from "primevue/avatar";
import Tag from "primevue/tag";
import Card from "primevue/card";
import ProfileModal from "./components/ProfileModule.vue";

const authStore = useAuthStore();
const router = useRouter();
const toast = useToast();

const user = ref<AuthenticatedUser | null>(null);
const isModalVisible = ref(false);
const isModalLoading = ref(false);

const fetchUser = async () => {
  try {
    if (!authStore.user?.id) throw new Error("Missing user ID");

    let existing = await userServices.fetchUser(authStore.user.id);

    if (!existing) {
      const newUser: AuthenticatedUser = {
        id: authStore.user.id,
        fullName: authStore.user.fullName || "User",
        email: authStore.user.email,
        profileImage: authStore.user.profileImage || "",
        phoneNumber: "",
        bio: "",
        location: "",
        portfolio: "",
        isAdmin: authStore.user.isAdmin
      };

      existing = await userServices.createUser(newUser);

      toast.add({
        severity: "info",
        summary: "New User",
        detail: "Please update your profile information.",
        life: 3000
      })
    }
    
    user.value = existing;
  } catch (err) {
    toast.add({
      severity: "error",
      summary: "Error Fetching User",
      detail: "Could not load user data.",
      life: 3000
    });
  }
};

const openEditModal = () => {
  isModalVisible.value = true;
};

const closeModal = () => {
  isModalVisible.value = false;
};

const handleSave = async (updatedUser: AuthenticatedUser) => {
  isModalLoading.value = true;
  try {
    if (!user.value?.id) throw new Error("User ID is missing.");

    const updated = await userServices.updateUser(user.value.id, {
      fullName: updatedUser.fullName,
      profileImage: updatedUser.profileImage,
      email: updatedUser.email,
      phoneNumber: updatedUser.phoneNumber,
      bio: updatedUser.bio,
      location: updatedUser.location,
      portfolio: updatedUser.portfolio,
      isAdmin: updatedUser.isAdmin,
    });

    user.value = updated;
    
    if (authStore.user) {
      authStore.user = {
        id: authStore.user.id,
        email: authStore.user.email,
        isAdmin: authStore.user.isAdmin,
        fullName: updated.fullName,
        profileImage: updated.profileImage,
        phoneNumber: updated.phoneNumber,
        bio: updated.bio,
        location: updated.location,
        portfolio: updated.portfolio,
      };
      localStorage.setItem("user", JSON.stringify(authStore.user));
    }

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

const onLogout = () => {
  authStore.logout();
  router.push("/login");
  toast.add({ severity: "success", summary: "Logout Successful", life: 3000 });
};

onMounted(fetchUser);
</script>
