// src/axiosInstance.ts
import axios from 'axios';

const API_URL = 'http://localhost:3000';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use((config) => {
  const sessionEmail = localStorage.getItem('sessionEmail');
  const authToken = localStorage.getItem('authToken');
  const sessionPermissions = localStorage.getItem('sessionPermissions');


  if (sessionEmail) {
    config.headers['Session-Email'] = sessionEmail;
  }

  if (authToken) {
    config.headers['Authorization'] = `Bearer ${authToken}`;
  }

  if (sessionPermissions) {
    config.headers['Session-Permissions'] = sessionPermissions;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

export default axiosInstance;
