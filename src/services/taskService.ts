import type { Task } from "../types/task";
import { dummyTasks } from "../dummyData";

let tasks: Task[] = [...dummyTasks]; // create a local mutable copy

const simulateDelay = (ms = 500) => new Promise((res) => setTimeout(res, ms));

const taskServices = {
  async fetchTasks(): Promise<Task[]> {
    await simulateDelay();
    return [...tasks]; // return a shallow copy
  },

  async createTask(newTask: Omit<Task, "id">): Promise<Task> {
    await simulateDelay();
    const task: Task = {
      id: Date.now().toString(),
      ...newTask,
    };
    tasks.unshift(task);
    return task;
  },

  async updateTask(
    id: string,
    updatedTask: Omit<Task, "id">
  ): Promise<Task | null> {
    await simulateDelay();
    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) return null;

    tasks[index] = { ...tasks[index], ...updatedTask };
    return tasks[index];
  },

  async deleteTask(id: string): Promise<boolean> {
    await simulateDelay();
    const originalLength = tasks.length;
    tasks = tasks.filter((t) => t.id !== id);
    return tasks.length < originalLength;
  },

  async deleteMultipleTasks(ids: string[]): Promise<boolean> {
    await simulateDelay();
    const originalLength = tasks.length;
    tasks = tasks.filter((t) => !ids.includes(t.id));
    return tasks.length < originalLength;
  },
};

export default taskServices;
