import { PrismaClient } from "@prisma/client";
// import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library.js';

export const prisma = new PrismaClient();

export const addRecentWorkspace = async (req, res) => {
  const { userId, workspaceId } = req.body;

  if (!userId || !workspaceId) {
    return res
      .status(400)
      .json({ error: "userId and workspaceId are required" });
  }

  try {
    const recentWorkspace = await prisma.recentWorkspace.create({
      data: {
        userId,
        workspaceId,
      },
      include: {
        workspace: true,
      },
    });

    return res.status(201).json(recentWorkspace);
  } catch (error) {
    if (error.code === "P2002") {
      return res
        .status(200)
        .json({ message: "Recent workspace already exists" });
    }

    console.error(error);
    return res.status(500).json({ error: "Failed to store recent workspace" });
  }
};

export const getRecentWorkspaces = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }

  try {
    const recentWorkspaces = await prisma.recentWorkspace.findMany({
      where: { userId },
      include: { workspace: true },
      orderBy: { viewedAt: "desc" },
      take : 8,
    });

    return res.status(200).json(recentWorkspaces);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch recent workspaces" });
  }
};

export const removeRecentWorkspace = async (req, res) => {
  const { userId, workspaceId } = req.body;
  console.log(`User Id ${userId} , Workspace Id ${workspaceId}`);
  if (!userId || !workspaceId) {
    return res
      .status(400)
      .json({ error: "userId and workspaceId are required" });
  }

  try {
    const deletedWorkspace = await prisma.recentWorkspace.deleteMany({
      where: {
        userId,
        workspaceId,
      },
    });

    return res.status(200).json(deletedWorkspace);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to delete recent workspace" });
  }
};

export const clearRecentWorkspaces = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }

  try {
    await prisma.recentWorkspace.deleteMany({
      where: { userId },
    });

    return res.status(200).json({ message: "All recent workspaces cleared" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to clear recent workspaces" });
  }
};
