import React, { useContext, useEffect, useState } from "react";
import { ChatBox } from "../components/chat-box";
import Home from "../components/home";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MenuProvider } from "react-native-popup-menu";
import { SocketContext } from "../providers/socket-provider";
import { Message } from "../components/text-area";

export const Stack = createNativeStackNavigator();

export const AppStack = () => {
  const clientSocket = useContext(SocketContext);

  const [newMessage, setNewMessage] = useState<Message | null>(null);

  const receiveMessages = () => {
    clientSocket?.on("message", (messageInfo) => {
      console.log("received message", messageInfo);
      setNewMessage(messageInfo);
    });
  };

  useEffect(() => {
    receiveMessages();
  }, []);
  return (
    <MenuProvider>
      <NavigationContainer independent={true}>
        <Stack.Navigator initialRouteName="home">
          <Stack.Screen name="home" options={{ headerShown: false }}>
            {() => <Home newMessage={newMessage} />}
          </Stack.Screen>
          <Stack.Screen
            name="chats"
            component={({ route }) => (
              <ChatBox newMessage={newMessage} route={route}></ChatBox>
            )}
            options={() => ({
              headerShown: false,
            })}
          ></Stack.Screen>
          {/* <Stack.Screen
            name="addChat"
            component={AddChats}
            options={() => ({
              headerShown: false,
            })}
          ></Stack.Screen> */}
        </Stack.Navigator>
      </NavigationContainer>
    </MenuProvider>
  );
};
