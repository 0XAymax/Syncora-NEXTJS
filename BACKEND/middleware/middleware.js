import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const SECRET = process.env.JWT_SECRET || "secret";

export const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  console.log("Token:", token);

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access Denied. No Token Provided." });
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    console.log("Decoded Token:", decoded);
    req.user = decoded;
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    if (!user) {
      throw new Error("User not found");
    }

    next();
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(403).json({ message: "Invalid Token" });
  }
};

export const handleInputError = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export const addUserIdToBody = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access Denied. No Token Provided." });
  }
  try {
    const decoded = jwt.verify(token, SECRET);

    req.body.userId = decoded.id;

    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid Token" });
  }
};
export const authenticateUser = async(req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    console.log("Token:", token);
    if (!token) {
      console.error("Authorization header missing or malformed");
      return res.status(401).json({ error: "No Token Provided" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, SECRET);
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
    if (!userId) {
      console.error("Decoded token does not contain a user ID");
      return res.status(401).json({ error: "Unauthorized: User ID Missing" });
    }

    req.userId = userId;
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      console.error("User not found in database");
      return res.status(404).json({ error: "User Not Found" });
    }
    console.log("Authenticated user ID:", userId);
    next();
  } catch (err) {
    console.error("Unexpected error in authentication middleware:", err);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: err.message });
  }

};
