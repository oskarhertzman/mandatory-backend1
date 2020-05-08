const fsp = require('fs').promises;
const crypto = require('crypto');

// Promises are bae

module.exports = {

  get_rooms: function GetRooms (callback, path) {
    fsp.readFile(path).then(data => {
      callback(JSON.parse(data))
    }).catch(error => {
      console.log(error);
    })
  },

  get_room: function GetRoom (uuid, path, join) {
    fsp.readFile(path + uuid + ".json").then(data => {
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

  update_room: function UpdateRoom (data, path, ref, typeRef, authPath) {
    if(ref === 'create') {
      if(typeRef === 'public'){
        fsp.writeFile(path + data.uuid + ".json", JSON.stringify(data)).catch(error => {
          console.log(error);
        })
      }
      if(typeRef === 'private') {
        const hash = crypto.createHash('sha256');
        hash.update(data.pass);
        let hashedPw = hash.digest('hex');
        let newAuth = {auth: hashedPw, uuid: data.uuid};
        delete data['pass'];
        console.log(data);
        console.log(newAuth);
        fsp.writeFile(path + data.uuid + ".json", JSON.stringify(data)).catch(error => {
          console.log(error);
        })
        fsp.writeFile(authPath + data.uuid + ".json", JSON.stringify(newAuth)).catch(error => {
          console.log(error);
        })
      }
    }
    if (ref === 'update') {
      fsp.readFile(path + data.uuid + ".json").then(roomData => {
        const room = JSON.parse(roomData);
        room.name = data.name;
        room.topic = data.topic;
        fsp.writeFile(path + data.uuid + ".json", JSON.stringify(room)).catch(error => {
          console.log(error);
        })
      })
    }
    if(ref === 'delete') {
      fsp.unlink(path + data.uuid + ".json").then(() => {
        if (typeRef === 'privateDel') {
          fsp.unlink(authPath + data.uuid + ".json").catch(error => {
            console.log(error);
          })
        }
      })
      .catch(error => {
        console.log(error);
      })
    }
  },

  new_message: function NewMessage (message, uuid, path) {
    fsp.readFile(path + uuid + ".json").then(data => {
      const room = JSON.parse(data);
      room.messages.push(message);
      fsp.writeFile(path + uuid + ".json", JSON.stringify(room)).catch(error => {
        console.log(error);
      })
    })
  },

  delete_message: function DeleteMessage (message, uuid, path, deleted) {
    fsp.readFile(path + uuid + ".json").then(data => {
      const room = JSON.parse(data);
      for (let [index,usr] of room.messages.entries()) {
        if (usr.name === message.name && usr.message === message.message) {
          room.messages.splice(index, 1);
          break;
        }
      }
      deleted(room.messages);
      fsp.writeFile(path + uuid + ".json", JSON.stringify(room)).catch(error => {
        console.log(error);
      })
    })
  },

  user_auth: function UserAuth (authPath, pass, uuid, response) {
    let userPass = pass;
    const hash = crypto.createHash('sha256');
    hash.update(userPass.pass);
    let hashedPw = hash.digest('hex');

    fsp.readFile(authPath + uuid + ".json").then(data => {
      let auth = JSON.parse(data).auth;
      if (hashedPw === auth) {
        response({login: true})
      }
      else {
        response({login: false})
      }
    })
  },

  user_joined: function UserJoined (user, uuid, path) {
    fsp.readFile(path + uuid + ".json").then(data => {
      const room = JSON.parse(data);
      room.users_online.push(user);
      fsp.writeFile(path + uuid + ".json", JSON.stringify(room)).catch(error => {
        console.log(error);
      })
    })
  },

  user_left: function UserLeft (user, uuid, path, leave) {
    if (user) {
      fsp.readFile(path + uuid + ".json").then(data => {
        const room = JSON.parse(data);
        for (let [index,usr] of room.users_online.entries()) {
          if (usr.name === user) {
            room.users_online.splice(index, 1);
            break;
          }
        }
        leave(room.users_online);
        fsp.writeFile(path + uuid + ".json", JSON.stringify(room)).catch(error => {
          console.log(error);
        })
      })
    }
  }
};
