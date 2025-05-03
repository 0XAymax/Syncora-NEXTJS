import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
export const prisma = new PrismaClient();
dotenv.config();
export const verifyworkspace = async (req, res, next) => {
    const { workspaceId } = req.body;
    if (!workspaceId) {
      return res.status(400).json({ error: "Workspace ID is required" });
    }
  
    try {
        const workspace = await prisma.workspace.findUnique({
            where: {
                id: workspaceId,
            },
        });
      if (!workspace) {
          console.log("Workspace not found ajmi:", workspaceId);
          return res.status(404).json({ message: "Workspace not found" });
          
        }
        console.log("Workspace verified successfully:");
        
    } catch (error) {
        res.status(500).json({ message: "Error verifying workspace" });
    }
    console.log("Workspace verified successfully:");
    req.workspace = workspace; // Attach the workspace to the request object
  } catch (error) {
    res.status(500).json({ message: "Error verifying workspace" });
  }
  next();
};
export const userMembershipCheck = async (req, res, next) => {
  const userId = req.userId;
    try {
        const workspaceId = req.body.workspaceId;
        console.log("workspaceId to check membership:", workspaceId);
        const workspaceMembership = await prisma.workspaceMember.findFirst({
            where: {
                workspaceId: workspaceId,
                userId: userId,
            },
        });
        if (!workspaceMembership) {
            console.error("User is not a member of the specified workspace");
            return res.status(403).json({ message: "User is not a member of the specified workspace" });
        }
        req.workspacemember = workspaceMembership;
        console.log("User verified successfully in workspace:");


        next();
    } catch (error) {
        console.error("Error verifying user membership:", error);
    }
    req.workspacemember = workspaceMembership;
    console.log("User verified successfully in workspace:");

    next();
  } catch (error) {
    console.error("Error verifying user membership:", error);
  }
};

export const adminPrivileges = async (req, res, next) => {
  const userId = req.userId;
  console.log("userId:", userId);
  const { workspaceId } = req.body.workspaceId;
  const member = req.workspacemember;
  try {
    if (member.role !== "admin") {
      return res.status(403).json({ message: "Admin privileges required" });
    }

    console.log("User is admin");
    next();
  } catch (error) {
    console.error("Error checking admin privileges:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const checkIsOwner = async (req, res, next) => {
  try {
    const { workspaceId } = req.body;
    const userId = req.userId;

    if (!workspaceId) {
      return res.status(400).json({ message: "workspaceId is required." });
    }

    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
      select: { ownerId: true },
    });

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found." });
    }

    req.is_owner = workspace.ownerId === userId;
    next();
  } catch (error) {
    console.error("checkIsOwner middleware error:", error);
    res.status(500).json({ message: "Server error checking ownership." });
  }
};
export const checkIsPersonal = async (req, res, next) => {
  const workspaceId = req.body.workspaceId;
  try {
    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
      select: { isPersonal: true },
    });
    req.is_personal = workspace.isPersonal;
    next();
  } catch (error) {
    console.error("checkIsPersonal middleware error:", error);
    res
      .status(500)
      .json({ message: "Server error checking personal workspace." });
  }
};
