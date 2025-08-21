<template>
  <Dialog
    v-model:visible="isVisible"
    :header="`${isEditMode ? 'Edit' : 'Add New'} Task`"
    modal
    class="w-30rem"
    :draggable="false"
  >
    <form @submit.prevent="handleSubmit" class="flex flex-column gap-3">
      <div>
        <div class="flex justify-content-between mb-1">
          <label for="taskName">Task Name</label>
          <small v-if="errors.name" class="text-red-500">{{
            errors.name
          }}</small>
        </div>
        <InputText
          id="taskName"
          v-model="form.name"
          class="w-full"
          :disabled="loading"
          :class="{ 'p-invalid': errors.name }"
        />
      </div>

      <div>
        <div class="flex justify-content-between mb-1">
          <label for="status">Status</label>
          <small v-if="errors.status" class="text-red-500">{{
            errors.status
          }}</small>
        </div>
        <Select
          id="status"
          v-model="form.status"
          :options="statuses"
          optionLabel="label"
          optionValue="value"
          placeholder="Select status"
          class="w-full"
          :disabled="loading"
          :class="{ 'p-invalid': errors.status }"
        />
      </div>

      <div class="flex justify-content-end gap-2 mt-4">
        <Button
          label="Cancel"
          icon="pi pi-times"
          severity="secondary"
          @click="emit('close')"
          :disabled="loading"
        />
        <Button
          type="submit"
          icon="pi pi-check"
          :label="isEditMode ? 'Update' : 'Create'"
          :loading="loading"
        />
      </div>
    </form>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import type { Task, TaskStatus } from "@/types/task";
import { useToast } from "primevue/usetoast";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import Select from "primevue/select";
import Button from "primevue/button";

const emit = defineEmits<{
  (e: "save", task: Omit<Task, "id">): void;
  (e: "close"): void;
}>();

const props = defineProps<{
  visible: boolean;
  task?: Task | null;
  loading?: boolean;
  existingTaskNames: string[];
}>();

const toast = useToast();
const isVisible = ref(props.visible);

watch(
  () => props.visible,
  (val) => {
    isVisible.value = val;
  }
);

watch(isVisible, (val) => {
  if (!val) emit("close");
});

const form = ref<Omit<Task, "id">>({
  name: "",
  status: "" as TaskStatus,
});

const errors = ref<{ name: string; status: string }>({
  name: "",
  status: "",
});

const statuses = [
  { label: "Not Started", value: "not started" },
  { label: "In Progress", value: "in progress" },
  { label: "Completed", value: "completed" },
  { label: "Rejected", value: "rejected" },
];

const isEditMode = computed(() => !!props.task);

watch(
  [() => props.visible, () => props.task],
  ([visible]) => {
    if (visible) {
      if (props.task) {
        form.value = {
          name: props.task.name,
          status: props.task.status,
        };
      } else {
        form.value = { name: "", status: "" as TaskStatus };
      }
      errors.value = { name: "", status: "" };
    }
  },
  { immediate: true }
);

const validate = () => {
  let valid = true;
  errors.value = { name: "", status: "" };

  if (!form.value.name.trim()) {
    errors.value.name = "Task name is required";
    valid = false;
  }

  if (!form.value.status) {
    errors.value.status = "Task status is required";
    valid = false;
  }

  return valid;
};

const handleSubmit = () => {
  if (!validate()) return;

  const nameToCheck = form.value.name.trim().toLowerCase();
  const existingNames = props.existingTaskNames.map((n) => n.toLowerCase());

  const isDuplicate =
    existingNames.includes(nameToCheck) &&
    (!isEditMode.value || nameToCheck !== props.task?.name.toLowerCase());

  if (isDuplicate) {
    toast.add({
      severity: "warn",
      summary: "Task already exists",
      detail:
        "A task with this name already exists. Please choose a different name.",
      life: 3000,
    });
    errors.value.name = "Duplicate task name";
    return;
  }

  emit("save", { ...form.value });

  toast.add({
    severity: "success",
    summary: "Success",
    detail: isEditMode.value ? "Task Updated" : "Task Created",
    life: 3000,
  });
};
</script>
