export type TaskStatus =
  | "not started"
  | "in progress"
  | "completed"
  | "rejected";

export interface Task {
  id: string;
  name: string;
  status: TaskStatus;
}
