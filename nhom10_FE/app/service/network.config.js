import Constants from "expo-constants";
import { Platform } from "react-native";

const PORT = 3000;
const LAN_IP = " 192.168.61.1";

const trimTrailingSlash = (url) => url.replace(/\/+$/, "");

const getExpoHost = () => {
  const hostUri =
    Constants.expoConfig?.hostUri ||
    Constants.manifest?.debuggerHost ||
    Constants.manifest2?.extra?.expoClient?.hostUri;

  return hostUri?.split(":")[0];
};

const getApiHost = () => {
  if (process.env.EXPO_PUBLIC_API_HOST) {
    return process.env.EXPO_PUBLIC_API_HOST;
  }

  if (Platform.OS === "web" && typeof window !== "undefined") {
    return window.location.hostname || "localhost";
  }

  const expoHost = getExpoHost();
  if (expoHost) {
    return expoHost;
  }

  if (Platform.OS === "android") {
    return "10.0.2.2";
  }

  if (Platform.OS === "ios") {
    return "localhost";
  }

  return LAN_IP;
};

const getEnvUrl = (value) => {
  value = value?.trim();
  return value ? trimTrailingSlash(value) : null;
};

export const API_HOST = getApiHost();
export const API_ORIGIN = getEnvUrl(process.env.EXPO_PUBLIC_BACKEND_URL) || `http://${API_HOST}:${PORT}`;
export const SOCKET_ORIGIN = getEnvUrl(process.env.EXPO_PUBLIC_SOCKET_URL) || API_ORIGIN;
export const API_BASE_URL = `${API_ORIGIN}/api`;
