export interface Task {
  id: string;
  title: string;
  dueDate: string;
}

export interface Workspace {
  id: string;
  name: string;
  description?: string;
  ownerId?: string;
  defaultOpen: boolean;
  isPersonal?: boolean;
  icon?: string;
  updatedAt:string;
  tasks: Task[];
}
interface User {
  id: string;
  name?: string;
  lastName?: string;
  email?: string;
  avatarUrl?: string | undefined;
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
};

export type TaskUpdateRequest = {
  title: string | undefined;
  description?: string | undefined;
  workspaceId: string;
  dueDate: string | undefined;
};

export type WorkspaceCreateRequest = {
  name: string;
  description?: string;
  isPersonal: boolean;
  icon?: string;
};

export type RecentWorkspace = {
  id: string;
  userId: string;
  workspaceId: string;
  viewedAt: string;
  workspace: Workspace;
};
export type TaskAssignee={
  taskId: string;
  workspaceId: string;
  workspaceMemberIds ?: string[];
}
export type InboxType =
  | "workspace_invite"
  | "workspace_role_updated"
  | "removed_from_workspace"
  | "workspace_deleted"
  | "task_assigned"
  | "task_updated"
  | "task_status_changed"
  | "task_due_soon"
  | "task_overdue"
  | "task_comment_added"
  | "admin_announcement"
  | "generic";

// Inbox model as an interface
export interface Inbox {
  id: string;
  userId: string;
  type: InboxType;
  message?: string | null;
  senderId?: string | null;
  details?: Record<string, any> | null; // Represents JSON type
  createdAt: Date;
  read: boolean;
  sender?: User | null; // Optional sender field for messages with a sender
}

export interface WorkspaceUserDetails {
  name: string;
  icon?: string;
  role: string;
}

export interface UserDetails {
  name: string;
  lastName: string;
  email: string;
  avatarUrl?: string | undefined;
  createdAt: Date;
  workspaces : WorkspaceUserDetails[];
}

export interface updateUserRequest {
  name?: string;
  lastName?: string;
  email?: string;
  avatarUrl?: string | undefined;
}

export interface workspaceUpdateRequest {
  workspaceId: string;
  name?: string;
  description?: string;
  icon?: string;
}