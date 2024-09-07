import React, { createContext, useCallback, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { getAsyncStorageData } from "../helpers/common-helpers";
import { useDispatch, useSelector } from "react-redux";
import ReduxActions from "../redux/actions";
import { ApplicationState } from "../redux/reducer";
import { Text } from "react-native";
import { UserServices } from "../services/user.service";

export const SocketContext = createContext<Socket | null>(null);

export const SocketProvider = (props: { children: any }) => {
  const { children } = props;

  const dispatch = useDispatch();

  const isLogged = useSelector((state: ApplicationState) => state.loggedIn);
  const isSockedConnected = useSelector(
    (state: ApplicationState) => state.socketConnected
  );
  const loggedInUser = useSelector((state: ApplicationState) => state.user);

  const [isTokenVerified, setIsTokenVerified] = useState<boolean>(false);
  const [clientSocket, setClientSocket] = useState<Socket | null>(null);

  const initClientSocket = useCallback(async () => {
    const jwtToken = await getAsyncStorageData("token");
    console.log("sokcet connected", isSockedConnected);
    if (jwtToken && !isSockedConnected) {
      console.log("connecting.....", clientSocket);
      const socketInstance = io("http://192.168.1.3:8082", {
        auth: {
          jwt: jwtToken,
        },
        transports: ["websocket"],
      });

      socketInstance.on("connect_error", (err) => {
        console.log("got connect error", err);
        dispatch(ReduxActions.setLoggedIn(false));
        setIsTokenVerified(true);
      });

      socketInstance.on("connect", () => {
        console.log("connected successfully", socketInstance?.user || null);
        setClientSocket(socketInstance);
        setIsTokenVerified(true);
        if (!isLogged) dispatch(ReduxActions.setLoggedIn(true));
        dispatch(ReduxActions.setSocketConnected(true));
        console.log(socketInstance.id);
      });

      socketInstance.on("setSessionInfo", (sessionInfo) => {
        console.log(sessionInfo, "sessionInfo");
        if (!loggedInUser) {
          console.log(sessionInfo, "sessionInfo");
          dispatch(ReduxActions.setUserInfo(sessionInfo));
        }
      });

      socketInstance.on("disconnect", () => {
        console.log("disconnected");
      });
    } else {
      setIsTokenVerified(true);
    }
  }, [isSockedConnected]);

  const fetchSessionInfo = () => {
    UserServices.getSession()
      .then((resp) => {
        dispatch(ReduxActions.setUserInfo(resp.data));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    initClientSocket();
    return () => {
      setIsTokenVerified(false);
      clientSocket?.disconnect();
    };
  }, [isLogged]);

  useEffect(() => {
    if (!loggedInUser && isLogged) {
      fetchSessionInfo();
    }
  }, [isLogged]);

  return isTokenVerified && isLogged == (loggedInUser !== null) ? (
    <SocketContext.Provider value={clientSocket}>
      {children}
    </SocketContext.Provider>
  ) : (
    <Text>Loading</Text>
  );
};
