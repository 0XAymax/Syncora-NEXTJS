import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
export const prisma = new PrismaClient();
import jwt from "jsonwebtoken";
dotenv.config();
const SECRET = process.env.JWT_SECRET || "secret";

export const createWorkspace = async (req, res) => {
  const { name, description, isPersonal, icon } = req.body;
  const currentUserId = req.userId;
  try {
    const workspace = await prisma.workspace.create({
      data: {
        name,
        description,
        isPersonal,
        ownerId: currentUserId,
        createdAt: new Date(),
        icon,
      },
    });
    await prisma.workspaceMember.create({
      data: {
        workspaceId: workspace.id,
        userId: currentUserId,
        role: "admin",
      },
    });

    return res.status(201).json({
      message: "Workspace created successfully",
      workspace,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error creating workspace",
      error: error.message,
    });
  }
};
export const deleteWorkspace = async (req, res) => {
  const { workspaceId } = req.body;
  try {
    await prisma.workspace.delete({
      where: { id: workspaceId },
    });

    return res.status(200).json({ message: "Workspace deleted successfully" });
  } catch (error) {
    console.error(error);
    console.log("Error deleting workspace:", error);
    return res
      .status(500)
      .json({ message: "Failed to delete workspace", error: error.message });
  }
};
export const getWorkspacesByuserId = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "No Token Provided" });
    }
    let decoded;
    try {
      decoded = jwt.verify(token, SECRET);
    } catch (error) {
      console.error("Error decoding token:", error);
      return res.status(403).json({ error: "Invalid Token" });
    }
    const userId = decoded.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const workspaces = await prisma.workspace.findMany({
      where: {
        members: {
          some: {
            userId: userId,
          },
        },
      },
      include: {
        members: {
          include: {
            user: true,
          },
        },
      },
    });

    res.status(200).json(workspaces);
  } catch (error) {
    console.error("Error fetching workspaces:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const getMembersByWorkspaceId = async (req, res) => {
  try {
    const { workspaceId } = req.body;
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
export const addMemberToWorkspace = async (req, res) => {
  if (req.is_personal) {
    return res
      .status(400)
      .json({ message: "You cannot add members to a personal workspace." });
  }
  const { workspaceId, memberId, role } = req.body;
  console.log("Adding member to workspace:", { workspaceId, memberId, role });

  try {
    const existingMember = await prisma.workspaceMember.findFirst({
      where: {
        workspaceId: workspaceId,
        userId: memberId,
      },
    });

    if (existingMember) {
      return res
        .status(400)
        .json({ message: "User is already a member of this workspace." });
    }

    await prisma.workspaceMember.create({
      data: {
        workspaceId,
        userId: memberId,
        role: role ?? "member",
      },
    });
    if (req.AcceptInvite) {
      return res.status(201).json({
        message: "${AcceptInvite} and Member added to workspace successfully.",
      });
    } else {
      return res
        .status(201)
        .json({ message: "Member added to workspace successfully." });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "An error occurred while adding the member." });
  }
};
export const removeMemberFromWorkspace = async (req, res) => {
  const { workspaceId, memberId } = req.body;
  const currentUserId = req.userId;
  if (currentUserId === memberId) {
    return res
      .status(400)
      .json({ message: "You cannot remove yourself. Use /leave instead." });
  }

  const member = await prisma.workspaceMember.findFirst({
    where: {
      workspaceId,
      userId: memberId,
    },
    select: { role: true },
  });
  if (member.role === "admin" && !req.is_owner) {
    return res
      .status(403)
      .json({ message: "Only the workspace owner can remove an admin." });
  }
  await prisma.workspaceMember.deleteMany({
    where: { workspaceId, userId: memberId },
  });
  return res.status(200).json({ message: "Member removed from workspace." });
};
export const exitWorkspace = async (req, res) => {
  const { workspaceId } = req.body;

  const userId = req.userId;
  const userRole = await prisma.workspaceMember.findFirst({
    where: {
      workspaceId,
      userId,
    },
    select: { role: true },
  });

  if (req.is_owner && !req.is_personal) {
    return res
      .status(400)
      .json({ message: "Workspace owner cannot leave the workspace." });
  } else if (req.is_owner && req.is_personal) {
    // If the owner is leaving a personal workspace, delete the workspace
    await prisma.workspace.delete({
      where: { id: workspaceId },
    });
    return res.status(200).json({
      message: "You have left the workspace and it has been deleted.",
    });
  } else {
    await prisma.workspaceMember.deleteMany({
      where: { workspaceId, userId },
    });
    return res.status(200).json({ message: "You have left the workspace." });
  }
};
export const changeUserRole = async (req, res) => {
  const { workspaceId, memberId, newRole } = req.body;
  const currentUserId = req.userId;

  const allowedRoles = ["member", "admin", "viewer"];
  if (!allowedRoles.includes(newRole)) {
    return res.status(400).json({ message: "Invalid role provided." });
  }

  if (memberId === currentUserId) {
    return res
      .status(400)
      .json({ message: "You cannot change your own role." });
  }

  const targetUser = await prisma.workspaceMember.findFirst({
    where: {
      workspaceId,
      userId: memberId,
    },

    select: { role: true },
  });

  if (!targetUser) {
    return res
      .status(404)
      .json({ message: "Target user not found in the workspace." });
  }

  if (targetUser.role === "admin" && !req.is_owner) {
    return res.status(403).json({
      message: "Only the workspace owner can change the role of an admin.",
    });
  }

  if (targetUser.id === req.workspace.ownerId && targetUser.id !== res.userId) {
    return res.status(403).json({
      message: "You cannot change the role of the workspace owner.",
    });
  }

  await prisma.workspaceMember.updateMany({
    where: {
      workspaceId,
      userId: memberId,
    },
    data: {
      role: newRole,
    },
  });

  return res.status(200).json({ message: "User role updated successfully." });
};
export const updateworkspace = async (req, res) => {
  const { workspaceId, name, description, icon } = req.body;
  const currentUserId = req.userId;

  try {
    console.log("ownerId:", req.is_owner);
    if (!req.is_owner) {
      return res.status(403).json({
        message: "Only the workspace owner can update the workspace details",
      });
    }
    const updatedWorkspace = await prisma.workspace.update({
      where: { id: workspaceId },
      data: {
        name,
        description,
        icon,
        updatedAt: new Date(),
      },
    });

    return res.status(200).json({
      message: "Workspace updated successfully",
      workspace: updatedWorkspace,
    });
  } catch (error) {
    console.error("Error updating workspace:", error);
    return res.status(500).json({
      message: "Error updating workspace",
      error: error.message,
    });
  }
};

// NOT DONE
export const getAllWorkspaceDetails = async (req, res) => {
  try {
    const { workspaceId } = req.body;

    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
      include: {
        members: {
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
          },
        },
        tasks: {
          include: {
            assignees: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    lastName: true,
                  },
                },
              },
            },
          },
        },
        owner: {
          select: {
            id: true,
            name: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    return res.status(200).json(workspace);
  } catch (error) {
    console.error("Error fetching workspace details:", error);
    return res.status(500).json({
      message: "Error fetching workspace details",
      error: error.message,
    });
  }
};
