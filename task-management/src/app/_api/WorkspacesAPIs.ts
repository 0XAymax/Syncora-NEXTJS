import axios from "axios";
import { WorkspaceMember } from "@/lib/types";
import { WorkspaceCreateRequest } from "@/types";

interface Task {
  id: string;
  title: string;
}

interface Workspace {
  id: string;
  name: string;
  defaultOpen: boolean;
  tasks: Task[];
}
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const CREATE_WORKSPACE_API = `${API_URL}/api/workspace/create`;
const WORKSPACES_API = `${API_URL}/api/workspace/workspaces`;
const MEMBERS_API = `${API_URL}/api/workspace/members`;
const CHANGE_ROLE_API = `${API_URL}/api/workspace/change-role`;
const TASKS_API = `${API_URL}/api/task/tasks`;
const DELETE_WORKSPACE_API = `${API_URL}/api/workspace/delete`;
const WORKSPACE_API = `${API_URL}/api/workspace/check/`;

export const createWorkspaceAPI = async (workspace: WorkspaceCreateRequest) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.post(
      CREATE_WORKSPACE_API,
      {
        name: workspace.name,
        description: workspace.description,
        isPersonal: workspace.isPersonal,
        icon: workspace.icon,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log("Error in the REST API :", error);
  }
};

export const fetchTasksForWorkspace = async (
  workspaceId: string
): Promise<Task[]> => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.post(
      TASKS_API,
      { workspaceId: workspaceId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data; // Assuming the API returns an array of tasks
  } catch (error) {
    console.error(`Error fetching tasks for workspace ${workspaceId}:`, error);
    return []; // Return empty tasks if API fails
  }
};

// Main function to fetch workspaces with their tasks
export const fetchActiveWorkspaces = async (): Promise<Workspace[]> => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(WORKSPACES_API, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const workspacesData = response.data as Workspace[];

    // Fetch tasks for each workspace
    const workspacesWithTasks = await Promise.all(
      workspacesData.map(async (workspace) => {
        const tasks = await fetchTasksForWorkspace(workspace.id);
        return { ...workspace, defaultOpen: false, tasks };
      })
    );

    return workspacesWithTasks;
  } catch (error) {
    console.error("Error fetching workspaces:", error);
    return [];
  }
};

export const fetchWorkspaceById = async (workspaceId: string) => {
  console.log(workspaceId);
  console.log(WORKSPACE_API + workspaceId);
  try {
    const response = await axios.get(WORKSPACE_API + workspaceId);
    return response.data;
  } catch (error) {
    console.error("Error fetching workspace:", error);
  }
};

export const fetchMembersFromWorkspace = async (
  workspaceId: string
): Promise<WorkspaceMember[]> => {
  try {
    const token = localStorage.getItem("token");
    console.log("Workspace ID :", workspaceId);
    const response = await axios.post(
      MEMBERS_API,
      { workspaceId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const membersData = response.data as WorkspaceMember[];
    console.log("Members Data:", membersData);
    return membersData;
  } catch (error) {
    console.error("Error fetching workspaces:", error);
    return [];
  }
};

export const deleteWorkspaceAPI = async (workspaceId: string) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.delete(DELETE_WORKSPACE_API, {
      headers: { Authorization: `Bearer ${token}` },
      data: { workspaceId },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting workspace:", error);
  }
};

export const changeRoleAPI = async (
  workspaceId: string,
  memberId: string,
  newRole: string
) => {
  console.log(
    `workspaceId: ${workspaceId}, memberId: ${memberId}, newRole: ${newRole}`
  );
  const token = localStorage.getItem("token");
  try {
    const response = await axios.post(
      CHANGE_ROLE_API,
      { workspaceId, memberId, newRole },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response;
  } catch (error) {
    console.error("Error changing role:", error);
  }
};
