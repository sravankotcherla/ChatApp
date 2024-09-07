import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { FontAwesome5 } from "@expo/vector-icons";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import { useSelector } from "react-redux";
import { useDebounce } from "../../custom-hooks/debounce-hook";
import { ApplicationState } from "../../redux/reducer";
import { UserServices } from "../../services/user.service";
import { AppHeader } from "../app-header";
import { Message } from "../text-area";
import { ChatServices } from "../../services/chat.service";

export interface Chats {
  _id: string;
  users?: string[];
  user: {
    _id: string;
    username: string;
    email: string;
    profileImg: string;
    id: string;
  };
  lastMessage: string;
  lastMessageDate: string;
  unreadMessages: number;
}

export interface User {
  _id: string;
  id?: string;
  username: string;
  email: string;
  profileImg?: string;
  chatInfo?: {
    _id: string;
  };
}
export const ChatsList = (props: {
  newMessage: Message | null;
  chatsFromProps?: any;
}) => {
  const { chatsFromProps, newMessage } = props;

  const loggedInUser = useSelector((state: ApplicationState) => state.user);

  const navigation = useNavigation();
  const [searchText, setSearchText] = useState<string>("");
  const [chats, setChats] = useState<Chats[]>(chatsFromProps || []);
  const [searchUsers, setSearchUsers] = useState<Chats[] | User[]>([]);

  const debouncedSearchText = useDebounce(searchText, 500);

  function formatDateString(dateString) {
    const date = new Date(dateString);

    // Extract day, month, and year
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);

    return `${day}/${month}/${year}`;
  }

  const getChatsList = () => {
    if ((debouncedSearchText as string)?.length != 0) {
      UserServices.searchUsers({ searchText: debouncedSearchText as string })
        .then((resp) => {
          setSearchUsers(resp.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      ChatServices.getChats()
        .then((resp) => {
          setChats(resp.data || []);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  function updateChatsWithNewMessage(messageInfo: Message) {
    if (messageInfo.to === loggedInUser?._id) {
      console.log(setChats);
      console.log("prevChats", chats);
      let senderIndexFromChats = -1;
      const newChats = chats.map((chatItem) => chatItem);
      newChats?.forEach((item: Chats, index: number) => {
        if (
          senderIndexFromChats === -1 &&
          messageInfo?.from?._id === item.user._id
        ) {
          senderIndexFromChats = index;
        }
      });
      if (senderIndexFromChats === -1) {
        newChats.splice(senderIndexFromChats, 1);
        const newChat = {
          _id: messageInfo?.chatId,
          user: {
            _id: messageInfo?.from?._id,
            username: messageInfo?.from?.username,
            email: messageInfo?.from?.email || "",
            profileImg: messageInfo?.from?.profileImg || "",
          },
          lastMessage: messageInfo?.content,
          lastMessageDate: messageInfo?.createdAt,
          unreadMessages: 1,
        };
        newChats.unshift(newChat);
      } else {
        newChats[senderIndexFromChats].lastMessage = messageInfo?.content;
        newChats[senderIndexFromChats].unreadMessages++;
      }
      console.log("newChats", newChats);
      setChats(newChats);
    }
  }

  useEffect(() => {
    if (newMessage) updateChatsWithNewMessage(newMessage);
  }, [newMessage]);

  useEffect(() => {
    getChatsList();
  }, [debouncedSearchText]);

  console.log("chats", chats);
  console.log("searchUsers", searchUsers);

  const searchResultsFromChats = searchUsers.filter(
    (userItem) => (userItem as User).chatInfo?._id
  );
  const searchResultsFromNewUsers = searchUsers.filter(
    (userItem) => !(userItem as User).chatInfo?._id
  );

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.golbalHeader}>
        <AppHeader />
      </View>
      <View style={{ flex: 10 }}>
        <View style={styles.listWrapper}>
          <View style={styles.listHeader}>
            <View style={styles.textInputWrapper}>
              <EvilIcons name="search" size={24} color="white" />
              <TextInput
                value={searchText}
                placeholder={"Search Chats"}
                onChange={(e) => {
                  setSearchText(e.target.value);
                }}
                style={styles.textInput}
              />
            </View>
          </View>

          <View style={{ paddingHorizontal: 10 }}>
            <FlatList
              data={searchText?.length ? searchResultsFromChats : chats}
              disableScrollViewPanResponder={true}
              renderItem={({ item }) => {
                return (
                  <TouchableOpacity
                    style={styles.listItem}
                    onPress={() => {
                      navigation.navigate("chats", {
                        activeChat: item,
                      });
                      if (searchText?.length) {
                        setSearchText("");
                        setSearchUsers([]);
                      }
                    }}
                  >
                    {item.img?.length ? (
                      <Text>Got it </Text>
                    ) : (
                      <FontAwesome5
                        name="user-circle"
                        size={32}
                        color="white"
                      />
                    )}
                    <Text style={{ color: "white" }}>
                      {(item as Chats).user
                        ? (item as Chats).user.username
                        : (item as User).username}
                    </Text>
                    {
                      <View style={styles.chatMeta}>
                        <Text style={{ color: "white", fontSize: 10 }}>
                          {formatDateString((item as Chats).lastMessageDate)}
                        </Text>
                        {(item as Chats).unreadMessages !== 0 && (
                          <View>
                            <Text style={{ color: "white" }}>
                              {(item as Chats).unreadMessages}
                            </Text>
                          </View>
                        )}
                      </View>
                    }
                  </TouchableOpacity>
                );
              }}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item) => item._id}
              ListEmptyComponent={
                searchText?.length ? (
                  <View
                    style={{
                      display: "flex",
                      flex: 1,
                      width: "100%",
                      paddingVertical: 32,
                      alignItems: "center",
                      flexDirection: "row",
                      justifyContent: "center",
                    }}
                  >
                    <Text>No Such Chats Available</Text>
                  </View>
                ) : null
              }
              ListHeaderComponent={
                searchText?.length ? (
                  <View>
                    <Text style={{ color: "white" }}>Chats</Text>
                  </View>
                ) : null
              }
              ListHeaderComponentStyle={{
                display: "flex",
                flex: 1,
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "flex-start",
                marginHorizontal: 10,
                marginVertical: 20,
              }}
            />
            {searchText?.length ? (
              <FlatList
                data={searchResultsFromNewUsers}
                disableScrollViewPanResponder={true}
                renderItem={({ item }) => {
                  return (
                    <TouchableOpacity
                      style={styles.listItem}
                      onPress={() => {
                        ChatServices.createChat({
                          users: [
                            loggedInUser?._id || "",
                            (item as User)._id || "",
                          ],
                        })
                          .then((resp) => {
                            navigation.navigate("chats", {
                              activeChat: {
                                ...resp.data,
                                user: item,
                              },
                            });
                            if (searchText?.length) {
                              setSearchText("");
                              setSearchUsers([]);
                            }
                          })
                          .catch((err) => {
                            console.log(err);
                          });
                      }}
                    >
                      {item.img?.length ? (
                        <Text>Got it </Text>
                      ) : (
                        <FontAwesome5
                          name="user-circle"
                          size={32}
                          color="white"
                        />
                      )}
                      <Text style={{ color: "white" }}>
                        {(item as User).username}
                      </Text>
                    </TouchableOpacity>
                  );
                }}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item) => item._id}
                ListEmptyComponent={
                  searchText?.length ? (
                    <View
                      style={{
                        display: "flex",
                        flex: 1,
                        width: "100%",
                        paddingVertical: 32,
                        alignItems: "center",
                        flexDirection: "row",
                        justifyContent: "center",
                      }}
                    >
                      <Text>No Such Users Available</Text>
                    </View>
                  ) : null
                }
                ListHeaderComponent={
                  searchText?.length ? (
                    <View>
                      <Text style={{ color: "white" }}>Other Users</Text>
                    </View>
                  ) : null
                }
                ListHeaderComponentStyle={{
                  display: "flex",
                  flex: 1,
                  alignItems: "center",
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  marginHorizontal: 10,
                  marginVertical: 20,
                }}
              />
            ) : null}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  golbalHeader: {
    color: "black",
    flexBasis: 80,
    backgroundColor: "black",
  },
  listWrapper: {
    flex: 1,
    backgroundColor: "rgb(64, 71, 87)",
    borderRightColor: "rgb(82, 86, 98)",
    borderRightWidth: 2,
  },
  listHeader: {
    flexBasis: 40,
    display: "flex",
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "space-between",
    marginHorizontal: 10,
    marginBottom: 10,
    marginTop: 16,
    gap: 4,
  },
  listItem: {
    backgroundColor: "rgba(83, 90, 109, 0.33)",
    borderRadius: 12,

    display: "flex",
    flexDirection: "row",
    height: 60,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 16,
    fontSize: 20,
    color: "white",
  },

  textInputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    height: 40,
    paddingHorizontal: 10,
    backgroundColor: "rgba(83, 90, 109, 0.33)",
    borderColor: "rgba(83, 90, 109, 0.33)",
    borderWidth: 2,
    borderRadius: 24,
  },
  textInput: {
    outlineStyle: "none",
    flex: 1,
    height: 40,
    color: "white",
    marginHorizontal: 10,
  },
  chatMeta: {
    marginLeft: "auto",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
  },
  displayHide: {
    display: "none",
  },
});
