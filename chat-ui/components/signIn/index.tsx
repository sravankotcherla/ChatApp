import React, { useState } from "react";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Text,
  Image,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useNavigation } from "@react-navigation/native";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import { AuthService } from "../../services/auth.service";
import { setAsyncStorageData } from "../../helpers/common-helpers";
import { useDebounce } from "../../custom-hooks/debounce-hook";
import { useDispatch } from "react-redux";
import ReduxActions from "../../redux/actions";

export const SignIn = (props: { onLoginCallback: () => void }) => {
  const { onLoginCallback } = props;

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#c3d2ef",
      }}
    >
      <View style={Styles.modal}>
        <View style={Styles.header}>
          <Image
            source={require("../../assets/icons/chatAppIcon.png")}
            style={Styles.image}
          ></Image>
          <Text style={Styles.titleText}>Chat App</Text>
        </View>
        <View style={{ marginBottom: 10 }}>
          <View style={Styles.textInputWrapper}>
            <AntDesign
              name="user"
              size={16}
              color="white"
              style={{ marginHorizontal: 2 }}
            />
            <TextInput
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              placeholder="Username/Email"
              style={Styles.textEditor}
              textContentType="emailAddress"
            ></TextInput>
          </View>
          <View style={Styles.textInputWrapper}>
            <EvilIcons name="lock" size={24} color="white" />
            <TextInput
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              placeholder="Password"
              style={Styles.textEditor}
              textContentType="password"
            ></TextInput>
          </View>
        </View>
        <View style={Styles.switchPage}>
          <Text style={{ color: "white" }}>Dont have an account?</Text>
          <TouchableOpacity>
            <Text
              style={Styles.signUpLink}
              onPress={() => {
                navigation.push("signUp");
              }}
            >
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={Styles.loginBtn}
          onPress={() => {
            AuthService.signIn({ username, password })
              .then((resp) => {
                setAsyncStorageData("token", resp.data.token);
                dispatch(ReduxActions.setLoggedIn(true));
                dispatch(ReduxActions.setUserInfo(resp.data?.userInfo || null));
              })
              .catch((error) => {
                console.log(error);
              });
          }}
        >
          Login
        </TouchableOpacity>
        {/* <View>
          <Text>Sign in with</Text>
        </View> */}
      </View>
    </View>
  );
};

const Styles = StyleSheet.create({
  modal: {
    borderRadius: 20,
    backgroundColor: "rgb(64, 71, 87)",
    color: "white",
    paddingHorizontal: 50,
    paddingTop: 50,
    paddingBottom: 50,
    width: 450,
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 45,
    marginTop: 10,
    marginBottom: 30,
  },
  image: {
    width: 32,
    height: 32,
  },
  titleText: {
    fontSize: 35,
    fontWeight: 500,
    color: "white",
    marginLeft: 16,
  },
  textInputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
    padding: 10,
    borderBottomColor: "rgb(87, 93, 107)",
    borderBottomWidth: 2,
  },
  textEditor: {
    flex: 1,
    height: 32,
    padding: 8,
    color: "white",
    outlineStyle: "none",
    fontSize: 16,
  },
  switchPage: {
    flex: 1,
    flexDirection: "row",
    color: "white",
  },
  signUpLink: {
    color: "rgb(114, 109, 254)",
    textDecorationLine: "underline",
    marginLeft: 4,
  },
  loginBtn: {
    backgroundColor: "rgb(114, 109, 254)",
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    padding: 12,
    marginTop: 30,
    marginBottom: 30,
    borderRadius: 8,
  },
});
