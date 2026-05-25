
const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const session = require('express-session');
const mongostore = require('connect-mongodb-session')(session);
const dotenv = require('dotenv');
const multer = require('multer');
const {router2} = require('./routes/auth');
const {router3} = require('./routes/message');
const { router, VShort, VShort1, short, long, validate, docupload, cloudinary } = require('./routes/routeindex');
const http = require('http');
// const { Server } = require('socket.io');
const server = http.createServer(app);
// const io = new Server(server, {
//   cors: { origin: '*' }
// });

dotenv.config();
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views'));
const store = new mongostore({
    uri: process.env.URL,
    collection: 'sessions',
});
app.set('trust proxy', 1);
app.use(express.json());

app.use(session({
    secret: process.env.SESSION,
    resave: false,
    saveUninitialized: true,
    store: store
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/uploads', express.static('uploads'));

app.use(router);
app.use(router2);
app.use(router3);

app.use((req, res, next) => {
    res.status(404).send('<h1>404 Page Not Found</h1>');
});

// const onlineUsers = {};

// io.on('connection', (socket) => {
    
//   socket.on('register', (userId) => {
//     onlineUsers[userId] = socket.id;
//     socket.userId = userId;

//     console.log(`User registered: ${userId} → socket ${socket.id}`);

//     // Tell everyone this user is now online
//     io.emit('user-status', { userId, status: 'online' });
//   });

//   // Send private message to a specific user
//   socket.on('private-message', ({ toUserId, message }) => {
//     const fromUserId = socket.userId;
//     const toSocketId = onlineUsers[toUserId];

//     const payload = {
//       from: fromUserId,
//       to: toUserId,
//       message,
//       timestamp: new Date().toISOString()
//     };

//     // Send to recipient if online
//     if (toSocketId) {
//       io.to(toSocketId).emit('private-message', payload);
//     }

//     // Echo back to sender (for their own chat UI)
//     socket.emit('private-message', payload);

//     // If recipient is offline, you'd save to DB here
//     if (!toSocketId) {
//       socket.emit('message-undelivered', {
//         toUserId,
//         message,
//         reason: 'User is offline'
//       });
//     }
//   });

//   // Typing indicator
//   socket.on('typing', ({ toUserId, isTyping }) => {
//     const toSocketId = onlineUsers[toUserId];
//     if (toSocketId) {
//       io.to(toSocketId).emit('typing', {
//         fromUserId: socket.userId,
//         isTyping
//       });
//     }
//   });

//   socket.on('disconnect', () => {
//     const userId = socket.userId;
//     if (userId) {
//       delete onlineUsers[userId];
//       io.emit('user-status', { userId, status: 'offline' });
//       console.log(`User disconnected: ${userId}`);
//     }
//   });
// });

 const port = 3069;
 mongoose.connect(process.env.URL).then(() => {
    server.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
    
 }).catch((err) => {
    console.error('Failed to connect to MongoDB', err);
 });  

module.exports = { session};


