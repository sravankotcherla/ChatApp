import { axiosNode } from "./base.service";

export const ChatServices = {
  getChats() {
    return axiosNode.get("/chats/");
  },
  createChat(chatBody: { users: string[] }) {
    return axiosNode.post("/chats/create", chatBody);
  },
};
