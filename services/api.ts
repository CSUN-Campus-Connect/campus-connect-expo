import axios from 'axios';

import { API_BASE_URL } from '../constants/config';
import { storage } from './storage';

const TOKEN_KEY = 'cc_auth_token';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  const token = await storage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      storage.removeItem(TOKEN_KEY);
    }
    return Promise.reject(error);
  }
);

export default api;
