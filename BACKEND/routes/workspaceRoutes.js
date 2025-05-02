import express from "express";

import { handleInputError } from "../middleware/middleware.js";
import * as workspaceHandlers from "../controllers/workspacehandler.js";
import * as workspaceMiddleware from "../middleware/workspacemiddleware.js";
import { authenticateUser } from "../middleware/middleware.js";
export const routerr = express.Router();

routerr.get(
  "/check/:workspaceId",
  // authenticateUser,
  workspaceHandlers.getWorkspaceById
);

routerr.get("/workspaces", workspaceHandlers.getWorkspacesByuserId);

routerr.put(
  "/update",
  handleInputError,
  authenticateUser,
  workspaceMiddleware.verifyworkspace,
  workspaceMiddleware.userMembershipCheck,
  workspaceMiddleware.checkIsOwner,
  workspaceHandlers.updateworkspace
);

routerr.post(
  "/create",
  handleInputError,
  authenticateUser,
  workspaceHandlers.createWorkspace
);

routerr.delete(
  "/delete",
  handleInputError,
  authenticateUser,
  workspaceMiddleware.verifyworkspace,
  workspaceMiddleware.userMembershipCheck,
  workspaceMiddleware.adminPrivileges,
  workspaceHandlers.deleteWorkspace
);

routerr.post(
  "/add-member",
  handleInputError,
  authenticateUser,
  workspaceMiddleware.verifyworkspace,
  workspaceMiddleware.userMembershipCheck,
  workspaceMiddleware.adminPrivileges,
  workspaceMiddleware.checkIsPersonal,
  workspaceHandlers.addMemberToWorkspace
);

routerr.delete(
  "/remove-member",
  handleInputError,
  authenticateUser,
  workspaceMiddleware.verifyworkspace,
  workspaceMiddleware.userMembershipCheck,
  workspaceMiddleware.adminPrivileges,
  workspaceMiddleware.checkIsPersonal,
  workspaceHandlers.removeMemberFromWorkspace
);

routerr.post(
  "/change-role",
  handleInputError,
  authenticateUser,
  workspaceMiddleware.verifyworkspace,
  workspaceMiddleware.checkIsOwner,
  workspaceMiddleware.userMembershipCheck,
  workspaceMiddleware.adminPrivileges,
  workspaceHandlers.changeUserRole
);

routerr.delete(
  "/leave",
  handleInputError,
  authenticateUser,
  workspaceMiddleware.verifyworkspace,
  workspaceMiddleware.checkIsOwner,
  workspaceHandlers.exitWorkspace
);

routerr.post(
  "/members",
  handleInputError,
  workspaceHandlers.getMembersByWorkspaceId
);

export default routerr;
