const { Server } = require("socket.io");
const User = require("./models/User");
const Message = require("./models/Chat");
let io;
const connectedUsers = new Map();

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
    transports: ["websocket"],
  });

  io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on("identify", (userId) => {
      console.log(`User ${userId} identified with socket ${socket.id}`);
      connectedUsers.set(userId, socket.id);
    });

    socket.on("joinRoom", async (job) => {
      const users = await User.find({ job });
      const userIds = users.map((user) => user._id.toString());

      socket.join(job);
      console.log(`User ${socket.id} joined the room: ${job}`);
      const messages = await Message.find({ job }).sort({ timestamp: 1 });
      socket.emit("loadMessages", messages);
      // Emit the list of users in the room
      io.to(job).emit("usersInRoom", userIds);
    });

    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

    // Handle sending messages in the job room
    socket.on("sendMessage", async (message, job) => {
      try {
        const sender = await User.findById(message.userId);

        if (!sender) {
          console.error(`User with ID ${message.userId} not found`);
          return;
        }

        const newMessage = new Message({
          userId: message.userId,
          job,
          senderAvatar: sender.img,
          senderName: sender.username,
          text: message.text,
        });

        const savedMessage = await newMessage.save();

        // Create the message object to emit with all necessary fields
        const messageToEmit = {
          _id: savedMessage._id,
          userId: savedMessage.userId,
          job: savedMessage.job,
          senderAvatar: savedMessage.senderAvatar,
          senderName: savedMessage.senderName,
          text: savedMessage.text,
          timestamp: savedMessage.timestamp || new Date().toLocaleTimeString(),
          createdAt: savedMessage.createdAt,
          updatedAt: savedMessage.updatedAt,
        };

        // Emit the complete message object instead of the original message
        io.to(job).emit("receiveMessage", messageToEmit);

        // Notify users who are NOT in the chat room
        const users = await User.find({ job });
        users.forEach((user) => {
          const userId = user._id.toString();
          const socketId = connectedUsers.get(userId);

          if (socketId && !io.sockets.adapter.rooms.get(job)?.has(socketId)) {
            io.to(socketId).emit("newMessageNotification", {
              job,
              user: sender.username,
              img: sender.img,
              message: messageToEmit,
            });
          }
        });
      } catch (error) {
        console.error("Error handling sendMessage:", error);
      }
    });

    socket.on("disconnect", () => {
      for (const [userId, socketId] of connectedUsers.entries()) {
        if (socketId === socket.id) {
          connectedUsers.delete(userId);
          console.log(`User ${userId} disconnected`);
          break;
        }
      }
    });
  });
};

// Function to send notifications to a specific user
const sendNotificationToUser = (userId, notificationType, data) => {
  const socketId = connectedUsers.get(userId);
  if (socketId) {
    console.log(`Sending ${notificationType} to user ${userId}`);
    io.to(socketId).emit(notificationType, data);
    return true;
  } else {
    console.log(`User ${userId} not connected, notification not sent`);
    return false;
  }
};

const broadcastNotification = (notificationType, data) => {
  console.log(`Broadcasting ${notificationType} to all users`);
  io.emit(notificationType, data);
};

module.exports = {
  initializeSocket,
  sendNotificationToUser,
  broadcastNotification,
};
