import { FontAwesome5 } from "@expo/vector-icons";
import React, { useContext } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from "react-native-popup-menu";
import { clearAsyncStorage } from "../../helpers/common-helpers";
import { SocketContext } from "../../providers/socket-provider";
import { useDispatch } from "react-redux";
import ReduxActions from "../../redux/actions";

const styles = StyleSheet.create({
  headerContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 24,
    backgroundColor: "rgb(58, 63, 77)",
    borderBottomColor: "rgb(82, 86, 98)",
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 22,
    color: "white",
  },
});
export const AppHeader = () => {
  const dispatch = useDispatch();
  const clientSocket = useContext(SocketContext);

  const profileMenuOptions = [
    {
      id: "profile",
      name: "Profile",
      onClick: () => {},
    },
    {
      id: "logout",
      name: "Logout",
      onClick: async () => {
        clientSocket?.disconnect();
        await clearAsyncStorage();
        dispatch(ReduxActions.logOut());
      },
    },
  ];

  return (
    <View style={styles.headerContainer}>
      <View
        style={{ flex: 1, flexDirection: "row", gap: 16, alignItems: "center" }}
      >
        <Image
          source={require("../../assets/icons/chatAppIcon.png")}
          style={{ height: 24, width: 24 }}
        />
        <Text style={styles.headerTitle}>Chat App</Text>
      </View>
      {/* <Pressable
        onPress={() => {
          setIsModalOpen(true);
        }}
      >
        <AppModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
          }}
        />
      </Pressable> */}
      <Menu>
        <MenuTrigger>
          <FontAwesome5 name="user-circle" size={32} color="white" />
        </MenuTrigger>
        <MenuOptions
          customStyles={{
            optionsContainer: {
              marginTop: 37,
              marginLeft: -118,
              width: 150,
              borderRadius: 6,
            },
            optionWrapper: {
              borderBottomColor: "black",
              borderBottomWidth: 1,
            },
          }}
        >
          {profileMenuOptions.map((option) => {
            return (
              <MenuOption
                key={option.id}
                onSelect={() => {
                  option.onClick();
                }}
                style={Styles.modalItem}
              >
                <Text>{option.name}</Text>
              </MenuOption>
            );
          })}
        </MenuOptions>
      </Menu>
    </View>
  );
};

const Styles = StyleSheet.create({
  modalItem: {
    height: 40,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
});
