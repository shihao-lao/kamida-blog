import axios from "axios";
import { headers } from "next/headers";
const http = axios.create({
  baseURL: "https://api.chatanywhere.tech",
  timeout: 20000,
  headers: {
    Authorization: "Bearer " + process.env.CHATANYWHERE_API_KEY,
    "Content-Type": "application/json",
  },
});
http.interceptors.request.use(
  async (config) => {
    let headersList;
    try {
      headersList = headers();
      if (headersList && typeof headersList.then === "function") {
        headersList = await headersList;
      }
    } catch {
      return config;
    }

    const getHeader =
      headersList && typeof headersList.get === "function"
        ? headersList.get.bind(headersList)
        : null;
    if (!getHeader) return config;

    const incomingAuthorization =
      getHeader("authorization") ?? getHeader("Authorization");
    if (incomingAuthorization) {
      config.headers["Authorization"] = incomingAuthorization;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default http;
