import apiClient from "./baseService";

export const registerUser = (userData) => {
  return apiClient.post("/register", userData);
};

export const loginUser = (userData) => {
  return apiClient.post("/login", userData);
};

// Ahora getUserProfile usa el token para obtener el perfil del usuario autenticado
export const getUserProfile = () => {
  return apiClient.get("/profile");
};

// Mantener función legacy para obtener usuario por ID si es necesario
export const getUserById = (userId) => {
  return apiClient.get(`/users/${userId}`);
};

export const getAllUsers = () => {
  return apiClient.get("/users");
};

export const updateProfile = (formData) => {
  return apiClient.patch("/profile", formData);
};
