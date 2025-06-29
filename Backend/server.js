import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";
import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";

dotenv.config({});

const app = express();
const PORT = process.env.PORT || 3000;

const __dirname = path.resolve();

app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));

app.use("/api/auth", authRoutes);

app.listen(PORT, (req, res) => {
  console.log(`Server is Running at http://localhost:${PORT}`);
  connectDB();
});
