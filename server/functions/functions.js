const fs = require('fs');
const fsp = require('fs').promises;

// Promises are bae

module.exports = {

  get_rooms: function GetRooms (callback, path) {
    fsp.readFile((path)).then(data => {
      callback(JSON.parse(data))
    })
  },

  update_rooms: function UpdateRooms (newRooms, path, send) {
        fsp.writeFile(path, JSON.stringify(newRooms)).then(() => {
          send(newRooms);
        })
  },

  get_room: function GetRoom (uuid, roomsPath, roomPath, join) {
    fsp.readFile((roomsPath)).then((roomsToParse) => {
      const rooms = JSON.parse(roomsToParse);
      fsp.readFile((roomPath + uuid + ".json")).then(data => {
        const messages_from_room = JSON.parse(data).messages;
        const online_users_from_room = JSON.parse(data).users_online;
        const roomByID = rooms.filter(obj => {
          return obj.uuid === uuid;
        })
        const result = roomByID.map(v => ({...v,
          messages: messages_from_room,
          users_online: online_users_from_room }))
          join(result);
        }).catch(error => {
          const roomByID = rooms.filter(obj => {
            return obj.uuid === uuid;
          })
          join({error_404: "room not found", referance: roomByID})
        })
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
        const room = JSON.parse(data);
        room.messages.push(message);
        return new Promise((resolve, reject) => {
          fs.writeFile(path + uuid + ".json", JSON.stringify(room), function(err) {
            if (err) {
              reject(err);
            }
            else {
              resolve();
            }
          })
        })
      })
    },

    user_joined: function UserJoined (user, uuid, path) {
      fsp.readFile((path + uuid + ".json")).then(data => {
        const room = JSON.parse(data);
        room.users_online.push(user);
        return new Promise((resolve, reject) => {
          fs.writeFile(path + uuid + ".json", JSON.stringify(room), function(err) {
            if (err) {
              reject(err);
            }
            else {
              resolve();
            }
          })
        })
      })
    },

    user_left: function UserLeft (user, uuid, path, leave) {
      if (user) {
        fsp.readFile((path + uuid + ".json")).then(data => {
          const room = JSON.parse(data);
          var newUsers = room.users_online.filter(function(el) {
            return el.name !== user;
          })
          room.users_online = newUsers;
          leave(room.users_online);
          return new Promise((resolve, reject) => {
            fs.writeFile(path + uuid + ".json", JSON.stringify(room), function(err) {
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
    }
  };
