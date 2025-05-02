import { PrismaClient } from "@prisma/client";
import * as workspacehandler from "../controllers/workspacehandler.js";
import { checkIsEmpty } from "../controllers/workspacehandler.js";
const prisma = new PrismaClient();

// this ml is used to check if the user  requesting a specic user is  himself or another user
// if it is himself it will return the user details 
// and if it is another user it  will check the user preferences and if its alright it  returns the user details of that user
export const FindChecker = async (req, res, next) => {
    const loggedUser = req.userId;
    console.log("userId init", req.body.userId);
    try {
        if (!req.body.userId) {
            req.body.userId = loggedUser;
        } else {
            const user = await prisma.user.findUnique({
                where: { id: req.body.userId },
            });
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            console.log("userId", req.body.userId);

        }
        next();
    } catch (error) {
        console.error("Error checking user preferences:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
export const FixSuccessors = async (req, res, next) => {
    const userId = req.userId;
    try {
        const workspaceIds = await prisma.workspace.findMany({
            where:{
                ownerId: userId // Changed to ownerId to match schema
            },
            select: {
                id: true,
                successorId: true, // Changed to successorId to match schema
            },
        });
       
        
        // Filter workspaces into two arrays
        const successorWorkspaceIds = [];
        const noSuccessorWorkspaceIds = [];
        workspaceIds.forEach(workspace => {
            if (workspace.successorId) {
                successorWorkspaceIds.push(workspace.id);
            } else {
                noSuccessorWorkspaceIds.push(workspace.id);
            }
        });
        console.log("successorWorkspaceIds", successorWorkspaceIds);
        console.log("noSuccessorWorkspaceIds", noSuccessorWorkspaceIds);
        
        // Process each workspace without a successor
        for (const workspaceId of noSuccessorWorkspaceIds) {
            req.body.workspaceId = workspaceId;
            checkIsEmpty(req,res);
            if(req.is_empty){
                //then just delete the workspace and continue
                await prisma.workspace.delete({
                    where: {
                        id: workspaceId,
                    },
                });
                console.log("Workspace deleted:", workspaceId);

            }else{
            console.log("Processing workspace:", workspaceId);
            // First try to find the most senior admin
            const seniorAdmin = await prisma.workspaceMember.findFirst({
                where: { 
                    workspaceId: workspaceId,
                    role: 'admin',
                    userId: {
                        not: userId
                    }
                },
                orderBy: {
                    joinedAt: 'asc' // Oldest member first
                }
            });
            if (seniorAdmin) {
                console.log("Senior admin found:", seniorAdmin.userId);
                req.body.successorId = seniorAdmin.userId;
            } else {
                // If no admin exists, find the most senior member
                const seniorMember = await prisma.workspaceMember.findFirst({
                    where: {
                        workspaceId: workspaceId,
                        role: "member"
                    },
                    orderBy: {
                        joinedAt: 'asc'
                    }
                });
                
                if (seniorMember) {
                    req.body.successorId = seniorMember.userId;
                } else {
                    continue;
                }
            }   
            
            await workspacehandler.appointSuccessor(req, res);
            await workspacehandler.transferOwnership(req, res);
        }
    }
        req.workspaceIds =workspaceIds;
        next();
    } catch (error) {
        console.error("Error fetching user workspaces:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
