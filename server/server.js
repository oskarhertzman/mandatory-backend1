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

const getRoomsandEmit = socket => {
  const response = rooms;
  socket.emit("Rooms", response);
};

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

function NewMessage (rooms, data) {
// Ganska dålig lösning, ej skalbar
const objIndex = rooms.findIndex((obj => obj.uuid == data.uuid));
const updatedObj = { ...rooms[objIndex], messages: data.messages};
const updatedArray = [...rooms.slice(0, objIndex), updatedObj, ...rooms.slice(objIndex + 1),];
return new Promise((resolve, reject) => {
  fs.writeFile(ROOMS_PATH, JSON.stringify(updatedArray), function(err) {
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

  socket.on('get_room', function (data, callback) {
    let result = rooms.filter(obj => {
    return obj.uuid === data;
  })
  callback(result);
});

  socket.on('update_rooms', (data) => {
    console.log(data);
    RoomSave(data);
  });

  socket.on('new_message', (data) => {
    console.log(data);
    socket.broadcast.emit('new_message', data)
    NewMessage(rooms, data);
  })

  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });
});



server.listen(port, () => console.log(`Listening on port ${port}`));
