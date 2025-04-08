import express from "express";
import { getWorkspacesByuserId } from "../controllers/workspacehandler.js";
import express from "express";
import { getWorkspacesByuserId } from "../controllers/workspacehandler.js";
import { handleInputError } from "../middleware/middleware.js";
import { getMembersByWorkspaceId } from "../controllers/workspacehandler.js";
import { getMembersByWorkspaceId } from "../controllers/workspacehandler.js";
export const routerr = express.Router();

routerr.post("/workspaces", handleInputError, getWorkspacesByuserId); //ALL WORKSPACES
routerr.get("/members", handleInputError, getMembersByWorkspaceId); //ALL members by workspaceId
export default routerr;
