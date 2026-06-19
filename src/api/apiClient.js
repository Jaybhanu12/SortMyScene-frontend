import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('sms_access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('sms_refresh_token');
        if (!refreshToken) throw new Error('No refresh token available');

        const res = await axios.post(`${apiClient.defaults.baseURL}/auth/refresh-token`, { refreshToken });
        
        const { accessToken, refreshToken: newRefreshToken } = res.data.data || res.data;

        localStorage.setItem('sms_access_token', accessToken);
        localStorage.setItem('sms_refresh_token', newRefreshToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
        
      } catch (refreshError) {
        localStorage.removeItem('sms_access_token');
        localStorage.removeItem('sms_refresh_token');
        localStorage.removeItem('sms_user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;