const { log } = require('console');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

// Store connected users and admins
const users = new Map();  // key: socket.id, value: { id, location }
const admins = new Set(); // store admin socket ids

// Serve a test route
app.get('/', (req, res) => {
  res.send('Server is running...');
});

io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  // Client sends role upon connection
  socket.on('register', (data) => {
    const { role, userId, location } = data;
    if (role === 'admin') {
      admins.add(socket.id);
      console.log(`Admin connected: ${socket.id}`);
    } else if (role === 'user') {
      users.set(socket.id, { id: userId, location });
      console.log(`User connected: ${userId}`);
    }
  });

  // Update user location
  socket.on('update_location', (location) => {
    console.log(location);
    
    if (users.has(socket.id)) {
      users.get(socket.id).location = location;
    }
  });

  // Handle disconnections
  socket.on('disconnect', () => {
    if (admins.has(socket.id)) {
      admins.delete(socket.id);
      console.log(`Admin disconnected: ${socket.id}`);
    }
    if (users.has(socket.id)) {
      console.log(`User disconnected: ${users.get(socket.id).id}`);
      users.delete(socket.id);
    }
  });
});

// Broadcast user list to admins every 5 seconds
setInterval(() => {
    // console.log("Sending user list to admins...");
    
    const userList = Array.from(users.values()); // Array of { id, location }
    admins.forEach((adminSocketId) => {
        const adminSocket = io.sockets.sockets.get(adminSocketId);
        if (adminSocket) {
        adminSocket.emit('user_list_update', userList);
        }
    });
}, 5000);

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
