import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, TextInput, Pressable, View } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { SocketContext } from "../../providers/socket-provider";
import { useSelector } from "react-redux";
import { ApplicationState } from "../../redux/reducer";
import { MessagesList } from "../messages-list";
import { Chats, User } from "../chats-list";
import { MessageService } from "../../services/messages.service";
import { AxiosResponse } from "axios";

export interface Message {
  to: string;
  from: User | {};
  content: string;
  type: string;
  createdAt: Date;
  chatId?: string;
}

export const TextArea = (props: { activeChat: Chats }) => {
  const { activeChat } = props;
  const loggedInUser = useSelector((state: ApplicationState) => state.user);
  const clientSocket = useContext(SocketContext);
  const [text, setText] = useState<string | null>("");
  const [messages, setMessages] = useState<Message[]>([]);

  const sendMessage = () => {
    if (clientSocket && text) {
      console.log("sending message");
      const newMsg: Message = {
        chatId: activeChat._id,
        to: activeChat.user._id,
        from: loggedInUser || {},
        content: text,
        type: "text",
        createdAt: new Date(),
      };
      setMessages((prev) => [newMsg, ...prev]);
      clientSocket.emit("message", newMsg);
    }
  };

  const fetchMessages = () => {
    MessageService.getMessages(activeChat._id)
      .then((resp: AxiosResponse<Message[]>) => {
        setMessages((prev) => [...resp.data, ...prev]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchMessages();
  }, [activeChat._id]);

  return (
    <View style={{ flex: 1 }}>
      <View style={Styles.messageBox}>
        <MessagesList messages={messages} />
      </View>
      <View style={Styles.textBox}>
        <TextInput
          value={text}
          placeholder="Send a message..."
          onChangeText={setText}
          autoFocus={true}
          style={Styles.textInp}
        />
        <Pressable
          onPress={() => {
            sendMessage();
          }}
        >
          <Feather name="send" size={24} color="white" />
        </Pressable>
      </View>
    </View>
  );
};

const Styles = StyleSheet.create({
  messageBox: {
    flex: 1,
  },
  textBox: {
    flexDirection: "row",
    alignItems: "center",
    flexBasis: 70,
    marginHorizontal: 20,
  },
  textInp: {
    flex: 1,
    color: "white",
    height: 40,
    marginRight: 16,
    paddingHorizontal: 24,
    paddingVertical: 6,
    backgroundColor: "rgba(83, 90, 109, 0.33)",
    borderRadius: 25,
    outlineStyle: "none",
  },
});
