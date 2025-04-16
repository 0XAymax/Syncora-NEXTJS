import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
export const prisma = new PrismaClient();
import jwt from "jsonwebtoken";
dotenv.config();
const SECRET = process.env.JWT_SECRET || "secret";
export const createWorkspace = async (req, res) => {
  const { name, description, isPersonal } = req.body;
  const currentUserId = req.userId;
  try {
    const workspace = await prisma.workspace.create({
      data: {
        name,
        description,
        isPersonal,
        ownerId: currentUserId,
        createdAt: new Date(),
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
  const { workspaceId, memberId, role } = req.body;

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

    return res
      .status(201)
      .json({ message: "Member added to workspace successfully." });
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
  if (req.is_owner) {
    return res
      .status(400)
      .json({ message: "Workspace owner cannot leave the workspace." });
  }
  await prisma.workspaceMember.deleteMany({
    where: { workspaceId, userId },
  });
  return res.status(200).json({ message: "You have left the workspace." });
};

export const changeUserRole = async (req, res) => {
  const { workspaceId, memberId, newRole } = req.body;
  const currentUserId = req.userId;

  const allowedRoles = ["member", "viewer", "admin"];
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
    return res
      .status(403)
      .json({
        message: "Only the workspace owner can change the role of an admin.",
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
