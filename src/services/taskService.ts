import axios from "axios";
import type { Task } from "../types/task";

const baseUrl = import.meta.env.VITE_TASKS_API_BASE_URL;

const taskServices = {
  async fetchTasks(): Promise<Task[]> {
    const { data } = await axios.get(`${baseUrl}/tasks`);
    return data as Task[]
  },

  async createTask(newTask: Omit<Task, "id">): Promise<Task> {
    const { data } = await axios.post(`${baseUrl}/tasks`, newTask);
    return data as Task;
  },

  async updateTask(
    id: string | number,
    updatedTask: Omit<Task, "id">
  ): Promise<Task | null> {
    const { data } = await axios.put(`${baseUrl}/tasks/${id}`, updatedTask);
    return data as Task;
  },

  async deleteTask(id: string): Promise<void> {
    await axios.delete(`${baseUrl}/tasks/${id}`);
  },

  async deleteMultipleTasks(ids: (string | number)[]): Promise<void> {
    await Promise.all(ids.map((id) => axios.delete(`${baseUrl}/tasks/${id}`)));
  },
};

export default taskServices;
