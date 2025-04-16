import axios from "axios";
import { TaskRequest, TaskUpdateRequest } from "@/types";
const CREATE_TASK_API = "http://localhost:3001/api/task/create";
const DELETE_TASK_API = "http://localhost:3001/api/task/delete";
const UPDATE_TASK_API = "http://localhost:3001/api/task/updateTask";

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
        assigneeIds: task.assigneesIds,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.log("Error in the TasksAPI FRONTEND :",error);
    
  }
};

export const deleteTaskAPI = async (workspaceId : string,taskId : string)=>{
  const token = localStorage.getItem("token");
  try{
    const response = await axios.delete(DELETE_TASK_API, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        taskId,
        workspaceId,
      },
    });
    return response.data

  }catch(error){
      console.log("Delete task Error :",error);
  }
}

export const updateTaskAPI = async (workspaceId :string,taskId : string,task:TaskUpdateRequest) =>{
    const token = localStorage.getItem("token")
    try{
      const response = await axios.put(
        UPDATE_TASK_API,
        {
          workspaceId,
          taskId,
          title: task.title,
          description: task.description,
          priority: task.priority,
          dueDate: task.dueDate,
          assignees: task.assignees,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
       return response.data;
    }catch(error){
      console.log("Update task Error :",error);
    }
}