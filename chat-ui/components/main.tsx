import React, { useState } from "react";
import { SocketProvider } from "../providers/socket-provider";
import { AppStack } from "../stacks/app-stack";
import { SignInStack } from "../stacks/signIn-stack";
import { useSelector } from "react-redux";
import { ApplicationState } from "../redux/reducer";

const Main = () => {
  const isLogged = useSelector((state: ApplicationState) => state.loggedIn);
  return (
    <SocketProvider>
      {isLogged ? <AppStack /> : <SignInStack onLogin={() => {}} />}
    </SocketProvider>
  );
};

export default Main;
