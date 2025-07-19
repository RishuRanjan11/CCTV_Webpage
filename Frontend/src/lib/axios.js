import axios from "axios";

const axiosInstance = axios.create({
 baseURL: "http://cctvdigitalsurveillance.shop/api",
  withCredentials: true, //INFO: Allows to send cookies with the request
});

export default axiosInstance;
