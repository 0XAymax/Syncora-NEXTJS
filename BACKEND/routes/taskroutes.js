import { handleInputError } from "../middleware/middleware.js"
import { getAllTasks } from "../controllers/taskhandlers.js"
import express from "express"
const router = express.Router();

// Middleware to verify token for all routes
router.post('/tasks', getAllTasks); //ALL TASKS

router.get('/usertasks', taskController.getTasksByUserId);

/* router.get('/tasks/:id', taskController.getTaskById);
router.post('/tasks', taskController.createTask);
router.put('/tasks/:id', taskController.updateTask);
router.delete('/tasks/:id', taskController.deleteTask);

// Task status routes (for changing task status)
router.put('/tasks/:id/status', taskController.updateTaskStatus);

// Filter tasks by status
router.get('/tasks/status/:status', taskController.getTasksByStatus); */

export default router;
