import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import cartRoutes from "./routes/cart.route.js";
import productRoutes from "./routes/product.route.js";
import orderRoutes from "./routes/order.route.js";
import adminRoutes from "./routes/admin_users.route.js";
import couponRoutes from "./routes/coupon.route.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the .env file in the project's root directory (one level up).
dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

const app = express();
const PORT = process.env.PORT || 5000; // Changed port to 5000

app.use(
  cors({
    origin: process.env.FRONTEND_DOMAIN_NAME,
    credentials: true, // Important for cookies to be sent
  })
);

app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));

app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/coupons", couponRoutes);
app.listen(PORT, (req, res) => {
  connectDB();
});
