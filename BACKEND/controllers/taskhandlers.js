import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const prisma = new PrismaClient();

export const CreateTask = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      console.error("Authorization header missing or malformed");
      return res.status(401).json({ error: "No Token Provided" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        console.error("Token has expired:", error);
        return res.status(403).json({ error: "Token Expired" });
      } else if (error.name === "JsonWebTokenError") {
        console.error("Invalid token:", error);
        return res.status(403).json({ error: "Invalid Token" });
      } else {
        console.error("Error decoding token:", error);
        return res
          .status(500)
          .json({ error: "Token Decoding Error", details: error.message });
      }
    }

    const userId = decoded.id;
    console.log("Decoded userId:", userId);
    if (!userId) {
      console.error("Decoded token does not contain a user ID");
      return res.status(401).json({ error: "Unauthorized: User ID Missing" });
    }
    const { title, description, priority, workspaceId, dueDate, assigneeIds } =
      req.body;
    console.log("Raw dueDate received:", dueDate);
    console.log("Type of dueDate:", typeof dueDate);
    // Create a new task
    const newTask = await prisma.task.create({
      data: {
        title,
        description,
        priority,
        workspaceId,
        dueDate: new Date(dueDate),
        createdById: userId,
        status: "pending",
        priorityOrder: 0,
      },
    });
    let ownerId = userId;
    if (assigneeIds && assigneeIds.length > 0) {
      const taskAssignees = assigneeIds.map((userId) => ({
        taskId: newTask.id,
        userId,
        assignedById: ownerId,
      }));

      await prisma.taskAssignee.createMany({
        data: taskAssignees,
      });
    }
    res.status(201).json({ message: "Task created successfully" });
  } catch (error) {
    console.error("Error creating task:", error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
};
export const DeleteTask = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    console.error("Authorization header missing or malformed");
    return res.status(401).json({ error: "No Token Provided" });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      console.error("Token has expired:", error);
      return res.status(403).json({ error: "Token Expired" });
    } else if (error.name === "JsonWebTokenError") {
      console.error("Invalid token:", error);
      return res.status(403).json({ error: "Invalid Token" });
    } else {
      console.error("Error decoding token:", error);
      return res
        .status(500)
        .json({ error: "Token Decoding Error", details: error.message });
    }
  }

  const userId = decoded.id;
  const { taskId, workspaceId } = req.body;

  if (!userId) {
    console.error("Decoded token does not contain a user ID");
    return res.status(401).json({ error: "Unauthorized: User ID Missing" });
  }

  if (!taskId || !workspaceId) {
    return res.status(400).json({ error: "Missing taskId or workspaceId" });
  }

  try {
    // Delete the task
    const deletedTask = await prisma.task.delete({
      where: { id: taskId },
    });

    res.status(200).json({ message: "Task deleted successfully", deletedTask });
  } catch (error) {
    console.error("Error deleting task:", error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
};
export const UpdateTask = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "No Token Provided" });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    const message =
      error.name === "TokenExpiredError"
        ? "Token Expired"
        : error.name === "JsonWebTokenError"
        ? "Invalid Token"
        : "Token Decoding Error";
    return res.status(403).json({ error: message, details: error.message });
  }

  const { workspaceId, taskId, ...updateFields } = req.body;

  if (!workspaceId || !taskId) {
    return res
      .status(400)
      .json({ error: "Both workspaceId and taskId are required." });
  }

  // Remove fields explicitly set to null or undefined
  const filteredUpdates = Object.fromEntries(
    Object.entries(updateFields).filter(
      ([_, value]) => value !== null && value !== undefined
    )
  );

  // If no valid fields to update
  if (Object.keys(filteredUpdates).length === 0) {
    return res
      .status(400)
      .json({ error: "No valid fields provided for update." });
  }

  try {
    const updatedTask = await prisma.task.update({
      where: {
        id: taskId,
        workspaceId: workspaceId,
      },
      data: filteredUpdates,
    });

    res.status(200).json({
      message: "Task updated successfully.",
      updatedTask,
    });
  } catch (error) {
    console.error("Error updating task:", error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
};
export const updateTaskStatus = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }

  const userId = decoded.id;
  const { taskId, workspaceId, status } = req.body;

  if (!taskId || !workspaceId || !status) {
    return res
      .status(400)
      .json({ error: "taskId, workspaceId, and status are required" });
  }

  try {
    // Check if user is an assignee of the task
    const isAssignee = await prisma.taskAssignee.findFirst({
      where: {
        taskId,
        userId,
      },
    });

    // Check if user is admin in the workspace
    const isAdmin = await prisma.workspaceMember.findFirst({
      where: {
        workspaceId,
        userId,
        role: "admin",
      },
    });

    if (!isAssignee && !isAdmin) {
      return res
        .status(403)
        .json({ error: "Unauthorized: Not an assignee or workspace admin" });
    }

    // Update task status
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: { status },
    });

    // Optionally log this activity
    await prisma.taskActivity.create({
      data: {
        taskId,
        userId,
        action: "status_changed",
        details: { newStatus: status },
      },
    });

    return res.status(200).json({ message: "Task status updated" });
  } catch (error) {
    console.error("Error updating task status:", error);
    return res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
};

