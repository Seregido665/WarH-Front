import apiClient from './baseService';

export const getProducts = (params) => {
  return apiClient.get('/products', { params });
};

export const getUserProducts = () => {
  // Get products created by the authenticated user
  return apiClient.get('/products/seller/mine');
};

export const getProductById = (id) => {
  return apiClient.get(`/products/${id}`);
};

export const createProduct = (formData) => {
  // formData is expected to be a FormData instance when sending files
  return apiClient.post('/products', formData);
};

export const deleteProduct = (id) => {
  return apiClient.delete(`/products/${id}`);
};

export const updateProductStatus = (id, status) => {
  return apiClient.patch(`/products/${id}/status`, { status });
};

export const updateProduct = (id, formData) => {
  return apiClient.patch(`/products/${id}`, formData);
};

export default {
  getProducts,
  getUserProducts,
  getProductById,
  createProduct,
  deleteProduct,
  updateProductStatus,
};
