// lib/myAxios.ts
import axios, { AxiosError } from "axios";
import getConfig from "./getConfig";

const AUTH_TOKEN = getConfig().token_key || "";
const baseApiUrl = getConfig().baseApiUrl || "";

const myAxios = axios.create({
  baseURL: baseApiUrl,
  timeout: 15000, // 15 seconds
  headers: {
    Authorization: `Bearer ${AUTH_TOKEN}`,
    "Content-Type": "application/json",
    Accept: "application/json",
    // ⭐ Prevent caching in axios
    "Cache-Control": "no-cache, no-store, must-revalidate",
    Pragma: "no-cache",
  },
});

// Request interceptor
myAxios.interceptors.request.use(
  config => {
    console.log(
      `🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`
    );

    // ⭐ Add timestamp to prevent caching
    config.params = {
      ...config.params,
      _t: Date.now(), // Cache buster
    };

    return config;
  },
  error => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
myAxios.interceptors.response.use(
  response => {
    console.log(`✅ API Response: ${response.config.url}`, response.status);
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      // Server responded with error status
      console.error("❌ API Error Response:", {
        url: error.config?.url,
        status: error.response.status,
        data: error.response.data,
      });
    } else if (error.request) {
      // Request made but no response
      console.error("❌ API No Response:", {
        url: error.config?.url,
        message: "Server tidak bertindak balas",
      });
    } else {
      // Error setting up request
      console.error("❌ API Setup Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default myAxios;
