import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  socket.on("rooms_list", ({ rooms }) => {
    rooms.forEach((room) => socket.join(room));
    socket.on("post_room_message", ({ roomId, message }) => {
      socket.broadcast.to(roomId).emit("get_room_message", { message });
    });
  });

  socket.on("disconnect", () => console.log("user disconnected !!!"));
});

export const start = () => {
  httpServer.listen(5001, () => console.log("room server connected 🚀🚀🚀"));
};
