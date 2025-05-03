import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
const prisma = new PrismaClient();

/*
req includes:
     an array of userIDs or one userID
     a message.
     the type of the inbox
     the senderID or in cases where there is no sender it will simply show system
     
*/
export const addToInbox = async (req, res) => {
  const { recievers, senderId, message, type } = req.body;
  try {
    if (!recievers || recievers.length === 0) {
      throw new Error("Receivers are required");
    }
    if (!message) {
      throw new Error("Message is required");
    }
    if (!type) {
      throw new Error("Type is required");
    }
    if (typeof senderId !== "string") {
      throw new Error("Sender ID must be a string");
    }

    for (let i = 0; i < recievers.length; i++) {
      const recieverId = recievers[i];
      await prisma.inbox.create({
        data: {
          senderId,
          userId: recieverId,
          message,
          type,
          read: false,
        },
      });
    }
  } catch (error) {
    console.error("Error creating inbox:", error);
    throw error; // 💥 throws the error to be handled by the caller
  }
};



export const getUserInbox = async (req, res) => {
  const userId = req.userId;
  try {
    const inbox = await prisma.inbox.findMany({
      where: {
        userId,
      },
      include: {
        sender: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const augmentedItems = await Promise.all(
      inbox.map(async (item) => {
        if (item.type === "workspace_invite" && item.details?.inviteId) {
          const invite = await prisma.workspaceInvite.findUnique({
            where: { id: item.details.inviteId },
            include: { workspace: { select: { id: true, name: true } } },
          });

          if (invite) {
            item.details.invite = invite;
          }
        }
        return item;
      })
    );

    res.status(200).json(augmentedItems);
  } catch (error) {
    console.error("Error fetching inbox:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
// the following function  checks the type of the inbox,
//eg if it is an invite, it will get the invite id from the details of
// that inbox and return every single detail  from that invite and option to accpet it of refuse it
export const viewInboxdetail = async (req, res) => {
  const inboxId = req.body.inboxId;
  try {
    const inbox = await prisma.inbox.findUnique({
      where: {
        id: inboxId,
      },
      include: { sender: true },
    });
    if (!inbox) {
      return res.status(404).json({ message: "Inbox not found" });
    }

    if (inbox.type === "workspace_invite") {
      const invite = await prisma.workspaceInvite.findUnique({
        where: { id: inbox.details.inviteId },
        include: {
          workspace: true,
          inviteSender: {
            select: { name: true, email: true },
          },
        },
      });

      inbox.details.invite = invite;
      return res.status(200).json({
        inbox,
      });
    }
  } catch (error) {
    console.error("Error fetching inbox details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
