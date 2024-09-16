import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, TextInput, Pressable, View } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { SocketContext } from "../../providers/socket-provider";
import { useDispatch, useSelector } from "react-redux";
import { ApplicationState } from "../../redux/reducer";
import { MessagesList } from "../messages-list";
import { Chats, User } from "../chats-list";
import { MessageService } from "../../services/messages.service";
import { AxiosResponse } from "axios";
import ReduxActions from "../../redux/actions";

export interface Message {
  to: string;
  from: User | {};
  content: string;
  type: string;
  createdAt: Date;
  chatId?: string;
  displayType?: "message" | "unread" | "date";
  count?: number;
}

export const TextArea = (props: { activeChat: Chats }) => {
  const { activeChat } = props;
  const loggedInUser = useSelector((state: ApplicationState) => state.user);
  const clientSocket = useContext(SocketContext);
  const [text, setText] = useState<string | null>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [scrollIndex, setScrollIndex] = useState<number>(-1);

  const newMessage = useSelector((state: ApplicationState) => state.newMessage);
  const dispatch = useDispatch();

  const insertUnreadAndDateSeperators = (msgs: Message[]) => {
    let reqInd = -1;
    const lastOpenedAt = new Date(
      activeChat.lastVisitedAt?.[loggedInUser?._id || ""]
    ).getTime();
    msgs?.forEach((msg, index) => {
      if (
        msg.to === loggedInUser?._id &&
        lastOpenedAt < new Date(msg.createdAt).getTime()
      ) {
        reqInd = index;
      }
    });
    if (reqInd !== -1 && activeChat.unreadMessages !== 0) {
      setScrollIndex(reqInd + 1);
      msgs.splice(reqInd + 1, 0, {
        _id: "unread",
        displayType: "unread",
        count: activeChat.unreadMessages,
      });
    }
    return msgs;
  };

  const sendMessage = () => {
    if (clientSocket && text) {
      const newMsg: Message = {
        chatId: activeChat._id,
        to: activeChat.user._id,
        from: loggedInUser || {},
        content: text,
        type: "text",
        createdAt: new Date(),
      };
      setMessages((prev) => insertUnreadAndDateSeperators([newMsg, ...prev]));
      clientSocket.emit("message", newMsg);
      setText("");
    }
  };

  const fetchMessages = () => {
    MessageService.getMessages(activeChat._id)
      .then((resp: AxiosResponse<Message[]>) => {
        setMessages(insertUnreadAndDateSeperators(resp.data));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchMessages();
  }, [activeChat._id]);

  // useEffect(() => {
  //   if (scrollIndex !== -1) {
  //     dispatch(ReduxActions.clearUnreadChatPill(activeChat._id));
  //   }
  // }, [scrollIndex]);

  useEffect(() => {
    if (newMessage && newMessage?.from?._id === activeChat.user._id) {
      setMessages((prev) => [newMessage, ...prev]);
    }
  }, [JSON.stringify(newMessage)]);

  return (
    <View style={{ flex: 1 }}>
      <View style={Styles.messageBox}>
        <MessagesList
          messages={messages}
          activeChat={activeChat}
          scrollToIndex={scrollIndex}
        />
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
