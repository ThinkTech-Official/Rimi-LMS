import axios, { AxiosError, type AxiosRequestConfig } from "axios";
import { API_BASE } from "./ulrs";

const adminApi = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  timeout: 300000, // 5 minutes for large file uploads
});

let isRefreshing = false;
type QueueItem = { resolve: (value?: any) => void; reject: (err: any) => void };
let failedQueue: QueueItem[] = [];

const processQueue = (error: any) => {
  failedQueue.forEach(({ resolve, reject }) => {
    error ? reject(error) : resolve(null);
  });
  failedQueue = [];
};

// Add request interceptor to handle file uploads properly
adminApi.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    if (config.headers) {
      delete config.headers["Content-Type"];
    }
  }
  return config;
});

adminApi.interceptors.response.use(
  (res) => res,
  (
    error: AxiosError & { config: AxiosRequestConfig & { _retry?: boolean } }
  ) => {
    const originalReq = error.config;
    const status = error.response?.status;

    // console.log("Axios interceptor - Request URL:", originalReq?.url)
    // console.log("Axios interceptor - Status:", status)
    // console.log("Axios interceptor - Current path:", window.location.pathname)

    // not handle 401 on login or refresh endpoints  let the components handle them
    if (
      originalReq?.url?.includes("/admin/auth/login") ||
      originalReq?.url?.includes("/admin/auth/refresh")
    ) {
      return Promise.reject(error);
    }

    // not handle 401s if on the login page
    if (window.location.pathname.includes("login")) {
      return Promise.reject(error);
    }

    if (
      status === 401 &&
      !originalReq._retry //&&
      // !originalReq.url?.includes("admin/auth/refresh")
    ) {
      originalReq._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => adminApi(originalReq));
      }

      isRefreshing = true;
      return new Promise(async (resolve, reject) => {
        try {
          const { data } = await axios.post(
            `${API_BASE}/admin/auth/refresh`,
            {},
            { withCredentials: true }
          );

          processQueue(null);
          resolve(adminApi(originalReq));
        } catch (err) {
          processQueue(err);
          // window.location.href = "/adminlogin";
          if (!window.location.pathname.includes("login")) {
            window.location.href = "/adminlogin";
          }
          reject(err);
        } finally {
          isRefreshing = false;
        }
      });
    }

    // if (status === 401 && originalReq._retry) {
    //   window.location.href = "/adminlogin";
    //   return Promise.reject(error);
    // }

    return Promise.reject(error);
  }
);

export default adminApi;
