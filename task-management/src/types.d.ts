export interface Task {
  id: string;
  title: string;
  dueDate?: string;
}

export interface Workspace {
  id: string;
  name: string;
  defaultOpen: boolean;
  tasks: Task[];
}
interface User {
  id: string;
  name: string;
  lastName: string;
  email?: string;
  avatarUrl?: string | null;
}

interface AssignedBy {
  id: string;
  name: string;
  lastName: string;
}

export interface Assignee {
  id: string;
  taskId: string;
  userId: string;
  assignedAt: string; // ISO date string
  assignedById: string;
  user: User;
  assignedBy: AssignedBy;
}
export type TaskRequest = {
  title: string;
  description?: string;
  priority: string;
  workspaceId: string;
  dueDate: string;
  assigneesIds: string[];
};

export type TaskUpdateRequest = {
  title: string;
  description?: string;
  priority: string;
  workspaceId: string;
  dueDate: string;
  assignees: string[];
};