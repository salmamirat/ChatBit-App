import { useEffect } from "react";
import { io } from "socket.io-client";
import { API_URL } from "../services/api";
import { useAuthStore } from "../store/authStore";
import { useSocketStore } from "../store/socketStore";

export default function SocketProvider({ children }) {
  const token = useAuthStore(
    (state) => state.token
  );

  const setSocket = useSocketStore(
    (state) => state.setSocket
  );

  const setConnected = useSocketStore(
    (state) => state.setConnected
  );

  useEffect(() => {
    if (!token) {
      return;
    }

    const socket = io(API_URL, {
      auth: {
        token
      }
    });

    socket.on("connect", () => {
      console.log("Socket connected");

      setConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");

      setConnected(false);
    });

    socket.on("connect_error", (error) => {
      console.log("Socket error:", error.message);
    });

    setSocket(socket);

    return () => {
      socket.disconnect();
      setSocket(null);
      setConnected(false);
    };
  }, [token]);

  return children;
}