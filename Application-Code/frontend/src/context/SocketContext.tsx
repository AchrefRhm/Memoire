import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext(null);

const SOCKET_URL = "http://k8s-threetie-mainlb-11c5700e30-1182053200.us-east-1.elb.amazonaws.com";

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const userId = user?._id;
  useEffect(() => {
    if (!userId) return; // Don't connect if no userId

    const socketInstance = io(SOCKET_URL, {
      transports: ["websocket"],
    });

    socketInstance.on("connect", () => {
      console.log("Socket connected with id:", socketInstance.id);
      socketInstance.emit("identify", userId);
    });

    socketInstance.on("disconnect", () => {
      console.log("Disconnected from socket server");
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [userId]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
