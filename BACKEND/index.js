import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";
const app = express();

app.use(morgan("dev"))// this is a middleware that logs the request
app.use(express.json()); //allows client to return a json
app.use(express.urlencoded({extended: true})) // allows client to add query strnigs and it encodes them , 
// takes the query and puts it in an object for you!!
app.use(cors());
app.use(cookieParser());

app.use("/api/auth", authRoutes);

app.listen(3001, () => console.log("Server running on port 3001"));
console.log("Server running on port 3001");
console.log("Server running, link to localhost:3001");


