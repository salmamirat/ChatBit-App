import { Server } from "socket.io";
import jwt from "jsonwebtoken";

import { registerSocketHandlers } from "../socket/handlers.js";

let io;

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.use((socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.replace("Bearer ", "");

      if (!token) {
        return next(new Error("Authentication token required"));
      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      socket.user = {
        id: decoded.id,
        role: decoded.role,
      };

      next();
    } catch (error) {
      console.error("Socket authentication error:", error);

      next(new Error("Invalid or expired token"));
    }
  });

  io.on("connection", (socket) => {
    console.log(
      `Socket connected: ${socket.id} - User ${socket.user.id}`
    );

    registerSocketHandlers(io, socket);
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.IO has not been initialized");
  }

  return io;
};