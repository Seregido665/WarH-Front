import axios from "axios";
import { getToken, removeToken } from "../utils/auth";

const apiClient = axios.create({
  baseURL: "http://localhost:3000",
});

// Interceptor de request para añadir el JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Interceptor de response para manejar errores de autenticación
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      removeToken();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default apiClient;
