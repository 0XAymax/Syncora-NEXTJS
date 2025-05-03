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

routerr.post(
  "/transfer-ownership",
  handleInputError,
  authenticateUser,
  workspaceMiddleware.verifyworkspace,
  workspaceMiddleware.checkIsOwner,
  workspaceMiddleware.userMembershipCheck,
  workspaceHandlers.transferOwnership
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

<<<<<<< 104-feature-roles
=======
routerr.get('/Dashboard', authenticateUser, workspaceMiddleware.userMembershipCheck, workspaceHandlers.getAllworkspaces);
     
>>>>>>> main
export default routerr;
