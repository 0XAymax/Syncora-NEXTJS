import { WorkspaceMember } from "@/lib/types";
import axios from "axios";

const WORKSPACES_API = "http://localhost:3001/api/workspace/workspaces";
const MEMBERS_API = "http://localhost:3001/api/workspace/members";
const TASKS_API = "http://localhost:3001/api/task/tasks";

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

// Function to fetch tasks for a given workspace ID
export const fetchTasksForWorkspace = async (
  workspaceId: string
): Promise<Task[]> => {
  try {
    const response = await axios.post(TASKS_API, { workspaceId: workspaceId });
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

export const fetchMembersFromWorkspace = async (
  workspaceId: string
): Promise<WorkspaceMember[]> => {
  try {
    const token = localStorage.getItem("authToken");

    const response = await axios.post(MEMBERS_API, {
      body: { workspaceId },
      headers: { Authorization: `Bearer ${token}` },
    });

    const membersData = response.data as WorkspaceMember[];

    return membersData;
  } catch (error) {
    console.error("Error fetching workspaces:", error);
    return [];
  }
};
