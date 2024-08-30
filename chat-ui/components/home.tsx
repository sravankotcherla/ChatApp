import React from "react";
import { SafeAreaView, View, StyleSheet, Dimensions } from "react-native";

import { ChatsList } from "./chats-list";
import { breakPoints } from "../constants/screen-sizes";
import { Message } from "./text-area";

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
    fontSize: 22,
    color: "black",
    flexDirection: "row",
  },
  chatBox: {
    backgroundColor: "grey",
    flex: 3,
  },
});

const Home = (props: { newMessage: Message | null }) => {
  const { newMessage } = props;
  return (
    <SafeAreaView style={styles.homeContainer}>
      <View style={{ flex: 1 }}>
        <ChatsList newMessage={newMessage} />
      </View>
      {width > breakPoints.md && <View style={styles.chatBox}></View>}
    </SafeAreaView>
  );
};

export default Home;
