import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { SignIn } from "../components/signIn";
import { SignUp } from "../components/signUp";

const Stack = createNativeStackNavigator();

export const SignInStack = (props: { onLogin: () => void }) => {
  const { onLogin } = props;
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName="signIn">
        <Stack.Screen name="signIn" options={{ headerShown: false }}>
          {() => {
            return <SignIn onLoginCallback={onLogin} />;
          }}
        </Stack.Screen>
        <Stack.Screen
          name="signUp"
          component={SignUp}
          options={{ headerShown: false }}
        ></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};
