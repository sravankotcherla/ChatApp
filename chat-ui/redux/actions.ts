import { Chats } from "../components/chats-list";
import { Message } from "../components/text-area";
import { ReduxActionTypes } from "./action-types";
import { initialState } from "./reducer";

const ReduxActions = {
  setLoggedIn: (data: boolean) => {
    return { type: ReduxActionTypes.SET_LOGGED_IN, data };
  },
  setUserInfo: (data: { [key: string]: string } | null) => {
    return { type: ReduxActionTypes.SET_USER_INFO, data };
  },
  setSocketConnected: (data: boolean) => {
    return { type: ReduxActionTypes.SET_SOCKET_CONNECTED, data };
  },
  setChats(data: Chats[]) {
    return { type: ReduxActionTypes.SET_CHATS, data };
  },
  updateChatsWithNewMessage: (data: Chats[]) => {
    return { type: ReduxActionTypes.UPDATE_CHATS, data };
  },
  updateAChat: (data) => {
    return { type: ReduxActionTypes.UPDATE_A_CHAT, data };
  },
  setNewMessage(data: Message) {
    return { type: ReduxActionTypes.SET_NEW_MESSAGE, data };
  },
  sentNewMessage(data: Message) {
    return { type: ReduxActionTypes.SEND_NEW_MESSAGE, data };
  },
  setNewActiveChat(data: string) {
    return { type: ReduxActionTypes.SET_NEW_ACTIVE_CHAT, data };
  },
  clearUnreadChatPill(data: string) {
    return { type: ReduxActionTypes.CLEAR_UNREAD_COUNT_CHAT, data };
  },
  logOut: () => {
    return { type: ReduxActionTypes.LOG_OUT, initialState };
  },
};

export default ReduxActions;
