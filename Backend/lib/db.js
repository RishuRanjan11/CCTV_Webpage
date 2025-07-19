import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    console.log("MONGO_URI:", process.env.MONGO_URI);
    console.log("DB_NAME:", process.env.DB_NAME);
    const conn = await mongoose.connect(
      process.env.MONGO_URI + process.env.DB_NAME
    );

  } catch (error) {

    process.exit(1);
  }
};
