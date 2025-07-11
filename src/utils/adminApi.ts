import axios, { AxiosError, type AxiosRequestConfig } from 'axios';
import { API_BASE } from './ulrs';

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
    if (error.response?.status === 401 && !originalReq._retry && !originalReq.url?.includes('admin/auth/refresh')) {
      originalReq._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => adminApi(originalReq));
      }

      isRefreshing = true;
      return new Promise(async (resolve, reject) => {
        try {
          // await adminApi.post(`${API_BASE}/admin/auth/refresh`);
           //  use raw axios here so you don't re‐intercept
          const { data } = await axios.post(
            `${API_BASE}/admin/auth/refresh`,
            {},
            { withCredentials: true }
          );

          processQueue(null);
          resolve(adminApi(originalReq));
        } catch (err) {
          processQueue(err);
          // both tokens are now invalid ==> redirect to login
          window.location.href = '/adminlogin';

          reject(err);
        } finally {
          isRefreshing = false;
        }
      });
    }

     //  If we get 401 *after* a retry, it means refresh itself failed
    // if (error.response?.status === 401 && originalReq._retry) {
    //   window.location.href = '/adminlogin';
     // if we get here, either it was a /auth/refresh or a second 401  
    window.location.href = '/adminlogin';
    return Promise.reject(error);

      // we still reject so the original caller can see the error if needed
    // }


    // return Promise.reject(error);
  },
);

export default adminApi;
