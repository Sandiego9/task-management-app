import axios from "axios";
import type { Task } from "../types/task";

const baseUrl = import.meta.env.VITE_TASKS_API_BASE_URL;

const taskServices = {
  async fetchTasks(userId?: string): Promise<Task[]> {
    const url = userId ? `${baseUrl}/tasks?userId=${userId}` : `${baseUrl}/tasks`;
    const { data } = await axios.get(url);
    return data as Task[]
  },

  async createTask(newTask: Omit<Task, "id">): Promise<Task> {
    const { data } = await axios.post(`${baseUrl}/tasks`, newTask);
    return data as Task;
  },

  async updateTask(
    id: string | number,
    updatedTask: Partial<Omit<Task, "id">> & { userId: string }
  ): Promise<Task> {
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
