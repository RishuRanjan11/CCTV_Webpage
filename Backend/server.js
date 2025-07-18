import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import cartRoutes from "./routes/cart.route.js";
<<<<<<< HEAD
import productRoutes from "./routes/product.route.js";
import orderRoutes from "./routes/order.route.js";

=======
import adminRoutes from "./routes/admin_users.route.js";
import couponRoutes from "./routes/coupon.route.js";
>>>>>>> adim/coupons
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
<<<<<<< HEAD
app.use("api/cart", cartRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

=======
app.use("/api/cart", cartRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/coupons", couponRoutes);
>>>>>>> adim/coupons
app.listen(PORT, (req, res) => {
  console.log(`Server is Running at http://localhost:${PORT}`);
  connectDB();
});