export const getAllTasks = async (req, res) => {
  try {
    const { workspaceId } = req.body;
    const tasks = await prisma.task.findMany({
      where: {
        workspaceId: workspaceId,
      },
      include: {
        assignees: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                lastName: true,
                email: true,
                avatarUrl: true,
              },
            },
            assignedBy: {
              select: {
                id: true,
                name: true,
                lastName: true,
              },
            },
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            lastName: true,
            email: true,
          },
        },
        workspace: {
          select: {
            id: true,
            name: true,
            icon: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching workspace tasks:", error);
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
};
/**expected return 
 [
  {
    "id": 1,
    "title": "Design Homepage",
    "description": "Create a responsive homepage design.",
    "createdAt": "2023-10-01T10:00:00Z",
    "workspace": {
      "id": 101,
      "name": "Marketing Team",
      "icon": "https://example.com/icons/marketing.png"
    },
    "createdBy": {
      "id": 201,
      "name": "Alice",
      "lastName": "Smith",
      "email": "alice@example.com"
    },
    "assignees": [
      {
        "user": {
          "id": 301,
          "name": "Bob",
          "lastName": "Johnson",
          "email": "bob@example.com",
          "avatarUrl": "https://example.com/avatars/bob.png"
        },
        "assignedBy": {
          "id": 201,
          "name": "Alice",
          "lastName": "Smith"
        }
      },
      {
        "user": {
          "id": 302,
          "name": "Charlie",
          "lastName": "Brown",
          "email": "charlie@example.com",
          "avatarUrl": "https://example.com/avatars/charlie.png"
        },
        "assignedBy": {
          "id": 201,
          "name": "Alice",
          "lastName": "Smith"
        }
      }
    ]
  }
]

 */
export const getTasksByUserId = async (req, res) => {
  try {
    const { userId } = decodeTokenToUserId(req);
    console.log("userId:", userId);
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const tasks = await prisma.task.findMany({
      where: {
        assignees: {
          some: {
            userId: userId,
          },
        },
      },
      include: {
        assignees: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                lastName: true,
                email: true,
                avatarUrl: true,
              },
            },
            assignedBy: {
              select: {
                id: true,
                name: true,
                lastName: true,
              },
            },
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            lastName: true,
            email: true,
          },
        },
        workspace: {
          select: {
            id: true,
            name: true,
            icon: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    console.log("tasks:", tasks);
    // Return the fetched tasks as a JSON response
    res.status(200).json(tasks);
  } catch (error) {
    // Log and return an internal server error if something goes wrong
    console.error("Error fetching tasks for user:", error);
    res.status(500).json({ error: "Internal server error" });
    console.log(error);
  }
};
