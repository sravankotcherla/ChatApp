import { axiosNode } from "./base.service";

export const MessageService = {
  getMessages(chatId: string) {
    return axiosNode.get("/messages/getChatMsgs", {
      params: { chatId, skipNumber: 0 },
    });
  },
};
