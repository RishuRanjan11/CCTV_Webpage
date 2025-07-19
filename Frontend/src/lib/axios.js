import axios from "axios";

const axiosInstance = axios.create({
 baseURL: "https://cctvdigitalsurveillance.shop/api",
  withCredentials: true, //INFO: Allows to send cookies with the request
});

export default axiosInstance;
