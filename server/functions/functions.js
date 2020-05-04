const fs = require('fs');
const fsp = require('fs').promises;

// Promises are bae

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

  get_room: function GetRoom (uuid, rooms, path, join) {
    fsp.readFile((path + uuid + ".json")).then(data => {
      const parsed = JSON.parse(data).messages;
      const roomByID = rooms.filter(obj => {
        return obj.uuid === uuid;
      })
      const result = roomByID.map(v => ({...v, messages: parsed}))
      join(result);
    }).catch(error => {
      const roomByID = rooms.filter(obj => {
        return obj.uuid === uuid;
      })
      join({error_404: "room not found", referance: roomByID})
    })
  },



  update_room: function UpdateRoom (data, path, ref) {
    if(ref === 'create') {
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
    }
    if(ref === 'delete') {
      return new Promise((resolve, reject) => {
        fs.unlink(path + data.uuid + ".json", function (err) {
          if (err) {
            reject(err);
          }
          else {
            resolve();
          }
        })
      })
    }
  },

  new_message: function NewMessage (message, uuid, path) {
    fsp.readFile((path + uuid + ".json")).then(data => {
      const all_messages = JSON.parse(data);
      all_messages.messages.push(message);
      return new Promise((resolve, reject) => {
        fs.writeFile(path + uuid + ".json", JSON.stringify(all_messages), function(err) {
          if (err) {
            reject(err);
          }
          else {
            resolve();
          }
        })
      })
    })
  }
};
