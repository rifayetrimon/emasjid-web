// lib/myAxios.ts
import axios, { AxiosError } from "axios";

const AUTH_TOKEN =
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJjdXN0X25hbWUiOiJTQU1TVU5HIiwiYXBwX2NvZGUiOiJ0ZXN0Y21zIiwiYXBwX25hbWUiOiJFQk9TUyIsInNpZCI6IjAiLCJhcHBlbmdpbmUiOiJodHRwczovL21vYmlnYXRlLmF3ZmF0ZWNoLmNvbS9jdHJsX21vYmlsZXYyIiwidXJsIjoiaHR0cHM6Ly9kZXZzZWMuYXdmYXRlY2guY29tL3Rlc3RjbXMiLCJkYl9uYW1lIjoiZGV2c2VjX3Rlc3RjbXMiLCJkYl9uYW1lMiI6IiIsImhvc3QiOiI0My4yNTIuMzYuMTkxIiwiY3NpZCI6IkUwMDA4NTUiLCJpYXQiOjE3NjIyNDIzNzgsIm5iZiI6MTc2MjI0MjM0OCwiYXVkIjoidXNlciIsImlzcyI6ImF3ZmF0ZWNoIGdsb2JhbCIsInN1YiI6ImFwcGNvZGUifQ.ud6bKkHNyRxVJICOtPHv-heqguIZkCYpi9POOE8aJwkIbKp72Q9RrtMPdOiHw3USh7q_ZFYX3xwzqvx0Ivhog1RK-BOXIOKQyVUKm3VE7X9bUZTucIHfGweMJHtOyyq0s6PENsmmAcGcSDoQ_DzPryzWUPEp2wCduwANO6tTEm2W8KyiFLhD4iBifo56EwJJwT1Fd3RhFMp5PMq-fe3RKrg27nHOgVT92ewIrLzH9FJHbH8-km2MoKM3QavYvSjMkMQRTLWh-AwOfXO1k4iCLIk7BApB4HDvszLlbvDNWlvWVNNhTkq2zdrthWFAuaIglR5gDakJVWrYWlud6H-bPg";

const myAxios = axios.create({
  baseURL: "https://devapi02.awfatech.com/api/v2/utilities/",
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
  (config) => {
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
  (error) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
myAxios.interceptors.response.use(
  (response) => {
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
