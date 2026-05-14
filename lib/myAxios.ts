// lib/myAxios.ts
import axios, { AxiosError } from "axios";
import getConfig from "./getConfig";

const myAxios = axios.create({
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "Cache-Control": "no-cache, no-store, must-revalidate",
    Pragma: "no-cache",
  },
});

myAxios.interceptors.request.use(
  async config => {
    const { baseApiUrl, x_encrypted_key } = await getConfig();
    config.baseURL = baseApiUrl;
    config.headers.set("x-encrypted-key", x_encrypted_key);

    config.params = {
      ...config.params,
      _t: Date.now(),
    };

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
