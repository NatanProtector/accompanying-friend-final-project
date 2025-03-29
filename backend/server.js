const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const { getMongoURI } = require('./utils/env_variables');
const routes = require('./routes/index');

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/api', routes);

// Serve a test route
app.get('/', (req, res) => {
  res.send('Server is running...');
});

// Socket.io Demo ====================================================================================================== //
const http = require('http');
const { Server } = require('socket.io');
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: '*' }
  });

  // Store connected users and admins
const users = new Map();  // key: socket.id, value: { id, location }
const admins = new Set(); // store admin socket ids

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
    // console.log(location);
    
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
    
    const userList = Array.from(users.values());
    admins.forEach((adminSocketId) => {
        const adminSocket = io.sockets.sockets.get(adminSocketId);
        if (adminSocket) {
            adminSocket.emit('user_list_update', userList);
        }
    });
}, 5000);

// ===================================================================================================================== //


// mongoose
// .connect(getMongoURI())
// .then(() => console.log('MongoDB connected successfully'))
// .catch((err) => console.log('MongoDB connection error:' , err));

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});