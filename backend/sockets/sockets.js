const http = require("http");
const { Server } = require("socket.io");

// Store connected users and admins
const users = new Map(); // key: socket.id, value: { id, location , role }
const admins = new Set(); // store admin socket ids

let io; // Make io accessible from outside
const updateIntervalTime = 5000;

const addSocketsToServer = (app) => {
  const server = http.createServer(app);
  io = new Server(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // Client sends role upon connection
    registerSocketEvents(socket);

    // Update user location
    updateLocation(socket);

    // Handle disconnections
    handleDisconnection(socket);
  });

  // Start broadcasting user list to admins every number of seconds defined in updateIntervalTime
  startBroadcastingUserList();

  return server;
};

const registerSocketEvents = (socket) => {
  socket.on("register", (data) => {
    const { role, userId, location, idNumber } = data;
    if (role === "admin") {
      admins.add(socket.id);
      console.log(`Admin connected: ${socket.id}`);
    } else if (role === "citizen" || role === "security") {
      const info = { id: userId, location, role: role };
      if (idNumber) info.idNumber = idNumber;

      users.set(socket.id, info);
      console.log(`${role} connected: ${userId}`);
    }
  });
};

const updateLocation = (socket) => {
  socket.on("update_location", (location) => {
    if (users.has(socket.id)) {
      users.get(socket.id).location = location;
    }
  });
};

const handleDisconnection = (socket) => {
  socket.on("disconnect", () => {
    if (admins.has(socket.id)) {
      admins.delete(socket.id);
      console.log(`Admin disconnected: ${socket.id}`);
    }
    if (users.has(socket.id)) {
      const disconnectedUser = users.get(socket.id);
      console.log(`User disconnected: ${disconnectedUser.id}`);

      const idNumber = disconnectedUser.id;

      // HOT FIX FOR DUPLICATE USER REGISTRATION FROM NOTIFICATION WRAPPER
      // Find and remove any other user with the same idNumber
      for (const [otherSocketId, otherUser] of users.entries()) {
        if (otherUser.idNumber === idNumber && otherSocketId !== socket.id) {
          console.log(
            `Removing duplicate user with idNumber: ${otherUser.idNumber}`
          );
          users.delete(otherSocketId);
        }
      }

      users.delete(socket.id);
    }
  });
};

const startBroadcastingUserList = () => {
  setInterval(() => {
    const userList = Array.from(users.values());
    admins.forEach((adminSocketId) => {
      const adminSocket = io.sockets.sockets.get(adminSocketId);
      if (adminSocket) {
        adminSocket.emit("user_list_update", userList);
      }
    });
  }, updateIntervalTime);
};

// --- ✨ NEW FUNCTION ✨ ---
const sendNotificationToUser = (userId, notification) => {
  console.log(`[SOCKET] Trying to send to: ${userId}`);
  let sent = false;
  for (const [socketId, user] of users.entries()) {
    console.log(`-> user: ${user.id}, socket: ${socketId}`);
    if (user.id.toString() === userId.toString()) {
      const socket = io.sockets.sockets.get(socketId);
      if (socket) {
        socket.emit("new_notification", notification);
        console.log(`[SOCKET] ✅ Sent to socket ${socketId}`);
        sent = true;
      }
      break;
    }
  }
  if (!sent) {
    console.warn(`[SOCKET] ❌ No active socket found for ${userId}`);
  }
};

// Add new function to notify admins about new events
const notifyAdminsAboutNewEvent = () => {
  admins.forEach((adminSocketId) => {
    const adminSocket = io.sockets.sockets.get(adminSocketId);
    if (adminSocket) {
      adminSocket.emit("new_event_reported", { message: "New event reported" });
    }
  });
};

module.exports = {
  addSocketsToServer,
  sendNotificationToUser,
  notifyAdminsAboutNewEvent,
};
