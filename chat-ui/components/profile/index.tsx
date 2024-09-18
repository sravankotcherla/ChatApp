import {
  AntDesign,
  Entypo,
  EvilIcons,
  FontAwesome5,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Image,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { breakPoints } from "../../constants/screen-sizes";
import { ApplicationState } from "../../redux/reducer";

import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import { TextInput } from "react-native-gesture-handler";
import ReduxActions from "../../redux/actions";
import { UserServices } from "../../services/user.service";

export const Profile = ({ route }) => {
  const loggedInUser = useSelector((state: ApplicationState) => state.user);
  const activeChatId = useSelector(
    (state: ApplicationState) => state.activeChatId
  );

  const navigation = useNavigation();

  const { width } = Dimensions.get("window");

  const profileImgFilePicker = useRef(null);
  const dispatch = useDispatch();

  const [oldUserInfo, setOldUserInfo] = useState<{ [key: string]: string }>({
    username: loggedInUser?.username || "",
    email: loggedInUser?.email || "",
    profileImg: loggedInUser?.profileImg || "",
  });
  const [userInfo, setUserInfo] = useState<{ [key: string]: string }>({
    username: loggedInUser?.username || "",
    email: loggedInUser?.email || "",
    profileImg: loggedInUser?.profileImg || "",
  });

  const [editField, setEditField] = useState<string | null>(null);

  const handleUploadProfileImg = async () => {
    if (Platform.OS === "web") {
      if (profileImgFilePicker.current) profileImgFilePicker.current.click();
    }
  };

  const handleUploadImgFromWeb = (e) => {
    const imgFile = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setOldUserInfo((prev) => ({ ...prev, profileImg: reader.result }));
    };
    reader.readAsDataURL(imgFile);
  };

  const handleUpdateUserInfo = (newInfo) => {
    UserServices.updateUserInfo(newInfo)
      .then((resp) => {
        dispatch(ReduxActions.setUserInfo(resp.data));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (
      oldUserInfo.username !== loggedInUser?.username ||
      oldUserInfo.email !== loggedInUser?.email ||
      oldUserInfo.profileImg !== loggedInUser?.profileImg
    ) {
      handleUpdateUserInfo(oldUserInfo);
    }
  }, [oldUserInfo]);

  return (
    <SafeAreaView style={styles.homeContainer}>
      <View style={{ flex: 1, backgroundColor: "rgb(64, 71, 87)" }}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("home");
            }}
          >
            <Ionicons name="arrow-back-outline" size={24} color="white" />
          </TouchableOpacity>
          <Text style={{ color: "white", fontSize: 22, marginLeft: 12 }}>
            Profile
          </Text>
        </View>
        <View
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: 12,
          }}
        >
          <View style={{ marginVertical: 40 }}>
            {oldUserInfo.profileImg?.length ? (
              <Image
                source={{ uri: oldUserInfo.profileImg }}
                style={styles.profileImage}
                resizeMode="cover"
              />
            ) : (
              <FontAwesome5 name="user-circle" size={180} color="white" />
            )}
            <View style={styles.badgeContainer}>
              <Pressable onPress={handleUploadProfileImg}>
                <EvilIcons name="paperclip" size={32} color="black" />
                {Platform.OS === "web" ? (
                  <input
                    type="file"
                    ref={profileImgFilePicker}
                    onChange={handleUploadImgFromWeb}
                    style={{ display: "none" }}
                  />
                ) : null}
              </Pressable>
            </View>
          </View>

          <View style={styles.infoItemWrapper}>
            <AntDesign
              name="user"
              size={20}
              color="white"
              style={{ marginHorizontal: 2 }}
            />
            <View>
              <Text style={{ fontSize: "12" }}>Name</Text>
              {editField === "username" ? (
                <View style={styles.textInputWrapper}>
                  <TextInput
                    value={userInfo.username}
                    autoFocus={editField === "username"}
                    onChangeText={(text) => {
                      setUserInfo((prev) => ({ ...prev, username: text }));
                    }}
                    style={styles.textEditor}
                  />
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      marginLeft: "auto",
                    }}
                  >
                    <Pressable
                      onPress={() => {
                        setEditField(null);
                        setUserInfo(oldUserInfo);
                      }}
                    >
                      <Entypo name="cross" size={24} color="white" />
                    </Pressable>
                    <Pressable
                      onPress={() => {
                        setOldUserInfo(userInfo);
                        setEditField(null);
                      }}
                    >
                      <MaterialIcons name="done" size={24} color="white" />
                    </Pressable>
                  </View>
                </View>
              ) : (
                <>
                  <Text style={{ color: "white", fontSize: 18 }}>
                    {userInfo.username}
                  </Text>
                </>
              )}
            </View>

            {editField === "username" ? null : (
              <Pressable
                onPress={() => {
                  setEditField("username");
                }}
                style={{ marginLeft: "auto" }}
              >
                <MaterialCommunityIcons
                  name="pencil-outline"
                  size={24}
                  color="white"
                  style={{ marginLeft: "auto", cursor: "pointer" }}
                />
              </Pressable>
            )}
          </View>
          <View style={styles.infoItemWrapper}>
            <MaterialCommunityIcons
              name="email-outline"
              size={24}
              color="white"
            />
            <View>
              <Text style={{ fontSize: "12" }}>Email</Text>
              {editField === "email" ? (
                <View style={styles.textInputWrapper}>
                  <TextInput
                    value={userInfo.email}
                    autoFocus={editField === "username"}
                    onChangeText={(text) => {
                      setUserInfo((prev) => ({ ...prev, email: text }));
                    }}
                    style={styles.textEditor}
                  />
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      marginLeft: "auto",
                    }}
                  >
                    <Pressable
                      onPress={() => {
                        setEditField(null);
                        setUserInfo(oldUserInfo);
                      }}
                    >
                      <Entypo name="cross" size={24} color="white" />
                    </Pressable>
                    <Pressable
                      onPress={() => {
                        setOldUserInfo(userInfo);
                        setEditField(null);
                      }}
                    >
                      <MaterialIcons name="done" size={24} color="white" />
                    </Pressable>
                  </View>
                </View>
              ) : (
                <>
                  <Text style={{ color: "white", fontSize: 18 }}>
                    {userInfo.email}
                  </Text>
                </>
              )}
            </View>
            {editField === "email" ? null : (
              <Pressable
                onPress={() => {
                  setEditField("email");
                }}
                style={{ marginLeft: "auto" }}
              >
                <MaterialCommunityIcons
                  name="pencil-outline"
                  size={24}
                  color="white"
                  style={{ marginLeft: "auto", cursor: "pointer" }}
                />
              </Pressable>
            )}
          </View>
        </View>
      </View>
      {width > breakPoints.md && (
        <View style={styles.chatBox}>{/* <ChatBox /> */}</View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 60,
    display: "flex",
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 18,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "rgb(82, 86, 98)",
    marginBottom: 12,
  },
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
  profileImage: {
    width: 180,
    height: 180,
    borderRadius: 90,
  },
  infoItemWrapper: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    // justifyContent: "space-between",
    flex: 1,
    width: "100%",
    gap: 24,
    width: "100%",
    padding: 12,
  },
  textInputWrapper: {
    flex: 1,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    borderBottomColor: "rgb(87, 93, 107)",
    borderBottomWidth: 2,
  },
  textEditor: {
    flex: 1,
    height: 32,
    width: 240,
    paddingVertical: 8,
    color: "white",
    outlineStyle: "none",
    fontSize: 16,
  },
  badgeContainer: {
    position: "absolute",
    right: -10,
    bottom: 15,
    borderRadius: 20,
    backgroundColor: "rgb(114, 109, 254)",
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
  },
});
