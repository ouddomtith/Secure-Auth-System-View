import axios from "axios";
import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove("token");
      if (typeof window !== "undefined") window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post("/api/auth/register", data),

  login: (data: { email: string; password: string }) =>
    api.post("/api/auth/login", data),

  verifyOtp: (data: { 
    email: string
    otpCode: string
    trustDevice?: boolean   // ← removed deviceToken
  }) =>
    api.post("/api/auth/verify-otp", data),

  // ← Add this
  resendOtp: (data: { email: string }) =>
    api.post("/api/auth/resend-otp", data),

  googleLogin: () => {
    window.location.href = `${API_URL}/oauth2/authorization/google`
  },
}

// User APIs
export const userApi = {
  getProfile: () => api.get("/api/users/me"),
  updateProfile: (data: Partial<{ username: string; email: string }>) =>
    api.put("/api/users/me", data),
  deleteAccount: () => api.delete("/api/users/me"),
  getAllUsers: () => api.get("/api/users"),
};

// Push notification APIs
export const pushApi = {
  subscribe: (data: { endpoint: string; keys: object }) =>
    api.post("/api/push/subscribe", data),
  unsubscribe: (endpoint: string) =>
    api.post("/api/push/unsubscribe", { endpoint }),
  sendToAll: (data: { title: string; body: string }) =>
    api.post("/api/push/send-all", data),
  sendToUser: (userId: string, data: { title: string; body: string }) =>
    api.post(`/api/push/send/${userId}`, data),
};

// Generate a device fingerprint
export function getDeviceId(): string {
  if (typeof window === "undefined") return "";
  let deviceId = localStorage.getItem("deviceId");
  if (!deviceId) {
    deviceId = crypto.randomUUID();
    localStorage.setItem("deviceId", deviceId);
  }
  return deviceId;
}
