import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://cctvdigitalsurveillance.shop/api",
  withCredentials: true, // Allows sending cookies with request
  maxContentLength: Infinity,   // Allow huge JSON/form payloads
  maxBodyLength: Infinity,      // Allow big file uploads
});

export default axiosInstance;
