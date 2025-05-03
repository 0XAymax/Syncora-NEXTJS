import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient();
import { addToInbox } from "../controllers/inboxhandlers.js";

export const createWorkspace = async (req, res) => {
    const { name, description, isPersonal,icon } = req.body;
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
        await prisma.workspaceMember.create(
            {
                data: {
                    workspaceId: workspace.id,
                    userId: currentUserId,
                    role: 'admin',
                },
            });
        // add to inbox
        // what I need 
        // const {recievers,senderId,message,type, Inboxdetails}
        req.body.recievers = [currentUserId];
        req.body.senderId = currentUserId;
        req.body.message = "You have created a new workspace with the name " + name;
        req.body.type = "workspace_create";
        req.body.Inboxdetails = {
            workspaceId: workspace.id,
            workspaceName: name,
        };
        // add to inbox
        await addToInbox(req, res);

        return res.status(201).json({
            message: 'Workspace created successfully',
            workspace,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Error creating workspace',
            error: error.message,
        });
    }
    
}
export const deleteWorkspace = async (req, res) => {
    const { workspaceId } = req.body
    try {
        const membersIds = await prisma.workspaceMember.findMany({
            where: { workspaceId: workspaceId },
            select: { userId: true },
        });

        await prisma.workspace.delete({
            where: { id: workspaceId },
        });
   
        // now let us use the addToInbox function to add the message to all the members of the workspace
        const members = membersIds.map((member) => member.userId);
        console.log("Members" ,members)
        req.body.recievers = members;
        req.body.senderId = req.userId;
        req.body.message = "This workspace" + workspaceId + " has been deleted by the owner";
        req.body.type = "workspace_deleted";
        req.body.Inboxdetails = {
            workspaceId: workspaceId,
            workspaceName: "deleted",
            dateofdeletion: new Date(),
        };
        // add to inbox
        await addToInbox(req, res);
        return res.status(200).json({ message: 'Workspace deleted successfully' });
    } catch (error) {
        console.error(error);
        console.log("Error deleting workspace:", error);
        return res.status(500).json({ message: 'Failed to delete workspace', error: error.message });
    }
   
    

};

