import { axiosNode } from "./base.service";

export const ChatServices = {
  getChats() {
    return axiosNode.get("/chats/");
  },
  createChat(chatBody: { users: string[]; visitedAt: Date }) {
    return axiosNode.post("/chats/create", chatBody);
  },
  updateChat(chatId: string, updatedBody: any) {
    return axiosNode.post("/chats/update", { chatId, updatedBody });
  },
};
