import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const prisma = new PrismaClient();
const SECRET = process.env.JWT_SECRET || "secret";

export const login = async (req, res) => {
  const { email, password } = req.body;
  console.log("Received email:", email);
  console.log("Received password:", password);
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) return res.status(404).json({ message: "User doesn't exist" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: "Invalid Information" });

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name + " " + user.lastName,
      role: user.role,
    },
    SECRET,
    {
      expiresIn: "30d",
    }
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: 3600 * 1000,
  });
  res.json({
    token,
  });
};

export const addUser = async (req, res) => {
  const { name, lastName, email, password,avatarUrl } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        name: name,
        lastName: lastName,
        email: email,
        password: hashedPassword,
        avatarUrl :avatarUrl,
      },
    });
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error creating user" });
  }
};

export const emailCheck = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    res.json({ user: user || null });
  } catch (error) {
    console.error("Error checking email:", error);
    res.status(500).json({ message: "Error occurred, please try again" });
  }
};
