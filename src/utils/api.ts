






import axios, { AxiosError, type AxiosRequestConfig } from 'axios';
import { API_BASE } from './ulrs';

const api = axios.create({
  baseURL: API_BASE,     
  withCredentials: true, 
});

let isRefreshing = false;
type QueueItem = { resolve: (v?: any) => void; reject: (e: any) => void };
let failedQueue: QueueItem[] = [];

const processQueue = (error: any, tokenRefreshed = false) => {
  failedQueue.forEach(({ resolve, reject }) => {
    tokenRefreshed ? resolve(null) : reject(error);
  });
  failedQueue = [];
};


const isAuthEndpoint = (url = '') =>
  /\/client\/auth\/(login|signup|refresh)/.test(url);

api.interceptors.response.use(
  resp => resp,
  (error: AxiosError & { config?: AxiosRequestConfig & { _retry?: boolean } }) => {
    const originalReq = error.config!;
    // const url  = originalReq.url || '';
    const status = error.response?.status;
    const url = originalReq?.url || '';

    //  On first 401 of any request except /client/auth/refresh, try to renew
    if (
      status === 401 &&
      !originalReq._retry &&
      // url.startsWith('/client/') &&
      // !originalReq.url?.endsWith('/client/auth/refresh'
      !isAuthEndpoint(url)
    ) {
      originalReq._retry = true;

      if (isRefreshing) {
        // queue up all other requests while we refresh
        return new Promise((res, rej) => {
          failedQueue.push({ resolve: res, reject: rej });
        }).then(() => api(originalReq));
      }

      isRefreshing = true;
      return new Promise(async (resolve, reject) => {
        try {
          //  Use raw axios so this call skips our interceptors
          await axios.post(
            `${API_BASE}/client/auth/refresh`,
            {},
            { withCredentials: true }
          );

          //  Drain the queue, retry original requests
          processQueue(null, true);
          resolve(api(originalReq));
        } catch (refreshError) {
          processQueue(refreshError, false);

          //  Only redirect if we're not already on the login page
          if (window.location.pathname !== '/') {
            window.location.href = '/';
          }

          reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      });
    }

    //  All other errors  just pass them through
    return Promise.reject(error);
  }
);

export default api;
