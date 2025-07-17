import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import cartRoutes from "./routes/cart.route.js";
import productRoutes from "./routes/product.route.js";

dotenv.config({});

const app = express();
const PORT = process.env.PORT || 3000;

const __dirname = path.resolve();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true, // Important for cookies to be sent
  })
);

app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));

app.use("/api/auth", authRoutes);
app.use("api/cart", cartRoutes);
app.use("/api/products", productRoutes);

app.listen(PORT, (req, res) => {
  console.log(`Server is Running at http://localhost:${PORT}`);
  connectDB();
});
