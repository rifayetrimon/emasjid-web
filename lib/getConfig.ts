import config from "@/public/config.json";

type ConfigType = {
  NEXT_PUBLIC_API_URL: string;
  NEXT_PUBLIC_IMAGE_URL: string;
  NEXT_PUBLIC_SID: string;
  NEXT_PUBLIC_SYSAPP: string;
  NEXT_PUBLIC_ENVIRONMENT: string;
  NEXT_PUBLIC_DOMAIN: string;
  NEXT_PUBLIC_TOKEN_KEY: string;
  NEXT_PUBLIC_X_ENCRYPTED_KEY: string;
};

export default function getConfig() {
  // Dummy implementation for getConfig
  const configData: ConfigType = JSON.parse(JSON.stringify(config ?? "{}"));

  if (!configData) {
    throw new Error("Config data is not available");
  }

  const baseApiUrl = configData.NEXT_PUBLIC_API_URL || ""; // use
  const imageUrl = configData.NEXT_PUBLIC_IMAGE_URL || "";
  const sid = configData.NEXT_PUBLIC_SID || null; // use
  const sysapp = configData.NEXT_PUBLIC_SYSAPP || null;
  const environment = configData.NEXT_PUBLIC_ENVIRONMENT || null;
  const domain = configData.NEXT_PUBLIC_DOMAIN || "";
  const token_key = configData.NEXT_PUBLIC_TOKEN_KEY || ""; // use
  const x_encrypted_key = configData.NEXT_PUBLIC_X_ENCRYPTED_KEY || "";

  return {
    baseApiUrl,
    imageUrl,
    sid,
    environment,
    domain,
    token_key,
    sysapp,
    x_encrypted_key,
  };
}
