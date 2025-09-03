





import axios, { AxiosError, type AxiosRequestConfig } from "axios";
import { API_BASE } from "./ulrs";

const adminApi = axios.create({
  baseURL: API_BASE, // Use your API base, not "/"
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
      delete config.headers['Content-Type'];
    }
  }
  return config;
});

adminApi.interceptors.response.use(
  (res) => res,
  (error: AxiosError & { config: AxiosRequestConfig & { _retry?: boolean } }) => {
    const originalReq = error.config;
    const status = error.response?.status;
    
    if (
      status === 401 &&
      !originalReq._retry &&
      !originalReq.url?.includes("admin/auth/refresh")
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
          window.location.href = "/adminlogin";
          reject(err);
        } finally {
          isRefreshing = false;
        }
      });
    }

    if (status === 401 && originalReq._retry) {
      window.location.href = "/adminlogin";
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default adminApi;