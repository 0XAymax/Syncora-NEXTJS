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
  next();
};
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
      return res
        .status(500)
        .json({ error: "Token Decoding Error", details: error.message });
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

    next();
  } catch (error) {
    console.error("Error verifying user membership:", error);
  }
};

export const adminPrivileges = async (req, res, next) => {
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

  const workspaceId = req.body.workspaceId;

  if (!workspaceId) {
    return res.status(400).json({ error: "Workspace ID is required" });
  }

  try {
    // Query WorkspaceMember to find the user's role in the workspace
    const workspaceMember = await prisma.workspaceMember.findFirst({
      where: {
        userId: userId,
        workspaceId: workspaceId,
      },
    });

    if (!workspaceMember) {
      return res
        .status(404)
        .json({ message: "User is not a member of the workspace" });
    }

    if (workspaceMember.role !== "admin") {
      return res.status(403).json({
        message: "User does not have admin privileges in this workspace",
      });
    }

    console.log("User has admin privileges in the workspace");
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Error checking admin privileges:", error);
    return res.status(500).json({
      message: "Error checking admin privileges",
      details: error.message,
    });
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
      // If the user ID is not found, return an unauthorized error
      return res.status(401).json({ error: "Unauthorized" });
    }
  } catch (error) {
    console.error("Error fetching workspaces:", error);
    res.status(500).json({ error: "Internal server error" });
    console.log("Error fetching workspaces:", error);
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
