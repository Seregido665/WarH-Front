import apiClient from "./baseService";

export const getBooks = () => {
  return apiClient.get("/books");
};

export const deleteBook = (id) => {
  return apiClient.delete(`/books/${id}`);
};

export const getBookById = (id) => {
  return apiClient.get(`/books/${id}`);
};

export const createBook = (bookData) => {
  return apiClient.post("/books", bookData);
};
