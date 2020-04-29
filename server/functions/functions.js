const fs = require('fs');

module.exports = {

  get_rooms: function GetRooms (rooms, callback) {
    callback(rooms);
  },

  update_rooms: function UpdateRooms (data, path) {
    return new Promise((resolve, reject) => {
      fs.writeFile(path, JSON.stringify(data), function(err) {
        if (err) {
          reject(err);
        }
        else {
          resolve();
        }
      })
    })
  },

  get_room: function GetRoom (data, rooms, path, callback) {
    const roomByID = rooms.filter(obj => {
      return obj.uuid === data;
    })
    const roomMessages = JSON.parse(fs.readFileSync(path + data + ".json")).messages;
    const newArr1 = roomByID.map(v => ({...v, messages: roomMessages}))
    callback(newArr1);
  },

  create_room: function CreateRoom (data, path) {
    return new Promise((resolve, reject) => {
      fs.writeFile(path + data.uuid + ".json", JSON.stringify(data), function(err) {
        if (err) {
          reject(err);
        }
        else {
          resolve();
        }
      })
    })
  },


  delete_room: function DeleteRoom (data) {
    console.log(data);
    return new Promise((resolve, reject) => {
      fs.unlink(ROOM_PATH + data.uuid + ".json", function (err) {
        if (err) {
          reject(err);
        }
        else {
          resolve();
        }
      })
    })
  },

  new_message: function NewMessage (data, uuid, path) {

    const roomMessages = JSON.parse(fs.readFileSync(path + uuid + ".json"));
    roomMessages.messages.push(data);
    console.log(roomMessages);

    return new Promise((resolve, reject) => {
      fs.writeFile(path + uuid + ".json", JSON.stringify(roomMessages), function(err) {
        if (err) {
          reject(err);
        }
        else {
          resolve();
        }
      })
    })
  }
};
