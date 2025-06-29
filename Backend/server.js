import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";
import { connectDB } from "./lib/db.js";

dotenv.config({});

const app = express();
const PORT = process.env.PORT || 3000;

const __dirname = path.resolve();

app.listen(PORT, (req, res) => {
  console.log(`Server is Running at http://localhost:${PORT}`);
  connectDB();
});
