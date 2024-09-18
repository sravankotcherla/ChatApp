import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { MenuProvider } from "react-native-popup-menu";
import { useDispatch, useSelector } from "react-redux";
import { ChatBox } from "../components/chat-box";
import { Chats } from "../components/chats-list";
import Home from "../components/home";
import { SocketContext } from "../providers/socket-provider";
import ReduxActions from "../redux/actions";
import { ApplicationState } from "../redux/reducer";
import { AppState } from "react-native";
import { Profile } from "../components/profile";

export const Stack = createNativeStackNavigator();

export const AppStack = () => {
  const clientSocket = useContext(SocketContext);
  const dispatch = useDispatch();

  const loggedInUser = useSelector((state: ApplicationState) => state.user);

  // const [appState, setAppState] = useState(AppState.currentState);

  const receiveMessages = () => {
    clientSocket?.on("message", (messageInfo) => {
      if (messageInfo.to === loggedInUser?._id) {
        dispatch(ReduxActions.setNewMessage(messageInfo));
        dispatch(ReduxActions.updateChatsWithNewMessage(messageInfo));
      }
    });
  };
  useEffect(() => {
    receiveMessages();
  }, []);

  // useEffect(() => {
  //   const subscription = AppState.addEventListener(
  //     "change",
  //     async (nextAppState) => {
  //       if (appState.match(/active/) && nextAppState === "background") {
  //         dispatch(ReduxActions.setNewActiveChat(null));
  //       }
  //     }
  //   );
  // }, []);

  return (
    <MenuProvider>
      <NavigationContainer independent={true}>
        <Stack.Navigator initialRouteName="home">
          <Stack.Screen
            name="home"
            options={{ headerShown: false }}
            component={Home}
          ></Stack.Screen>
          <Stack.Screen
            name="chats"
            component={ChatBox}
            options={() => ({
              headerShown: false,
            })}
          ></Stack.Screen>
          <Stack.Screen
            name="profile"
            options={{ headerShown: false }}
            component={Profile}
          ></Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </MenuProvider>
  );
};
