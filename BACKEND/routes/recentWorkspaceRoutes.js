import * as recentWorkspaceController from '../controllers/recentWorspacehandler.js';
import { checkRecentWorkspaceExists } from '../middleware/RecentWorkspaceMiddleware.js'
import * as workspaceMiddleware from "../middleware/workspacemiddleware.js";
import express from 'express';
const router = express.Router();

router.post('/create',checkRecentWorkspaceExists,workspaceMiddleware.verifyworkspace, recentWorkspaceController.addRecentWorkspace);
router.post('/recent', recentWorkspaceController.getRecentWorkspaces);
router.delete('/delete', recentWorkspaceController.removeRecentWorkspace);
router.delete('/clear', recentWorkspaceController.clearRecentWorkspaces);

export default router;