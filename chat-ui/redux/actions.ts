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
  logOut: () => {
    return { type: ReduxActionTypes.LOG_OUT, initialState };
  },
};

export default ReduxActions;
