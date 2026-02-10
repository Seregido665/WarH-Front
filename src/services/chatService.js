import apiClient from "./baseService";

export const createChat = (chatData) => {
  return apiClient.post("/chats", chatData);
};

export const getChat = (chatId) => {
  return apiClient.get(`/chats/${chatId}`);
};
