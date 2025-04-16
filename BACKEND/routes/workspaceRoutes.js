import express from "express";

import { handleInputError } from "../middleware/middleware.js";
import * as workspaceHandlers from "../controllers/workspacehandler.js";
import * as workspaceMiddleware from "../middleware/workspacemiddleware.js";
import { authenticateUser } from "../middleware/middleware.js";
export const routerr = express.Router();

routerr.get("/workspaces", workspaceHandlers.getWorkspacesByuserId);

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
  workspaceHandlers.deleteWorkspace
);

routerr.post(
  "/add-member",
  handleInputError,
  authenticateUser,

  workspaceHandlers.addMemberToWorkspace
);

routerr.delete(
  "/remove-member",
  handleInputError,
  authenticateUser,
  workspaceMiddleware.checkIsOwner,
  workspaceHandlers.removeMemberFromWorkspace
);

routerr.post(
  "/change-role",
  handleInputError,
  authenticateUser,
  workspaceMiddleware.checkIsOwner,
  workspaceHandlers.changeUserRole
);

routerr.delete(
  "/leave",
  handleInputError,
  authenticateUser,
  workspaceMiddleware.checkIsOwner,
  workspaceHandlers.exitWorkspace
);

routerr.post(
  "/members",
  handleInputError,
  workspaceHandlers.getMembersByWorkspaceId
);

export default routerr;
