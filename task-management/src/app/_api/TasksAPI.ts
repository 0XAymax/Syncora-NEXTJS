import axios from "axios";
import { TaskAssignee, TaskRequest, TaskUpdateRequest } from "@/types";
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const CREATE_TASK_API = `${API_URL}/api/task/create`;
const DELETE_TASK_API = `${API_URL}/api/task/delete`;
const UPDATE_TASK_API = `${API_URL}/api/task/updateTask`;
const GET_TASKS_API = `${API_URL}/api/task/tasks`;
const GET_TASKS_BY_USERID_API = `${API_URL}/api/task/user`;
const UPDATE_STATUS_API = `${API_URL}/api/task/updateStatus`;
const TASK_ASSIGN_API = `${API_URL}/api/task/assign`;
const TASK_UNASSIGN_API = `${API_URL}/api/task/unassign`;
const UPDATE_PRIORITY_API = `${API_URL}/api/task/updatePriority`;

export const addTaskAPI = async (task: TaskRequest) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.post(
      CREATE_TASK_API,
      {
        title: task.title,
        description: task.description,
        priority: task.priority,
        workspaceId: task.workspaceId,
        dueDate: task.dueDate,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.log("Error in the TasksAPI FRONTEND :", error);
  }
};

export const deleteTaskAPI = async (workspaceId: string, taskId: string) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.delete(DELETE_TASK_API, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        taskId,
        workspaceId,
      },
    });
    return response.data;
  } catch (error) {
    console.log("Delete task Error :", error);
  }
};

export const updateTaskAPI = async (
  workspaceId: string,
  taskId: string,
  task: TaskUpdateRequest
) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.put(
      UPDATE_TASK_API,
      {
        workspaceId,
        taskId,
        title: task.title,
        description: task.description,
        dueDate: task.dueDate,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log("Update task Error :", error);
  }
};

export const getTasksByWorkspaceId = async (workspaceId: string) => {
  const token = localStorage.getItem("token");
    const response = await axios.post(
      GET_TASKS_API,
      { workspaceId },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
};

export const getTasksByUserId = async (
  userId: string,
  lowerDate: string,
  higherDate: string
) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.post(
      GET_TASKS_BY_USERID_API,
      { userId, lowerDate, higherDate },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching tasks for user ${userId}:`, error);
  }
};

export const updateStatusAPI =async(workspaceId :string,taskId :string,status:string) =>{
    const token = localStorage.getItem("token");
    const response = await axios.put(UPDATE_STATUS_API,{
            workspaceId,
            taskId,
            status
    },{
            headers: {
                Authorization: `Bearer ${token}`,
            },
    })
    return response.data;

}

export const taskAssigneeAPI = async (assignees: {
  taskId: string;
  workspaceId: string;
  workspaceMemberIds: string[];
}) => {
  const token = localStorage.getItem("token");

  const response = await axios.post(
    TASK_ASSIGN_API,
    {
      taskId: assignees.taskId,
      workspaceId: assignees.workspaceId,
      workspaceMemberIds: assignees.workspaceMemberIds,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const taskUnassigneeAPI = async (assignees: TaskAssignee) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.delete(TASK_UNASSIGN_API, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        taskId: assignees.taskId,
        workspaceId: assignees.workspaceId,
        workspaceMemberIds: assignees.workspaceMemberIds,
      },
    });
    return response;
  } catch (error) {
    console.log("Error assigning task :", error);
  }
};

export const updateTaskPriorityAPI = async (
  workspaceId: string,
  taskId: string,
  priority: string
) => {
  const token = localStorage.getItem("token");
  try {
    const res = await axios.put(
      UPDATE_PRIORITY_API,
      {
        taskId,
        workspaceId,
        priority,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.log("Update task Priority failed :", error);
  }
};
