const http = require("http");
const fs = require('fs');
const express = require("express");

const socketIo = require("socket.io");
const port = process.env.PORT || 8090;
const index = require("./routes/index");
const app = express();
app.use(index);
const server = http.createServer(app);
const io = socketIo(server);
let interval;

const ROOMS_PATH = './db/rooms/rooms.json';
const rooms = JSON.parse(fs.readFileSync(ROOMS_PATH));

function RoomSave (data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(ROOMS_PATH, JSON.stringify(data), function(err) {
      if (err) {
        reject(err);
      }
      else {
        resolve();
      }
    })
  })
}
io.on("connection", (socket) => {
  console.log("New client connected");
  if (interval) {
    clearInterval(interval);
  }
  getRoomsandEmit(socket)
  socket.on('update_rooms', (data) => {
    console.log(data);
    RoomSave(data);
  });
  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });
});

const getRoomsandEmit = socket => {
  const response = rooms;
  socket.emit("Rooms", response);
};

server.listen(port, () => console.log(`Listening on port ${port}`));
