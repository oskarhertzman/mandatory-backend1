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

  socket.on('get_rooms', (callback) => {
    server.get_rooms(rooms, callback);
  })

  socket.on('update_rooms', (rooms, room, ref) => {
    socket.broadcast.emit('new_room', rooms);
    server.update_rooms(rooms, ROOMS_PATH);
    server.update_room(room, ROOM_PATH, ref);
  })

  socket.on('join_room', (uuid) => {
    currentRoom = uuid;
    socket.join(currentRoom);
    server.get_room(uuid, rooms, ROOM_PATH, JoinRoom);
    function JoinRoom (result) {
        io.to(currentRoom).emit('get_room', result);
      }
  })

  socket.on('typing', (data) => {
    if(data.typing) {
      console.log(data);
      socket.broadcast.to(currentRoom).emit('typing', data);

    }
    else {
    socket.broadcast.to(currentRoom).emit('typing', data);
    }
  })


  socket.on('new_message', (data, uuid) => {
    console.log(data);
    socket.broadcast.to(currentRoom).emit('new_message', data)
    server.new_message(data, uuid, ROOM_PATH);
  })


  socket.on("disconnect", () => {
    console.log("Client disconnected");
    socket.leave(currentRoom);
    clearInterval(interval);
  })
});

the_server.listen(port, () => console.log(`Listening on port ${port}`));
