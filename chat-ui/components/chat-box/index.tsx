import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { breakPoints } from "../../constants/screen-sizes";
import { Chats, ChatsList } from "../chats-list";
import { Message, TextArea } from "../text-area";

const { width } = Dimensions.get("window");

export const ChatBox = (props: { route: any; newMessage: Message | null }) => {
  const { newMessage, route } = props;
  const {
    activeChat,
    initialChats,
    searchText,
  }: { activeChat: Chats; initialChats: Chats[]; searchText: string } =
    route.params;

  const navigation = useNavigation();

  return (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
      }}
    >
      {width > breakPoints.md && (
        <View style={{ flex: 1 }}>
          <ChatsList
            searchString={searchText}
            chatsFromProps={initialChats}
            newMessage={newMessage}
          />
        </View>
      )}
      <View style={{ flex: 3, backgroundColor: "rgb(64, 71, 87)" }}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("home");
            }}
          >
            <Ionicons name="arrow-back-outline" size={24} color="white" />
          </TouchableOpacity>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
            }}
          >
            <FontAwesome5 name="user-circle" size={32} color="white" />
            <Text style={{ fontSize: 18, color: "white" }}>
              {activeChat.username || "User Name"}
            </Text>
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <TextArea activeChat={activeChat} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexBasis: 80,
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 16,
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: "rgb(82, 86, 98)",
  },
});
