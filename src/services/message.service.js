import apiClient from "./baseService";

export const sendNewMessage = (messageData) => {
  return apiClient.post("/messages", messageData);
};
