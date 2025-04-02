import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const prisma = new PrismaClient();

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
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      console.error("Authorization header missing or malformed");
      return res.status(401).json({ error: "No Token Provided" });
    }

    // Decode token to extract user ID
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

    // Debugging log (before using the variable)
    console.log("Decoded userId:", userId);

    if (!userId) {
      console.error("Decoded token does not contain a user ID");
      return res.status(401).json({ error: "Unauthorized: User ID Missing" });
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
