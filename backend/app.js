const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const PORT = process.env.PORT || 3030;

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: 'http://localhost:8080',
  },
});

const { readCards, createCard, editCard, removeCard } =
  require('./controllers/cards_controller.js')(io);

io.on('connection', (socket) => {
  console.log('New client connected ' + socket.id);

  socket.on('initial_data', readCards);
  socket.on('create_data', createCard);
  socket.on('edit_data', editCard);
  socket.on('remove_data', removeCard);

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

const start = () => {
  try {
    server.listen(PORT, () => {
      console.log(`Server has been started on port ${PORT}...`);
    });
  } catch (err) {
    throw new Error(err);
  }
};

start();
