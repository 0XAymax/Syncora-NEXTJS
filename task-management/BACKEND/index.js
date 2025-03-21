import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js"
const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/auth",authRoutes);

app.listen(3001, () => console.log("Server running on port 3001"));