export const getAllworkspaces = async (req, res) => {
    const userId = req.userId;

    try {
        const workspaceMemberships = await prisma.workspaceMember.findMany({
            where: {
                userId: userId,
            },
            include: {
                workspace: {
                    select: {
                        id: true,
                        icon: true,
                        name: true,
                        description: true,
                        ownerId: true,
                        createdAt: true,
                        updatedAt: true,
                        isPersonal: true,
                        successorId: true,
                        tasks: {
                            select: {
                                id: true,
                                title: true,
                                dueDate: true,
                                status: true,
                                priority: true,
                                description: true,
                            },
                        },
                        members: {
                            include: {
                                user: true,
                            },
                        },
                    },
                },
            },
        });

        const workspaces = workspaceMemberships.map(m => ({
            ...m.workspace,
        }));

        return res.status(200).json(workspaces);
    } catch (error) {
        console.error("Error fetching workspaces:", error);
        return res.status(500).json({
            message: "Error fetching workspaces",
            error: error.message,
        });
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
}

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
    return res.status(400).json({ message: "You cannot kick yourself" });
  }

  const member = await prisma.workspaceMember.findFirst({
    where: {
      workspaceId,
      id: memberId,
    },
    select: { role: true, id: true },
  });

  if (!member) {
    console.log(workspaceId + " " + memberId);
    return res.status(404).json({ message: "Member not found in workspace." });
  }

  if (member.role === "admin" && !req.is_owner) {
    return res
      .status(403)
      .json({ message: "Only the workspace owner can remove an admin." });
  }
  await prisma.workspaceMember.delete({
    where: { id: memberId },
  });
  return res
    .status(200)
    .json({ message: "Member removed from workspace.", deletedMember: member });
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
    const mostSeniorAdmin = await prisma.workspaceMember.findFirst({
      where: {
        workspaceId,
        role: "admin",
      },
      orderBy: {
        joinedAt: "asc",
      },
    });

    if (mostSeniorAdmin) {
      await prisma.workspace.update({
        where: { id: workspaceId },
        data: { ownerId: mostSeniorAdmin.userId },
      });

      await prisma.workspaceMember.deleteMany({
        where: { workspaceId, userId },
      });

      return res.status(200).json({ message: "You have left the workspace." });
    }

    const mostSeniorMember = await prisma.workspaceMember.findFirst({
      where: {
        workspaceId,
        role: "member",
      },
      orderBy: {
        joinedAt: "asc",
      },
    });

    if (mostSeniorMember) {
      await prisma.workspaceMember.update({
        where: {
          id: mostSeniorMember.id,
        },
        data: {
          role: "admin",
        },
      });

      await prisma.workspace.update({
        where: { id: workspaceId },
        data: { ownerId: mostSeniorMember.userId },
      });

      await prisma.workspaceMember.deleteMany({
        where: { workspaceId, userId },
      });

      return res.status(200).json({ message: "You have left the workspace." });
    }

    // No members left in the workspace, delete the workspace

    await prisma.workspaceMember.deleteMany({
      where: { workspaceId, userId },
    });

    await prisma.workspace.delete({
      where: { id: workspaceId },
    });

    return res.status(200).json({
      message: "You have left the workspace and it has been deleted.",
    });
  }

  if (req.is_owner && req.is_personal) {
    // If the owner is leaving a personal workspace, delete the workspace
    await prisma.workspace.delete({
      where: { id: workspaceId },
    });
    return res.status(200).json({
      message: "You have left the workspace and it has been deleted.",
    });
  }

  if (!req.is_owner) {
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
export const appointSuccessor = async (req, res) => {
  const userId = req.userId;
  const successorId = req.body.successorId;
  const workspaceId = req.body.workspaceId;
  console.log("Appointing successor:", { userId, successorId, workspaceId });
  try {
    const succaaaa = await prisma.workspace.update({
      where: {
        id: workspaceId,
        ownerId: userId,
      },
      data: {
        successorId: successorId,
      },
    });
    console.log("succaaaa:", succaaaa);
    console.log("Successor appointed successfully");
    console.log("userId:", userId);
  } catch (error) {
    console.error("Error appointing successor:", error);
    return res
      .status(500)
      .json({ message: "Error appointing successor", error: error.message });
  }
};

export const transferOwnership = async (req, res) => {
  try {
    const { workspaceId, successorId } = req.body;
    console.log(`workspaceId: ${workspaceId}, successorId: ${successorId}`);

    // First update member role to admin
    const updateResult = await prisma.workspaceMember.updateMany({
      where: {
        userId: successorId,
        workspaceId: workspaceId,
      },
      data: {
        role: "admin",
      },
    });

    // updateMany returns {count: n}, not the record!
    if (updateResult.count === 0) {
      return res.status(404).json({ message: "Member not found" });
    }

    // Then update workspace owner
    await prisma.workspace.update({
      where: { id: workspaceId },
      data: {
        ownerId: successorId,
      },
    });

    // Return success response
    return res
      .status(200)
      .json({ message: "Ownership transferred successfully" });
  } catch (error) {
    console.error("Error transferring ownership:", error);
    return res.status(500).json({
      message: "Failed to transfer ownership",
      error: error.message,
    });
  }
};

export const checkIsEmpty = async (req, res) => {
  const workspaceId = req.body.workspaceId;
  try {
    const members = await prisma.workspaceMember.findMany({
      where: { workspaceId: workspaceId },
      select: { userId: true },
    });
    if (members.length > 1) {
      req.is_empty = false;
    } else {
      req.is_empty = true;
    }
  } catch (error) {
    console.error("checkIsEmpty middleware error:", error);
    res.status(500).json({ message: "Server error checking empty workspace." });
  }
};
