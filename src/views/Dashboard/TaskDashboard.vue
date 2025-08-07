<template>
  <div
    v-if="authStore.isLoading"
    class="flex align-items-center justify-content-center h-full"
  >
    <ProgressSpinner />
  </div>

  <template v-else>
    <div v-if="isLoggedIn" class="p-4">
      <!-- Header Section -->
      <div
        class="flex flex-column-reverse md:flex-row gap-2 justify-content-between align-items-center mb-4"
      >
        <div class="relative">
          <i class="pi pi-search" />
          <InputText
            v-model="searchQuery"
            class="pl-5"
            placeholder="Search tasks..."
            @input="searchTasks"
          />
        </div>
        <div class="flex align-items-center gap-3">
          <div class="text-right line-height-2">
            <h2 class="m-0 text-xl font-bold">{{ displayName }}</h2>
            <p class="m-0 text-sm text-gray-500">{{ email }}</p>
          </div>
          <Avatar
            icon="pi pi-user"
            class="avatar bg-primary"
            shape="circle"
            @click="toggleMenu"
          />
          <Menu ref="menu" :model="dropdownItems" popup />
        </div>
      </div>

      <!-- Action Buttons Row -->
      <div
        class="flex flex-column md:flex-row justify-content-end align-items-end gap-3 mb-3 border-y-1 surface-border py-4"
      >
        <Button
          label="Delete Task"
          icon="pi pi-trash"
          severity="danger"
          class="p-button-sm"
          v-if="selectedTasks.length > 1"
          @click="handleDeleteSelected"
        />
        <Button
          label="Add New Task"
          icon="pi pi-plus"
          class="p-button-sm"
          @click="openCreateModal"
        />
      </div>

      <!-- Tasks Table -->
      <DataTable
        :value="tasks"
        v-model:selection="selectedTasks"
        selectionMode="multiple"
        dataKey="id"
        responsiveLayout="scroll"
        class="p-datatable-sm"
        stripedRows
        removableSort
      >
        <Column selectionMode="multiple" headerStyle="width: 3rem" />
        <Column field="name" header="Task Name" sortable />
        <Column field="status" header="Status" sortable>
          <template #body="{ data }">
            <Tag
              :value="statusLabel(data.status)"
              :severity="statusSeverity(data.status)"
              :icon="statusIcon(data.status)"
            />
          </template>
        </Column>
        <Column header="Actions">
          <template #body="{ data }">
            <Button
              icon="pi pi-ellipsis-h"
              @click="toggleRowMenu($event, data)"
              class="p-button-text"
            />
            <Menu ref="rowMenuRef" :model="currentRowMenu" popup />
          </template>
        </Column>

        <template #empty>
          <div class="text-center text-gray-500 py-4">No tasks found</div>
        </template>
      </DataTable>

      <!-- Task Modal -->
      <TaskModal
        :visible="isModalVisible"
        :task="editingTask"
        :loading="isModalLoading"
        :existingTaskNames="tasks.map((t) => t.name)"
        @save="handleSave"
        @close="closeModal"
      />

      <ConfirmDialog group="headless">
        <template #container="{ message, acceptCallback, rejectCallback }">
          <div
            class="flex flex-column align-items-center p-4 surface-0 dark:surface-900 border-round"
          >
            <div
              class="border-circle bg-primary text-primary-contrast flex align-items-center justify-content-center h-6rem w-6rem -mt-8"
            >
              <i class="pi pi-question text-4xl"></i>
            </div>
            <span class="font-bold text-2xl block mt-3">{{
              message.header
            }}</span>
            <p>{{ message.message }}</p>
            <div class="flex justify-content-end gap-2 mt-3 w-full">
              <Button
                label="Cancel"
                variant="outlined"
                icon="pi pi-times"
                @click="rejectCallback"
              ></Button>
              <Button
                label="Delete"
                severity="danger"
                icon="pi pi-trash"
                @click="acceptCallback"
              ></Button>
            </div>
          </div>
        </template>
      </ConfirmDialog>
    </div>

    <div v-else>
      <p class="p-5 text-center">You are not authorized to view this page.</p>
    </div>
  </template>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
// import { useAuthStore } from "@/store/auth";
import { useAuthStore } from "../../store/auth";
import { useToast } from "primevue/usetoast";
import ProgressSpinner from "primevue/progressspinner";
import Button from "primevue/button";
import Avatar from "primevue/avatar";
import Menu from "primevue/menu";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
// import TaskModal from "@/components/TaskModal.vue";
// import { Task } from "@/types/task";
import TaskModal from "./components/TaskModal.vue";
import type { Task } from "../../types/task";
// import * as taskService from "@/services/taskService";
import taskServices from "../../services/taskService";
import { InputText } from "primevue";
import ConfirmDialog from "primevue/confirmdialog";
import Tag from "primevue/tag";
import { useConfirm } from "primevue/useconfirm";

