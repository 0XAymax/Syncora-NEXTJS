import axios from "axios";
import { WorkspaceMember } from "@/lib/types";
import { WorkspaceCreateRequest, workspaceUpdateRequest } from "@/types";

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

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL ;
const CREATE_WORKSPACE_API=`${API_URL}/api/workspace/create`;
const MEMBERS_API = `${API_URL}/api/workspace/members`;
const DELETE_WORKSPACE_API = `${API_URL}/api/workspace/delete`;
const UPDATE_WORKSPACE_API = `${API_URL}/api/workspace/update`;
const WORKSPACE_API = `${API_URL}/api/workspace/check/`;
const CHANGE_ROLE_API = `${API_URL}/api/workspace/change-role`;
const TRANSFER_OWNERSHIP_API = `${API_URL}/api/workspace/transfer-ownership`;
const REMOVE_MEMBER_API = `${API_URL}/api/workspace/remove-member`;
const LEAVE_API = `${API_URL}/api/workspace/leave`;
const GET_WORKSPACES_API = `${API_URL}/api/workspace/Dashboard`;

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

export const createWorkspaceAPI = async(workspace : WorkspaceCreateRequest) => {
    const token = localStorage.getItem("token");
        try{
            const response=await axios.post(CREATE_WORKSPACE_API,{
                name : workspace.name,
                description : workspace.description,
                isPersonal : workspace.isPersonal,
                icon : workspace.icon,
            },{
                headers : {
                    Authorization: `Bearer ${token}`
                }
            })
            return response.data;
        }catch(error){
            console.log("Error in the REST API :",error)
        }
}

export const fetchActiveWorkspacesAPI =async() =>{
    const token = localStorage.getItem("token");
    const response = await axios.get(GET_WORKSPACES_API, {
        headers: { Authorization: `Bearer ${token}` },
    });
    const workspacesData = response.data as Workspace[];
    const workspacesWithTasks = workspacesData.map((workspace) =>{
        return {...workspace,defaultOpen : false}
    })
    return workspacesWithTasks;
}

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

export const updateWorkspaceAPI = async (workspace: workspaceUpdateRequest) => {
  const token = localStorage.getItem("token");
  const response = await axios.put(
    UPDATE_WORKSPACE_API,
    {
      workspaceId: workspace.workspaceId,
      name: workspace.name,
      description: workspace.description,
      icon: workspace.icon,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
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

export const transferOwnershipAPI = async (
  workspaceId: string,
  successorId: string
) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.post(
      TRANSFER_OWNERSHIP_API,
      {
        workspaceId,
        successorId,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response;
  } catch (error) {
    console.error("Error transferring ownership:", error);
  }
};

export const kickMemberAPI = async (workspaceId: string, memberId: string) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.delete(REMOVE_MEMBER_API, {
      headers: { Authorization: `Bearer ${token}` },
      data: { workspaceId, memberId },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting workspace:", error);
  }
};

export const leaveWorkspaceAPI = async (workspaceId: string) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.delete(LEAVE_API, {
      headers: { Authorization: `Bearer ${token}` },
      data: { workspaceId },
    });
    return response.data;
  } catch (error) {
    console.error("Error leaving workspace:", error);
  }
};
