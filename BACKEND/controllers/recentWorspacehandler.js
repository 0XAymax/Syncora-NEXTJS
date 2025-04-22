import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient();

export const addRecentWorkspace = async (req, res) => {
    const { userId, workspaceId } = req.body;
    console.log(`User Id ${userId} , Workspace Id ${workspaceId}`);
    if (!userId || !workspaceId) {
        return res.status(400).json({ error: 'userId and workspaceId are required' });
    }

    try {
        const existingWorkspace = await prisma.recentWorkspace.findFirst({
            where: {
                userId: userId.trim(),
                workspaceId: workspaceId.trim(),
            },
        });
        console.log("🔍 existingWorkspace:", existingWorkspace);
        if (existingWorkspace) {
            return res.status(200).json({ message: 'Workspace already added to recent workspaces' });
        }

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
        console.error(error);
        return res.status(500).json({ error: 'Failed to store recent workspace' });
    }
};

export const getRecentWorkspaces = async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ error: 'userId is required' });
    }

    try {
        const recentWorkspaces = await prisma.recentWorkspace.findMany({
            where: { userId },
            include: { workspace: true }, 
            orderBy: { viewedAt: 'desc' }, 
        });

        return res.status(200).json(recentWorkspaces);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to fetch recent workspaces' });
    }
};

export const removeRecentWorkspace = async (req, res) => {
    const { userId, workspaceId } = req.body;
    console.log(`User Id ${userId} , Workspace Id ${workspaceId}`);
    if (!userId || !workspaceId) {
        return res.status(400).json({ error: 'userId and workspaceId are required' });
    }

    try {
        const deletedWorkspace = await prisma.recentWorkspace.deleteMany({
            where: {
                userId,
                workspaceId
            },
        });

        return res.status(200).json(deletedWorkspace);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to delete recent workspace' });
    }
}

export const clearRecentWorkspaces = async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ error: 'userId is required' });
    }

    try {
        await prisma.recentWorkspace.deleteMany({
            where: { userId },
        });

        return res.status(200).json({ message: 'All recent workspaces cleared' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to clear recent workspaces' });
    }
}