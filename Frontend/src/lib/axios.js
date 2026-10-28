import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
    process.env.REACT_APP_API_URL ||
    (process.env.NODE_ENV === "development"
      ? "http://localhost:5000/api"
      : "/api"),
  withCredentials: true, // Allows sending cookies with request
  maxContentLength: Infinity,   // Allow huge JSON/form payloads
  maxBodyLength: Infinity,      // Allow big file uploads
});

export default axiosInstance;
