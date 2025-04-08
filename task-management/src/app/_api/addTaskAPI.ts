import axios from "axios";
import { TaskRequest } from "@/types";
const CREATE_TASK_API = "http://localhost:3001/api/task/create";

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
    console.log("Date received in the addTask API", task.dueDate);
    return response.data;
  } catch (error) {
    console.log("Error fchi hja lmohim :", error);
  }
};
