import apiClient from './baseService';

export const getCategories = () => {
  return apiClient.get('/categories');
};

export const createCategory = (categoryData) => {
  // categoryData should be { name: string, slug?: string }
  const data = {
    name: categoryData.name,
    slug: categoryData.slug || categoryData.name.toLowerCase().replace(/\s+/g, '-'),
  };
  return apiClient.post('/categories', data);
};

export default {
  getCategories,
  createCategory,
};
