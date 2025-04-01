import {Router} from "express"
import { json } from "stream/consumers"
import { handleInputError } from "./modules/middleware"
import * as taskController from "../controllers/taskhandleres"
import { body } from "express-validator"
//import * as updateHInandlers from "./handlers/updates"
// import * as updatePointHandlers from "./handlers/updatePoint"
import * as userHandlers from "./handlers/user"
import { getUserFromToken } from "./handlers/user"
const router = express.Router();

// Middleware to verify token for all routes
router.get('/tasks',handleInputError,taskController.getAllTasks); //ALL TASKS
router.get('/tasks/:id', taskController.getTaskById);
router.post('/tasks', taskController.createTask);
router.put('/tasks/:id', taskController.updateTask);
router.delete('/tasks/:id', taskController.deleteTask);

// Task status routes (for changing task status)
router.put('/tasks/:id/status', taskController.updateTaskStatus);

// Filter tasks by status
router.get('/tasks/status/:status', taskController.getTasksByStatus);
