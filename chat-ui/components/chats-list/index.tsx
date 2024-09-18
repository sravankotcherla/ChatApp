import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { FontAwesome5 } from "@expo/vector-icons";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import { useDispatch, useSelector } from "react-redux";
import { useDebounce } from "../../custom-hooks/debounce-hook";
import ReduxActions from "../../redux/actions";
import { ApplicationState } from "../../redux/reducer";
import { ChatServices } from "../../services/chat.service";
import { UserServices } from "../../services/user.service";
import { AppHeader } from "../app-header";

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
  lastVisitedAt: {
    [key: string]: Date;
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
export const ChatsList = () => {
  const loggedInUser = useSelector((state: ApplicationState) => state.user);

  const navigation = useNavigation();
  const [searchText, setSearchText] = useState<string>("");
  const [chats, setChats] = useState<Chats[]>([]);
  const [searchUsers, setSearchUsers] = useState<Chats[] | User[]>([]);

  const chatsFromRedux = useSelector((state: ApplicationState) => state.chats);

  const debouncedSearchText = useDebounce(searchText, 500);
  const dispatch = useDispatch();

  function formatDateString(dateString) {
    const date = new Date(dateString);

    // Extract day, month, and year
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);

    return `${day}/${month}/${year}`;
  }

  const getChatsList = async () => {
    ChatServices.getChats()
      .then(async (resp) => {
        dispatch(ReduxActions.setChats(resp.data));
        setChats(resp.data || []);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getSearchResults = () => {
    UserServices.searchUsers({ searchText: debouncedSearchText as string })
      .then((resp) => {
        setSearchUsers(resp.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    setChats(chatsFromRedux);
  }, [chatsFromRedux]);

  useEffect(() => {
    if (!chatsFromRedux?.length) {
      getChatsList();
    }
  }, []);

  useEffect(() => {
    if ((debouncedSearchText as string)?.length != 0) {
      getSearchResults();
    }
  }, [debouncedSearchText]);

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
                onChangeText={setSearchText}
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
                      dispatch(ReduxActions.setNewActiveChat(item._id));
                      navigation.navigate("chats", {
                        activeChat: item,
                      });
                      if (searchText?.length) {
                        setSearchText("");
                        setSearchUsers([]);
                      }
                    }}
                  >
                    {(item as Chats).user?.profileImg?.length ? (
                      <Image
                        source={{ uri: (item as Chats).user?.profileImg }}
                        style={{ width: 32, height: 32, borderRadius: 16 }}
                      />
                    ) : (
                      <FontAwesome5
                        name="user-circle"
                        size={32}
                        color="white"
                      />
                    )}
                    <View>
                      <Text
                        style={{
                          color: "white",
                          fontSize: 18,
                          marginBottom: 4,
                        }}
                      >
                        {(item as Chats).user
                          ? (item as Chats).user.username
                          : (item as User).username}
                      </Text>
                      {(item as Chats).lastMessage?.length ? (
                        <Text style={{ color: "lightGrey" }}>
                          {(item as Chats).lastMessage?.length > 13
                            ? (item as Chats).lastMessage.slice(0, 13) + "..."
                            : (item as Chats).lastMessage}
                        </Text>
                      ) : null}
                    </View>
                    {
                      <View style={styles.chatMeta}>
                        <Text style={{ color: "white", fontSize: 12 }}>
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
                          visitedAt: new Date(),
                        })
                          .then((resp) => {
                            dispatch(
                              ReduxActions.setNewActiveChat(resp.data._id)
                            );
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
                      {(item as User).profileImg?.length ? (
                        <Image
                          source={{ uri: (item as User).profileImg }}
                          style={{ width: 32, height: 32, borderRadius: 16 }}
                        />
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
    display: "flex",
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "space-between",
    marginHorizontal: 10,
    marginBottom: 12,
    marginTop: 16,
    gap: 4,
  },
  listItem: {
    backgroundColor: "rgba(83, 90, 109, 0.33)",
    borderRadius: 12,
    marginBottom: 12,
    display: "flex",
    flexDirection: "row",
    height: 80,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 16,
    fontSize: 28,
    color: "white",
    overflow: "hidden",
  },

  textInputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    height: 60,
    paddingHorizontal: 10,
    backgroundColor: "rgba(83, 90, 109, 0.33)",
    borderColor: "rgba(83, 90, 109, 0.33)",
    borderWidth: 2,
    borderRadius: 24,
  },
  textInput: {
    outlineStyle: "none",
    flex: 1,
    height: 80,
    color: "white",
    marginHorizontal: 12,
  },
  chatMeta: {
    marginLeft: "auto",
    flexDirection: "column",
    justifyContent: "space-between",
    gap: 8,
    alignItems: "center",
  },
  displayHide: {
    display: "none",
  },
});
