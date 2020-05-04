const http = require("http");
const fs = require('fs');
const express = require("express");
const socketIo = require("socket.io");

const server = require('./functions/functions.js');
const index = require("./routes/index");

const app = express();
const the_server = http.createServer(app);
const io = socketIo(the_server);
const port = process.env.PORT || 8090;

const ROOMS_PATH = './db/rooms/rooms.json';
const ROOM_PATH = './db/room/';
const rooms = JSON.parse(fs.readFileSync(ROOMS_PATH));

let interval;
app.use(index);

io.on("connection", (socket) => {
  console.log("New client connected");
  if (interval) {
    clearInterval(interval);
  }

  let currentRoom;
  let currentUser;

  socket.on('get_rooms', (callback) => {
    server.get_rooms(rooms, callback);
  })

  socket.on('update_rooms', (rooms, room, ref) => {
    socket.broadcast.emit('new_room', rooms);
    server.update_rooms(rooms, ROOMS_PATH);
    server.update_room(room, ROOM_PATH, ref);
  })

  socket.on('join_room', (uuid) => {
    console.log("joined");
    currentRoom = uuid;
    socket.join(currentRoom);
    server.get_room(uuid, rooms, ROOM_PATH, JoinRoom);
    function JoinRoom (result) {
      io.to(currentRoom).emit('get_room', result);
    }
  })

  socket.on('user_joined', (data, uuid) => {
    currentUser = data.name;
    socket.broadcast.to(currentRoom).emit('user_joined', data);
    server.user_joined(data, uuid, ROOM_PATH);
  })

  socket.on('typing', (data) => {
    if(data.typing) {
      socket.broadcast.to(currentRoom).emit('typing', data);
    }
    else {
      socket.broadcast.to(currentRoom).emit('typing', data);
    }
  })

  socket.on('new_message', (data, uuid) => {
    socket.broadcast.to(currentRoom).emit('new_message', data)
    server.new_message(data, uuid, ROOM_PATH);
  })



  socket.on("disconnect", () => {
    server.user_left(currentUser, currentRoom, ROOM_PATH, LeaveRoom)
    function LeaveRoom (result) {
    socket.broadcast.to(currentRoom).emit('user_left', result);
    socket.leave(currentRoom);
    console.log("Client disconnected");
    clearInterval(interval);
    }
  })
});

the_server.listen(port, () => console.log(`Listening on port ${port}`));
