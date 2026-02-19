require('dotenv').config();

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Import and use auth routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

//room routes
const roomRoutes = require('./routes/rooms');
app.use('/api/rooms', roomRoutes);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Join a specific room
  socket.on("join-room", (roomId, username) => {
    socket.join(roomId);
    console.log(`${username} joined room: ${roomId}`);
    
    // Notify others in the room
    socket.to(roomId).emit("user-joined", username);
  });

  // Handle transcription
  socket.on("send-transcription", (roomId, transcription, username) => {
    console.log(`Transcription from ${username} in room ${roomId}:`, transcription);
    
    // Broadcast to everyone in the room (including sender)
    io.to(roomId).emit("receive-transcription", {
      text: transcription,
      username: username,
      timestamp: new Date()
    });
  });

  // Leave room
  socket.on("leave-room", (roomId, username) => {
    socket.leave(roomId);
    console.log(`${username} left room: ${roomId}`);
    socket.to(roomId).emit("user-left", username);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});