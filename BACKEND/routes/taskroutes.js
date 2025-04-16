import { handleInputError } from "../middleware/middleware.js";
import { getAllTasks } from "../controllers/taskhandlers.js";
import * as taskController from "../controllers/taskhandlers.js";
import * as workspaceMiddleware from "../middleware/workspacemiddleware.js";
import express from "express";
const router = express.Router();

// Middleware to verify token for all routes
router.post("/tasks", getAllTasks); //ALL TASKS

router.get("/usertasks", taskController.getTasksByUserId);

router.get("/tasks/:id", taskController.getTaskById);
router.post("/tasks", taskController.createTask);
router.put("/tasks/:id", taskController.updateTask);
router.delete("/tasks/:id", taskController.deleteTask);

router.post(
  "/create",
  handleInputError,
  workspaceMiddleware.verifyworkspace,
  workspaceMiddleware.userMembershipCheck,
  // workspaceMiddleware.adminPrivileges,
  taskController.CreateTask
);

router.delete(
  "/delete",
  handleInputError,
  workspaceMiddleware.verifyworkspace,
  workspaceMiddleware.userMembershipCheck,
  /* workspaceMiddleware.adminPrivileges, */
  taskController.DeleteTask
);

router.put(
  "/updateTask",
  handleInputError,
  workspaceMiddleware.verifyworkspace,
  workspaceMiddleware.userMembershipCheck,
  /* workspaceMiddleware.adminPrivileges, */
  taskController.UpdateTask
);
router.put(
  "/updateStatus",
  handleInputError,
  workspaceMiddleware.verifyworkspace,
  workspaceMiddleware.userMembershipCheck,
  taskController.updateTaskStatus
);
// Filter tasks by status
router.get("/tasks/status/:status", taskController.getTasksByStatus);

export default router;
