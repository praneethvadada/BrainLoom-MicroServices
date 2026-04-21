// 📄 /lib/axios.ts

import axios from "axios";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  (process.env.NODE_ENV === "development"
    ? "http://localhost:4000/api/v1"
    : "/api/v1");

export const api = axios.create({
  baseURL: BASE_URL,
});

// ✅ SAFE TOKEN ACCESS (NO CRASH)
api.interceptors.request.use((config) => {
  try {
    const { useAuthStore } = require("@/features/auth/auth.store");
    const accessToken = useAuthStore.getState().accessToken;

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
  } catch (err) {
    console.warn("Auth store not ready yet");
  }

  return config;
});

// import axios, { AxiosError } from "axios";
// import { useAuthStore } from "@/features/auth/auth.store";

// const api = axios.create({
//   baseURL: "http://localhost:4000/api/v1",
// });

// // 🔹 REQUEST INTERCEPTOR (attach token)
// api.interceptors.request.use((config) => {
//   const { accessToken } = useAuthStore.getState();

//   if (accessToken) {
//     config.headers.Authorization = `Bearer ${accessToken}`;
//   }

//   return config;
// });

// // 🔹 RESPONSE INTERCEPTOR (handle 401)
// let isRefreshing = false;
// let failedQueue: any[] = [];

// const processQueue = (error: any, token: string | null = null) => {
//   failedQueue.forEach((prom) => {
//     if (error) prom.reject(error);
//     else prom.resolve(token);
//   });

//   failedQueue = [];
// };

// api.interceptors.response.use(
//   (response) => response,
//   async (error: AxiosError) => {
//     const originalRequest: any = error.config;

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       const { refreshToken, logout, setAuth } = useAuthStore.getState();

//       if (!refreshToken) {
//         logout();
//         return Promise.reject(error);
//       }

//       if (isRefreshing) {
//         return new Promise((resolve, reject) => {
//           failedQueue.push({
//             resolve,
//             reject,
//           });
//         })
//           .then((token) => {
//             originalRequest.headers.Authorization = `Bearer ${token}`;
//             return api(originalRequest);
//           })
//           .catch((err) => Promise.reject(err));
//       }

//       originalRequest._retry = true;
//       isRefreshing = true;

//       try {
//         const res = await axios.post(
//           "http://localhost:4000/api/v1/auth/refresh",
//           { refreshToken }
//         );

//         const newAccessToken = res.data.accessToken;

//         const { user } = useAuthStore.getState();

//         setAuth({
//           user,
//           accessToken: newAccessToken,
//           refreshToken,
//         });

//         processQueue(null, newAccessToken);

//         originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
//         return api(originalRequest);
//       } catch (err) {
//         processQueue(err, null);
//         logout();
//         return Promise.reject(err);
//       } finally {
//         isRefreshing = false;
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export { api };