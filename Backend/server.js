import express from "express";
import dotenv from "dotenv";
dotenv.config({ path: path.resolve(__dirname, "..", ".env") });
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
import cloudinary from "./lib/cloudinary.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the .env file in the project's root directory (one level up).

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
// Log environment variables to verify they are loaded correctly
console.log("--- Verifying Environment Variables ---");
console.log("PORT:", process.env.PORT);
console.log("MONGO_URI:", process.env.MONGO_URI);
console.log("DB_NAME:", process.env.DB_NAME);
console.log("ACCESS_TOKEN_SECRET:", process.env.ACCESS_TOKEN_SECRET);
console.log("REFRESH_TOKEN_SECRET:", process.env.REFRESH_TOKEN_SECRET);
console.log("CLOUDINARY_CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("CLOUDINARY_API_KEY:", process.env.CLOUDINARY_API_KEY);
console.log("CLOUDINARY_API_SECRET:", process.env.CLOUDINARY_API_SECRET);
console.log("FRONTEND_DOMAIN_NAME:", process.env.FRONTEND_DOMAIN_NAME);
console.log("------------------------------------");
