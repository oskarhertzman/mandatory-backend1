const fsp = require('fs').promises;

// Promises are bae

module.exports = {

  get_rooms: function GetRooms (callback, path) {
    fsp.readFile((path)).then(data => {
      callback(JSON.parse(data))
    })
  },

  get_room: function GetRoom (uuid, path, join) {
    fsp.readFile((path + uuid + ".json")).then(data => {
      join(JSON.parse(data))
    }).catch(error => {
      join({error_404: "room not found"})
    })
  },

  update_rooms: function UpdateRooms (newRooms, path) {
    fsp.writeFile(path, JSON.stringify(newRooms)).catch(error => {
      console.log(error);
    })
  },

  update_room: function UpdateRoom (data, path, ref) {
    if(ref === 'create') {
        fsp.writeFile(path + data.uuid + ".json", JSON.stringify(data)).catch(error => {
          console.log(error);
        })
    }
    if(ref === 'delete') {
        fsp.unlink(path + data.uuid + ".json").catch(error => {
          console.log(error);
        })
    }
  },

  new_message: function NewMessage (message, uuid, path) {
    fsp.readFile((path + uuid + ".json")).then(data => {
      const room = JSON.parse(data);
      room.messages.push(message);
        fsp.writeFile(path + uuid + ".json", JSON.stringify(room)).catch(error => {
          console.log(error);
        })
    })
  },

  user_joined: function UserJoined (user, uuid, path) {
    fsp.readFile((path + uuid + ".json")).then(data => {
      const room = JSON.parse(data);
      room.users_online.push(user);
        fsp.writeFile(path + uuid + ".json", JSON.stringify(room)).catch(error => {
          console.log(error);
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
          fsp.writeFile(path + uuid + ".json", JSON.stringify(room)).catch(error => {
            console.log(error);
          })
      })
    }
  }
};
