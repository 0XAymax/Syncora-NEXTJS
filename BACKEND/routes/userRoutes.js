import express from "express";
import { handleInputError } from "../middleware/middleware.js";
import * as userHandlers from "../controllers/userhandlers.js";
import { authenticateUser } from "../middleware/middleware.js";
import { FindChecker } from "../middleware/usermiddleware.js";

import { FixSuccessors } from "../middleware/usermiddleware.js";


const router = express.Router();

router.post("/UserDetails",
  authenticateUser,
  FindChecker,
  userHandlers.getUserDetails);
router.put("/UpdateDetails",
  authenticateUser,
  userHandlers.updateUserDetails);
router.delete("/DeleteAccount",
  authenticateUser,
  FixSuccessors, 
  userHandlers.deleteUserAccount);
router.post(
  "/email",
  handleInputError,
  authenticateUser,
  userHandlers.getUsersByEmail
);

export default router;
