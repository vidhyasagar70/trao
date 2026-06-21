import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api',
  withCredentials: true, // Send HTTP-only cookies with every request
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 120000, // 2 min — AI trip generation (Gemini) can take 30–60 s
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      const requestUrl = (error.config as { url?: string })?.url ?? '';
      const path = window.location.pathname;

      // Skip redirect for the background session check — AuthContext handles it silently
      const isSessionCheck = requestUrl.includes('/auth/me');
      const isAuthPage = path === '/login' || path === '/register';

      if (!isSessionCheck && !isAuthPage) {
        // Token expired mid-session — boot the user to login
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
