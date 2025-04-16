import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
export const prisma = new PrismaClient();
import jwt from "jsonwebtoken";
dotenv.config();
const SECRET = process.env.JWT_SECRET || "secret";
export const verifyworkspace = async (req, res, next) => {
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
        console.log("Workspace verified successfully:");
        next();
    } catch (error) {
        res.status(500).json({ message: "Error verifying workspace" });
    }
}
export const userMembershipCheck = async (req, res, next) => {
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
            return res.status(500).json({ error: "Token Decoding Error", details: error.message });
        }
    }
    const userId = decoded.id;
    try {
        const workspaceId = req.body.workspaceId;
        console.log("workspaceId:", workspaceId);
        const workspaceMembership = await prisma.workspaceMember.findFirst({
            where: {
                workspaceId: workspaceId,
                userId: userId,
            },
        });
        if (!workspaceMembership) {
            console.error("User is not a member of the specified workspace");

        }
        console.log("User verified successfully in workspace:");


        return next();
    } catch (error) {
        console.error("Error verifying user membership:", error);

    }
};

export const adminPrivileges = async (req, res, next) => {
    const userId = req.userId;
    const { workspaceId } = req.body;

    if (!workspaceId) {
        return res.status(400).json({ error: "Workspace ID is required" });
    }

    try {
        const membership = await prisma.workspaceMember.findFirst({
            where: { userId, workspaceId },
        });

        if (!membership) {
            return res.status(404).json({ message: "User is not a member of the workspace" });
        }

        if (membership.role !== "admin") {
            return res.status(403).json({ message: "Admin privileges required" });
        }

        console.log("User has admin privileges");
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
            return res.status(400).json({ message: 'workspaceId is required.' });
        }

        const workspace = await prisma.workspace.findUnique({
            where: { id: workspaceId },
            select: { ownerId: true },
        });

        if (!workspace) {
            return res.status(404).json({ message: 'Workspace not found.' });
        }

        req.is_owner = workspace.ownerId === userId;
        next();

    } catch (error) {
        console.error('checkIsOwner middleware error:', error);
        res.status(500).json({ message: 'Server error checking ownership.' });
    }
};