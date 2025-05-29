const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth');
const questionsRoutes = require('./routes/questions');
const duelsRoutes = require('./routes/duels')(io);

const duelScoringHandler = require('./socket-handlers/duelScoring');
duelScoringHandler(io);

// Mount the routes
app.use('/api', authRoutes);
app.use('/api', questionsRoutes);
app.use('/api', duelsRoutes);

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('join-duel', ({ duelCode, userId }) => {
    const roomName = `duel-${duelCode}`;
    socket.join(roomName);
    console.log(`User ${userId} joined room ${roomName}`);

    const room = io.sockets.adapter.rooms.get(roomName);
    const count = room ? room.size : 0;
    console.log(`Room ${roomName} has ${count} participant(s)`);

    if(count === 2) {
      io.to(roomName).emit('duel-started');
      console.log(`Emitted duel-started to ${roomName}`);
    }

    //socket.to(roomName).emit('opponent-joined', { userId });
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});



