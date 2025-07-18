import { create } from "zustand";
import axios from "../lib/axios";
import toast from "react-hot-toast";

export const useOtpStore = create((set) => ({
  loading: false,
  message: "",
  error: "",

  // Send OTP to email
  sendOtp: async (email) => {
    try {
      set({ loading: true, message: "", error: "" });

      const res = await axios.post("/auth/send-otp", {
        email,
      });

      set({ loading: false, message: res.data.message || "OTP sent!" });
    } catch (err) {
      set({
        loading: false,
        error: err.response?.data?.message || "Failed to send OTP",
      });
    }
  },

  // Verify the entered OTP
  verifyOtp: async ({ email, otp }, onSuccess) => {
    try {
      set({ loading: true, message: "", error: "" });

      const res = await axios.post("/auth/verify-otp", {
        email,
        otp,
      });

      set({ loading: false, message: res.data.message || "OTP verified!" });

      if (onSuccess) onSuccess();
    } catch (err) {
      set({
        loading: false,
        error: err.response?.data?.message || "Invalid or expired OTP",
      });
      toast.error(err.response?.data?.message || "Invalid or expired OTP");
    }
  },
}));
