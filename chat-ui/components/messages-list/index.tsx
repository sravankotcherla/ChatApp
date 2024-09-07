import React, { useState } from "react";
import { Message } from "../text-area";
import { View, VirtualizedList, Text, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { ApplicationState } from "../../redux/reducer";

export const MessagesList = (props: { messages: Message[] }) => {
  const { messages } = props;

  const loggedInUser = useSelector((state: ApplicationState) => state.user);

  return (
    <VirtualizedList
      getItemCount={() => messages?.length || 0}
      initialNumToRender={messages?.length > 6 ? 6 : messages.length}
      getItem={(data, index) => messages[index]}
      renderItem={({ item }: { item: Message }) => (
        <View
          style={
            loggedInUser?._id === item.to
              ? Styles.receivedMsgs
              : Styles.sentMsgs
          }
        >
          <Text style={{ color: "white" }}>{item.content}</Text>
        </View>
      )}
      keyExtractor={(item: Message, index) => item._id || index}
      inverted={true}
    />
  );
};

const Styles = StyleSheet.create({
  msgs: {},
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
