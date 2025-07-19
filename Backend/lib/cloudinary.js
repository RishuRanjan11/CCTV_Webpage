import { v2 as cloudinary } from "cloudinary";
// import path from "path";
// import { fileURLToPath } from "url";
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// // Load environment variables from the .env file in the project's root directory (one level up).
// dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log(process.env.CLOUDINARY_CLOUD_NAME ,
  process.env.CLOUDINARY_API_KEY ,
  process.env.CLOUDINARY_API_SECRET );
  console.log("MONGO_URI:", process.env.MONGO_URI ? "Loaded" : "MISSING!");
  console.log("DB_NAME:", process.env.DB_NAME);

export default cloudinary;
