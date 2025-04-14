const http = require('http');
const { Server } = require('socket.io');

// Store connected users and admins
const users = new Map();  // key: socket.id, value: { id, location , role}
const admins = new Set(); // store admin socket ids

const updateIntervalTime = 5000;

const addSocketsToServer = (app) => {

    const server = http.createServer(app);
    const io = new Server(server, {
        cors: { origin: '*' }
    });


    io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

        // Client sends role upon connection
        registerSocketEvents(socket);

        // Update user location
        updateLocation(socket);

        // Handle disconnections
        handleDisconnection(socket);
    });

    // Start broadcasting user list to admins every number of seconds defined in updateIntervalTime
    startBroadcastingUserList(io);

    return server
}

const registerSocketEvents = (socket) => {
    socket.on('register', (data) => {
        const { role, userId, location } = data;
        if (role === 'admin') {
            admins.add(socket.id);
            console.log(`Admin connected: ${socket.id}`);
        } else if (role === 'citizen' || role === 'security') {
            users.set(socket.id, { id: userId, location , role: role});
            console.log(`${role} connected: ${userId}`);
        }
    });
}

const updateLocation = (socket) => {
    socket.on('update_location', (location) => {
        
        if (users.has(socket.id)) {
            users.get(socket.id).location = location;
        }
    });
}

const handleDisconnection = (socket) => {
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
}

const startBroadcastingUserList = (io) => {

    setInterval(() => {    
        const userList = Array.from(users.values());
        admins.forEach((adminSocketId) => {
            const adminSocket = io.sockets.sockets.get(adminSocketId);
            if (adminSocket) {          
                adminSocket.emit('user_list_update', userList);
            }
        });
    }, updateIntervalTime);
}


module.exports = {
    addSocketsToServer
}