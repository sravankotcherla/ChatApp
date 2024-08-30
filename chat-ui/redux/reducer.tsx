import { ReduxActionTypes } from "./action-types";

export interface ApplicationState {
  loggedIn: boolean;
  socketConnected: boolean;
  user: {
    [key: string]: string;
  } | null;
}

export const initialState: ApplicationState = {
  loggedIn: false,
  socketConnected: false,
  user: null,
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
    default:
      return state;
  }
};
