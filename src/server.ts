import app from "./app.js";
import http from "node:http";
import { Server } from "socket.io";

const PORT = process.env.PORT || 3000;

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.set("io", io);

io.on("connection", (socket) => {
  socket.on("chat:join_conversation", (payload: { chatId?: string } | undefined) => {
    const chatId = payload?.chatId;
    if (!chatId) {
      return;
    }

    socket.join(`chat:${chatId}`);
  });

  socket.on("chat:leave_conversation", (payload: { chatId?: string } | undefined) => {
    const chatId = payload?.chatId;
    if (!chatId) {
      return;
    }

    socket.leave(`chat:${chatId}`);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
