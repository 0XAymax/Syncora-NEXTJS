import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
export const prisma = new PrismaClient();
import jwt from "jsonwebtoken";
dotenv.config();
const SECRET = process.env.JWT_SECRET || "secret";

/* export const verifyworkspace = async (req, res) => {
    const { workspaceId } = req.body;
    try {
        const workspace = await prisma.workspace.findUnique({
            where: {
                id: workspaceId,
            },
        });
        if (!workspace) {
            return res.status(404).json({ message: "Workspace not found" });
        }
        res.status(200).json({ message: "Workspace verified successfully", workspace });
    } catch (error) {
        res.status(500).json({ message: "Error verifying workspace" });
    }
}
export const verifyuser = async (req, res) => {
    const { userId } = req.body;
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User verified successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Error verifying user" });
    }
}
export const adminPrivileges = async (req, res) => {
    // this functions checks if the user has admin privileges in the workspace
    const { userId, workspaceId } = req.body;
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const workspace = await prisma.workspace.findUnique({
            where: {
                id: workspaceId,
            },
        });
        if (!workspace) {
            return res.status(404).json({ message: "Workspace not found" });
        }
        if (user.role !== "admin") {
            return res.status(403).json({ message: "User does not have admin privileges" });
        }
        res.status(200).json({ message: "User has admin privileges", user, workspace });
    } catch (error) {
        res.status(500).json({ message: "Error checking admin privileges" });
    }
}*/
export const getWorkspacesByuserId = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "No Token Provided" });
    }

    // Decode token to extract user ID
    let decoded;
    try {
      decoded = jwt.verify(token, SECRET);
    } catch (error) {
      console.error("Error decoding token:", error);
      return res.status(403).json({ error: "Invalid Token" });
    }
    const userId = decoded.id;

    // Debugging log (before using the variable)
    console.log("userId:", userId);

    if (!userId) {
      // If the user ID is not found, return an unauthorized error
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Fetch all workspaces where the user is a member
    const workspaces = await prisma.workspace.findMany({
      where: {
        members: {
          some: {
            userId: userId, // Match workspaces where the user is a member
          },
        },
      },
      include: {
        members: {
          include: {
            user: true, // Include user details for each member
          },
        },
      },
    });

    // Debugging log (before sending response)
    console.log("workspaces:", workspaces);

    // Return the fetched workspaces in the response
    res.status(200).json(workspaces);
  } catch (error) {
    // Log the error and return an internal server error response
    console.error("Error fetching workspaces:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const getMembersByWorkspaceId = async (req, res) => {
  try {
    const { workspaceId } = req.body.workspaceId;
    const members = await prisma.workspaceMember.findMany({
      where: {
        workspaceId: workspaceId,
      },
      include: {
        user: true,
      },
    });
    res.status(200).json(members);
  } catch (error) {
    console.error("Error fetching members:", error);
    res.status(500).json({ error: "Internal server error" });
    console.log("Error fetching members:", error);
  }
};
