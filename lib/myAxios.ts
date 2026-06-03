// lib/myAxios.ts
import axios, { AxiosError } from "axios";
import getConfig from "./getConfig";

// NOTE: We send the minimum headers AWS API Gateway expects. Sending
// extra ones like Cache-Control / Pragma / Content-Type-on-GET, or
// appending unknown query params (like a `_t` cache-buster) has caused
// some gateway authorizers to reject the request with HTTP 403
// "Missing Authentication Token" — that error means the gateway's
// path-matcher rejected the request before our key was even checked.
const myAxios = axios.create({
  timeout: 15000,
  headers: {
    Accept: "application/json",
  },
});

myAxios.interceptors.request.use(
  async config => {
    const { baseApiUrl, x_encrypted_key } = await getConfig();
    config.baseURL = baseApiUrl;
    config.headers.set("x-encrypted-key", x_encrypted_key);

    // Only set Content-Type when we actually have a body. AWS authorizers
    // can choke on Content-Type on a GET.
    const method = (config.method || "get").toLowerCase();
    if (method !== "get" && method !== "head" && method !== "delete") {
      config.headers.set("Content-Type", "application/json");
    }

    console.log(
      `🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`
    );

    return config;
  },
  error => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  }
);

myAxios.interceptors.response.use(
  response => {
    console.log(`✅ API Response: ${response.config.url}`, response.status);
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      console.error("❌ API Error Response:", {
        url: error.config?.url,
        status: error.response.status,
        data: error.response.data,
      });
    } else if (error.request) {
      console.error("❌ API No Response:", {
        url: error.config?.url,
        message: "Server tidak bertindak balas",
      });
    } else {
      console.error("❌ API Setup Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default myAxios;
