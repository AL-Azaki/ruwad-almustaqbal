import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  timeout: 45000, // 45 seconds timeout (to handle slow DB connections)
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request Interceptor: Attach token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Response Interceptor: Handle 401 Unauthorized globally
api.interceptors.response.use((response) => response, (error) => {
  if (error.response && error.response.status === 401) {
    // Only redirect if we are in the admin panel and not already on the login page
    if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
      localStorage.removeItem('admin_token');
      window.location.href = '/admin/login';
    }
  }
  return Promise.reject(error);
});

export default api;
