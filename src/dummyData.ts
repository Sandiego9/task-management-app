import type { Task } from "./types/task";

export const dummyTasks: Task[] = [
  // }
  //   "id": 1,
  //   "title": "Complete the project report",
  //   "description": "Finalize the project report and submit it by the end of the week.",
  //   "status": "in-progress"
  // {
  { id: "1000", name: "Setup project structure", status: "completed" },
  { id: "1001", name: "Build login form", status: "in progress" },
  { id: "1002", name: "Implement task table", status: "not started" },
  { id: "1003", name: "Design Landing Page", status: "completed" },
  { id: "1004", name: "Implement Auth", status: "in progress" },
  { id: "1005", name: "Write Docs", status: "not started" },
  { id: "1006", name: "Client Review", status: "rejected" },
];
