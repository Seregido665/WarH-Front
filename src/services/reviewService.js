import apiClient from './baseService';

export const getReviewsByProduct = (productId) => {
  return apiClient.get(`/products/${productId}/reviews`);
};

export const createReview = (payload) => {
  // payload: { productId, comment }
  return apiClient.post('/reviews', payload);
};

export const deleteReview = (id) => {
  return apiClient.delete(`/reviews/${id}`);
};

export default {
  getReviewsByProduct,
  createReview,
  deleteReview,
};
