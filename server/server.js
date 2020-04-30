const server = require('./functions/functions.js');

const http = require("http");
const fs = require('fs');
const express = require("express");

const socketIo = require("socket.io");
const port = process.env.PORT || 8090;
const index = require("./routes/index");
const app = express();
const the_server = http.createServer(app);
const io = socketIo(the_server);

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

  socket.on('get_rooms', function (callback) {
    console.log("yo");
    server.get_rooms(rooms, callback);
  })

  socket.on('update_rooms', (rooms, room, ref) => {
    server.update_rooms(rooms, ROOMS_PATH);
    server.update_room(room, ROOM_PATH, ref);
  })

  socket.on('get_room', function (uuid, callback) {
    server.get_room(uuid, rooms, ROOM_PATH, callback);
})

  socket.on('create_room', (data) => {
    console.log(data);
    server.create_room(data, ROOM_PATH);
  })

  socket.on('delete_room', (data) => {
    server.delete_room(data, ROOM_PATH);
  })

  socket.on('new_message', (data, uuid) => {
    socket.broadcast.emit('new_message', data)
    server.new_message(data, uuid, ROOM_PATH);
  })

  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  })
});



the_server.listen(port, () => console.log(`Listening on port ${port}`));
