import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    discountPercentage: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
    },
    expirationDate: {
      type: Date,
      required: true,
      // This creates a TTL index. MongoDB will automatically delete documents
      // 0 seconds after their expirationDate has passed.
      index: { expires: '0s' },
    },
    isFirstTimeOnly: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);

const Coupon = mongoose.model("Coupon", couponSchema);

export default Coupon;
 