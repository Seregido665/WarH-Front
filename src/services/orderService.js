import apiClient from './baseService';

// Create an order (purchase or reservation)
export const createOrder = (orderData) => {
  // orderData: { productId, sellerId, type: 'purchase' | 'reservation', quantity: 1 }
  return apiClient.post('/orders', orderData);
};

// Get orders for the authenticated user (as buyer)
export const getMyOrders = () => {
  return apiClient.get('/orders');
};

// Get orders where user is the seller
export const getSellerOrders = () => {
  return apiClient.get('/orders/seller');
};

export default {
  createOrder,
  getMyOrders,
  getSellerOrders,
};
