import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
export const prisma = new PrismaClient();
dotenv.config();

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