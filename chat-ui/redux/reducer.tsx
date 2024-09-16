import { Chats } from "../components/chats-list";
import { Message } from "../components/text-area";
import { setAsyncStorageData } from "../helpers/common-helpers";
import { ChatServices } from "../services/chat.service";
import { ReduxActionTypes } from "./action-types";

export interface ApplicationState {
  loggedIn: boolean;
  socketConnected: boolean;
  user: {
    [key: string]: string;
  } | null;
  chats: Chats[] | [];
  newMessage: Message | null;
  activeChatId: string | null;
}

export const initialState: ApplicationState = {
  loggedIn: false,
  socketConnected: false,
  user: null,
  chats: [],
  newMessage: null,
  activeChatId: null,
};
export const AppReducer = (
  state: ApplicationState = initialState,
  action: {
    type: string;
    data: any;
  }
) => {
  switch (action.type) {
    case ReduxActionTypes.SET_LOGGED_IN:
      return { ...state, loggedIn: action.data };
    case ReduxActionTypes.SET_USER_INFO:
      return { ...state, user: action.data };
    case ReduxActionTypes.SET_SOCKET_CONNECTED:
      return { ...state, socketConnected: action.data };
    case ReduxActionTypes.LOG_OUT:
      return initialState;
    case ReduxActionTypes.SET_CHATS:
      return { ...state, chats: action.data };

    case ReduxActionTypes.UPDATE_A_CHAT: {
      const newChatBody = action.data;
      const newChats = state.chats.map((item) => ({
        ...item,
        lastVisitedAt: { ...item.lastVisitedAt },
      }));
      newChats.forEach((chatItem) => {
        if (chatItem._id === newChatBody._id && state.user) {
          chatItem.lastVisitedAt[state.user?._id] = action.data.lastVisitedAt;
          chatItem.unreadMessages = 0;
        }
      });
      return { ...state, chats: newChats };
    }
    case ReduxActionTypes.UPDATE_CHATS: {
      let senderIndexFromChats = -1;
      let newChats = state.chats.map((chatItem) => ({ ...chatItem }));
      newChats?.forEach((item: Chats, index: number) => {
        if (
          senderIndexFromChats === -1 &&
          action.data?.from?._id === item.user._id
        ) {
          senderIndexFromChats = index;
        }
      });
      let newChat;
      if (senderIndexFromChats === -1) {
        newChat = {
          _id: action.data?.chatId,
          user: {
            _id: action.data?.from?._id,
            username: action.data?.from?.username,
            email: action.data?.from?.email || "",
            profileImg: action.data?.from?.profileImg || "",
            id: action.data?.from?.id || "",
          },
          lastMessage: action.data?.content,
          lastMessageDate: action.data?.createdAt,
          unreadMessages: 1,
        };
      } else {
        newChat = newChats[senderIndexFromChats];
        newChat.lastMessage = action.data?.content;
        if (state.activeChatId !== newChat._id) newChat.unreadMessages++;
        newChats.splice(senderIndexFromChats, 1);
      }
      newChats = [newChat, ...newChats];
      return { ...state, chats: newChats };
    }
    case ReduxActionTypes.SEND_NEW_MESSAGE: {
      const sendMessageInfo: Message = action.data;
      const newChats = state.chats.map((item) => ({ ...item }));
      let reqchat;
      let reqChatInd = -1;
      newChats.forEach((item, index) => {
        if (item._id === sendMessageInfo.chatId) {
          reqchat = item;
          reqChatInd = index;
        }
      });
      if (reqchat && reqChatInd !== -1) {
        reqchat.lastMessage = sendMessageInfo.content;
        reqchat.lastMessageDate = sendMessageInfo.createdAt.toISOString();
        return {
          ...state,
          chats: [reqchat, ...newChats.splice(reqChatInd, 1)],
        };
      }
      break;
    }
    case ReduxActionTypes.SET_NEW_ACTIVE_CHAT: {
      return { ...state, activeChatId: action.data };
    }
    case ReduxActionTypes.CLEAR_UNREAD_COUNT_CHAT: {
      const newChats = state.chats.map((item) => ({ ...item }));
      const reqChat = newChats.find((item) => item._id === action.data);
      if (reqChat) reqChat.unreadMessages = 0;
      return { ...state, chats: newChats };
    }
    case ReduxActionTypes.SET_NEW_MESSAGE:
      return { ...state, newMessage: action.data };
    default:
      return state;
  }
};
