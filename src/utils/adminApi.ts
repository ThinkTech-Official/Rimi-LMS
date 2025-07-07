import axios, { AxiosError, type AxiosRequestConfig } from 'axios';

// this instance will hit /api/admin/* and send your admin cookies
const adminApi = axios.create({
  baseURL: '/admin',
  withCredentials: true,
});

let isRefreshing = false;
type QueueItem = { resolve: (value?: any) => void; reject: (err: any) => void };
let failedQueue: QueueItem[] = [];

// simple queue processor
const processQueue = (error: any) => {
  failedQueue.forEach(({ resolve, reject }) => {
    error ? reject(error) : resolve(null);
  });
  failedQueue = [];
};

adminApi.interceptors.response.use(
  res => res,
  (error: AxiosError & { config: AxiosRequestConfig & { _retry?: boolean } }) => {
    const originalReq = error.config;
    if (error.response?.status === 401 && !originalReq._retry) {
      originalReq._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => adminApi(originalReq));
      }

      isRefreshing = true;
      return new Promise(async (resolve, reject) => {
        try {
          await adminApi.post('/auth/refresh');
          processQueue(null);
          resolve(adminApi(originalReq));
        } catch (err) {
          processQueue(err);
          reject(err);
        } finally {
          isRefreshing = false;
        }
      });
    }

    return Promise.reject(error);
  },
);

export default adminApi;