const router = useRouter();
const toast = useToast();
const authStore = useAuthStore();
const confirm = useConfirm();

const displayName = computed(() => authStore.user?.displayName || "User");
const email = computed(() => authStore.user?.email || "user@gmail.com");
const isLoggedIn = computed(() => authStore.isAuthenticated);

const menu = ref();
const rowMenuRef = ref();
const searchQuery = ref("");
const currentRowMenu = ref<any[]>([]);
const tasks = ref<Task[]>([]);
const selectedTasks = ref<Task[]>([]);
const isModalVisible = ref(false);
const isModalLoading = ref(false);
const editingTask = ref<Task | null>(null);

const searchTasks = (): void => {
  searchQuery.value = searchQuery.value.trim().toLowerCase();
  if (searchQuery.value) {
    tasks.value = tasks.value.filter((task) =>
      task.name.toLowerCase().includes(searchQuery.value)
    );
  } else {
    fetchTasks();
  }
};

const toggleRowMenu = (event: Event, task: Task) => {
  currentRowMenu.value = getRowActions(task);
  rowMenuRef.value?.toggle(event);
};

const dropdownItems = [
  {
    label: "Logout",
    icon: "pi pi-sign-out",
    command: () => onLogout(),
  },
];

const toggleMenu = (event: Event) => {
  menu.value.toggle(event);
};

const fetchTasks = async () => {
  tasks.value = await taskServices.fetchTasks();
};

const statusLabel = (status: string) => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};

const confirmDelete = (message: string, onConfirm: () => void) => {
  confirm.require({
    group: "headless",
    header: "Are you sure?",
    message,
    accept: onConfirm,
  });
};

const statusSeverity = (
  status: string
): "success" | "info" | "warn" | "danger" => {
  switch (status) {
    case "completed":
      return "success";
    case "in progress":
      return "info";
    case "not started":
      return "warn";
    case "rejected":
      return "danger";
    default:
      return "info";
  }
};

const statusIcon = (status: string): string => {
  switch (status) {
    case "completed":
      return "pi pi-check";
    case "in progress":
      return "pi pi-info-circle";
    case "not started":
      return "pi pi-exclamation-triangle";
    case "rejected":
      return "pi pi-times";
    default:
      return "";
  }
};

const handleSave = async (taskData: Omit<Task, "id">) => {
  isModalLoading.value = true;
  try {
    if (editingTask.value) {
      await taskServices.updateTask(editingTask.value.id, taskData);
    } else {
      await taskServices.createTask(taskData);
    }
    closeModal();
    fetchTasks();
  } catch {
    toast.add({ severity: "error", summary: "Action Failed", life: 3000 });
  } finally {
    isModalLoading.value = false;
  }
};

const handleDeleteSelected = () => {
  confirmDelete(
    "Please confirm you want to delete the selected tasks.",
    async () => {
      try {
        await taskServices.deleteMultipleTasks(
          selectedTasks.value.map((t) => t.id)
        );
        toast.add({
          severity: "success",
          summary: "Tasks Deleted",
          life: 3000,
        });
        selectedTasks.value = [];
        fetchTasks();
      } catch {
        toast.add({ severity: "error", summary: "Delete Failed", life: 3000 });
      }
    }
  );
};

const openCreateModal = () => {
  editingTask.value = null;
  isModalVisible.value = true;
};

const closeModal = () => {
  isModalVisible.value = false;
};

const getRowActions = (task: Task) => [
  {
    label: "Edit",
    icon: "pi pi-pencil",
    command: () => {
      editingTask.value = task;
      isModalVisible.value = true;
    },
  },
  {
    label: "Delete",
    icon: "pi pi-trash",
    command: () => {
      confirmDelete(
        "Please confirm you want to delete this task.",
        async () => {
          await taskServices.deleteTask(task.id);
          toast.add({
            severity: "success",
            summary: "Task Deleted",
            life: 3000,
          });
          fetchTasks();
        }
      );
    },
  },
];

const rowMenus = {};

watch(
  () => authStore.isAuthenticated,
  (authenticated) => {
    if (!authenticated && !authStore.isLoading) {
      router.push("/login");
    }
  }
);

const onLogout = () => {
  authStore.logout();
  toast.add({ severity: "success", summary: "Logout Successful", life: 3000 });
  router.push("/login");
};

fetchTasks();
</script>

<style scoped>
.pi-search {
  position: absolute;
  left: 10px;
  top: 32%;
}

.avatar {
  cursor: pointer;
  width: 42px;
  height: 42px;
}

.p-datatable-sm {
  font-size: 0.9rem;
}

.text-4xl {
  font-size: 2.25rem;
}
</style>
