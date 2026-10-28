import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { existsSync } from "fs";
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
const PORT = process.env.PORT || 5000;
const frontendBuildPath = path.resolve(__dirname, "..", "Frontend", "build");
const allowedOrigins = [
  process.env.FRONTEND_DOMAIN_NAME || process.env.RENDER_EXTERNAL_URL,
  ...(process.env.NODE_ENV === "production" ? [] : ["http://localhost:3000"]),
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true, // Important for cookies to be sent
  })
);

app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/coupons", couponRoutes);

if (existsSync(frontendBuildPath)) {
  app.use(express.static(frontendBuildPath));
  app.use((req, res, next) => {
    if (
      req.method === "GET" &&
      req.accepts("html") &&
      req.path !== "/api" &&
      !req.path.startsWith("/api/")
    ) {
      res.sendFile(path.join(frontendBuildPath, "index.html"));
      return;
    }

    next();
  });
}

await connectDB();
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server listening on port ${PORT}`);
});
