import React, { useEffect, useState } from "react";
import { Message } from "../text-area";
import { View, VirtualizedList, Text, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { ApplicationState } from "../../redux/reducer";
import { Chats } from "../chats-list";
import { ChatServices } from "../../services/chat.service";
import { ReduxActionTypes } from "../../redux/action-types";
import ReduxActions from "../../redux/actions";

export const MessagesList = (props: {
  messages: Message[];
  activeChat: Chats;
  scrollToIndex: number;
}) => {
  const { messages, activeChat, scrollToIndex } = props;

  const dispatch = useDispatch();

  const loggedInUser = useSelector((state: ApplicationState) => state.user);

  const updateLastVisitedTime = () => {
    if (loggedInUser) {
      const newVisitedTime = new Date().toISOString();
      dispatch(
        ReduxActions.updateAChat({
          _id: activeChat._id,
          lastVisitedAt: newVisitedTime,
        })
      );
      ChatServices.updateChat(activeChat._id, {
        [`lastVisitedAt.${loggedInUser._id}`]: newVisitedTime,
      })
        .then(() => {})
        .catch((err) => {
          console.log(err);
        });
    }
  };

  useEffect(() => {
    updateLastVisitedTime();
  }, [messages]);

  return (
    <VirtualizedList
      getItemCount={() => messages?.length || 0}
      initialNumToRender={messages?.length > 6 ? 6 : messages.length}
      getItem={(data, index) => messages[index]}
      renderItem={({ item }: { item: Message }) =>
        item.displayType === "unread" ? (
          <View style={Styles.seperator}>
            <Text
              style={{ color: "white", fontWeight: 500 }}
            >{`${item.count} Unread Messages`}</Text>
          </View>
        ) : (
          <View
            style={
              loggedInUser?._id === item.to
                ? Styles.receivedMsgs
                : Styles.sentMsgs
            }
          >
            <Text style={{ color: "white" }}>{item.content}</Text>
          </View>
        )
      }
      // initialScrollIndex={scrollToIndex}
      keyExtractor={(item: Message, index) => item._id || index}
      inverted={true}
    />
  );
};

const Styles = StyleSheet.create({
  msgs: {},
  seperator: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: "auto",
    backgroundColor: "rgba(83, 90, 109, 0.33)",
    borderRadius: 8,
  },
  sentMsgs: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginVertical: 4,
    marginLeft: "auto",
    marginRight: 16,
    backgroundColor: "rgb(114, 109, 254)",
    borderRadius: 24,
    minWidth: 50,
    justifyContent: "center",
    alignContent: "center",
  },
  receivedMsgs: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginVertical: 12,
    marginRight: "auto",
    marginLeft: 16,
    borderRadius: 24,
    backgroundColor: "rgba(83, 90, 109, 0.33)",
    minWidth: 50,
    justifyContent: "center",
    alignContent: "center",
  },
});
